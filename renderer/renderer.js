const SVG_NS = 'http://www.w3.org/2000/svg';

/* Геометрия снята с эталонного видео:
   внутреннее кольцо — 5 узлов через 72° от верхней точки,
   внешнее — 4 узла по диагоналям, поиск — прямо под центром. */
const INNER_RADIUS = 150;
const OUTER_RADIUS = 253;
const SEARCH_OFFSET = 62;
const INNER_START = -Math.PI / 2;
const OUTER_START = -Math.PI / 2 + Math.PI / 6;

const FIRST_OFFSET = 205;
const NEXT_OFFSET = 195;
const COLUMN_STEP = 215;
const ROW_HEIGHT = 68;
const ROWS_PER_COLUMN = 5;
const VANISH_MS = 190;

const linesSvg = document.getElementById('lines');
const nodesLayer = document.getElementById('nodes');

const nodes = new Map();
let nodeSeq = 0;
let centerKey = null;
let searchKey = null;
let drag = null;
let clickable = false;
let searchOpen = false;

let stats = null;
let mailState = { configured: false, unread: 0, messages: [] };
let tabsData = { connected: false, tabs: [] };
let clipboardHistory = [];
let activeApp = null;

/* ------------------------------------------------------------------ */
/*  Мышь сквозь окно                                                   */
/* ------------------------------------------------------------------ */

function setClickable(value) {
  if (value === clickable) return;
  clickable = value;
  if (value) window.desktopAPI.setIgnoreMouseEvents(false);
  else window.desktopAPI.setIgnoreMouseEvents(true, { forward: true });
}

function clampX(x) { return Math.max(120, Math.min(window.innerWidth - 120, x)); }
function clampY(y) { return Math.max(55, Math.min(window.innerHeight - 55, y)); }

function resizeSvg() {
  linesSvg.setAttribute('width', window.innerWidth);
  linesSvg.setAttribute('height', window.innerHeight);
}

/* ------------------------------------------------------------------ */
/*  Разметка узлов                                                     */
/* ------------------------------------------------------------------ */

function favicon(domain) {
  return 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=64';
}

function iconMarkup(data) {
  if (data.icon) return '<span class="icon"><img src="' + data.icon + '" alt="" /></span>';
  if (data.logo) {
    return '<span class="icon"><img src="' + favicon(data.logo) +
      '" alt="" onerror="this.style.display=\'none\'" /></span>';
  }
  return '<span class="icon dotless"></span>';
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildElement(node) {
  const el = document.createElement('div');

  if (node.type === 'center') {
    el.className = 'node center';
    el.innerHTML = '<span class="dot center-dot"><span class="core"></span></span>';
    return el;
  }

  if (node.type === 'search') {
    el.className = 'node search' + (searchOpen ? ' open' : '');
    el.innerHTML = searchOpen
      ? '<span class="search-field"><span class="glyph"></span>' +
        '<input id="search-input" type="text" autocomplete="off" spellcheck="false" placeholder="Начни печатать для поиска" /></span>'
      : '<span class="search-dot"><span class="glyph"></span></span>';
    return el;
  }

  if (node.type === 'main') {
    const data = node.data;
    el.className = 'node main' + (data.isApp ? ' app' : '');
    const fallback = '<span class="dot-fallback">' + escapeHtml(data.code || '') + '</span>';
    const face = data.logo
      ? '<img class="dot-logo" src="' + favicon(data.logo) +
        '" alt="" onerror="this.dataset.failed=\'1\'; this.style.opacity=0;" />' + fallback
      : fallback;
    const badge = data.badge ? '<span class="badge">' + escapeHtml(data.badge) + '</span>' : '';

    el.innerHTML =
      '<span class="dot">' + face + '</span>' + badge +
      '<span class="label"><span class="name">' + escapeHtml(data.label) + '</span>' +
      (data.sub ? '<span class="sub">' + escapeHtml(data.sub) + '</span>' : '') +
      '</span>';
    return el;
  }

  el.className = 'node chip';
  const arrow = node.data.children && node.data.children.length ? '<span class="arrow"></span>' : '';
  el.innerHTML =
    '<span class="chip-body">' + iconMarkup(node.data) +
    '<span class="text"><span class="name">' + escapeHtml(node.data.label) + '</span>' +
    (node.data.sub ? '<span class="sub">' + escapeHtml(node.data.sub) + '</span>' : '') +
    '</span>' + arrow + '</span>';
  return el;
}

function addNode(options) {
  const key = 'n' + (nodeSeq++);
  const node = Object.assign({
    key, parentKey: null, level: 0, x: 0, y: 0, angle: 0, expanded: false, children: []
  }, options);

  node.el = buildElement(node);
  nodesLayer.appendChild(node.el);

  if (node.parentKey !== null) {
    const parent = nodes.get(node.parentKey);
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', 'link');
    linesSvg.appendChild(path);
    node.path = path;
    parent.children.push(key);
  }

  nodes.set(key, node);
  bindNode(node);
  return node;
}

function descendants(key) {
  const node = nodes.get(key);
  if (!node) return [];
  const result = [];
  const stack = node.children.slice();
  while (stack.length) {
    const current = stack.pop();
    const item = nodes.get(current);
    if (!item) continue;
    result.push(current);
    stack.push(...item.children);
  }
  return result;
}

function removeNode(key) {
  const node = nodes.get(key);
  if (!node) return;
  node.el.remove();
  if (node.path) node.path.remove();
  nodes.delete(key);
}

function collapse(node, instant) {
  const kids = descendants(node.key);
  node.children = [];
  node.expanded = false;
  node.el.classList.remove('open');

  if (instant) { kids.forEach(removeNode); return; }

  kids.forEach((key) => {
    const item = nodes.get(key);
    if (!item) return;
    item.el.classList.add('vanish');
    if (item.path) item.path.classList.add('vanish');
  });
  setTimeout(() => kids.forEach(removeNode), VANISH_MS);
}

/* ------------------------------------------------------------------ */
/*  Состав кольца                                                      */
/* ------------------------------------------------------------------ */

function contextNodeData() {
  const profile = profileForApp(activeApp);
  return {
    id: 'context',
    isApp: true,
    label: activeApp ? profile.label : 'Контекст',
    sub: activeApp ? 'активное окно' : 'нет активного окна',
    code: activeApp ? (profile.label || 'APP').slice(0, 3).toUpperCase() : '•',
    logo: activeApp ? profile.logo : null,
    children: profile.children
  };
}

function mailNodeData(base) {
  const data = Object.assign({}, base);

  if (!mailState.configured) {
    data.sub = 'не настроена';
    data.children = [
      { label: 'Настроить почту', sub: 'mail.json в папке данных' },
      { label: 'Открыть Gmail', sub: 'mail.google.com', logo: 'google.com', url: 'https://mail.google.com' }
    ];
    return data;
  }

  if (mailState.error) {
    data.sub = mailState.error;
    data.children = [{ label: 'Повторить', sub: 'переподключение', action: 'mail-retry' }];
    return data;
  }

  data.sub = mailState.unread + ' ' + plural(mailState.unread, 'новое', 'новых', 'новых');
  data.badge = mailState.unread > 99 ? '99+' : String(mailState.unread);
  data.children = mailState.messages.length
    ? mailState.messages.map((message) => ({
        label: message.label,
        sub: message.sub,
        url: 'https://mail.google.com'
      })).concat([{ label: 'Открыть почту', sub: 'все письма', url: 'https://mail.google.com' }])
    : [{ label: 'Непрочитанных нет', sub: 'входящие пусты' }];

  return data;
}

function clipboardNodeData(base) {
  const data = Object.assign({}, base);
  const items = clipboardHistory;

  if (!items.length) {
    data.sub = 'пусто';
    data.children = [{ label: 'История пуста', sub: 'скопируйте что-нибудь' }];
    return data;
  }

  data.sub = items.length + ' ' + plural(items.length, 'запись', 'записи', 'записей');
  data.children = items.map((text, index) => ({
    label: text.length > 38 ? text.slice(0, 38) + '…' : text,
    sub: index === 0 ? 'последнее' : 'вставить',
    clip: text
  })).concat([{ label: 'Журнал буфера', sub: 'Win + V', keys: 'win+v' }]);

  return data;
}

function tabsNodeData(base) {
  const data = Object.assign({}, base);

  if (!tabsData.connected) {
    data.sub = 'браузер не подключён';
    data.children = [
      { label: 'Как подключить', sub: 'расширение в папке browser-extension' },
      { label: 'Новая вкладка', sub: 'Ctrl + T', keys: 'mod+t' }
    ];
    return data;
  }

  data.sub = tabsData.tabs.length + ' ' + plural(tabsData.tabs.length, 'вкладка', 'вкладки', 'вкладок');
  data.children = tabsData.tabs.slice(0, 8).map((tab) => ({
    label: tab.title ? String(tab.title).slice(0, 38) : 'без названия',
    sub: hostOf(tab.url),
    logo: hostOf(tab.url),
    tabId: tab.id
  }));
  return data;
}

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch (err) { return ''; }
}

function plural(count, one, few, many) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function decorate(item) {
  if (item.id === 'context') return contextNodeData();
  if (item.id === 'mail') return mailNodeData(item);
  if (item.id === 'tabs') return tabsNodeData(item);
  if (item.id === 'clipboard') return clipboardNodeData(item);

  const data = Object.assign({}, item);

  if (item.id === 'system' && stats) {
    data.sub = 'CPU ' + stats.cpu + '% · RAM ' + stats.ram + '%';
  }

  if (item.id === 'files' && stats && stats.diskFree != null) {
    data.sub = stats.diskLabel + ' свободно ' + stats.diskFree + ' Гб';
  }

  if (item.id === 'media' && stats) {
    data.sub = stats.media && stats.media.playing
      ? [stats.media.artist, stats.media.title].filter(Boolean).join(' — ').slice(0, 34)
      : 'тишина';
  }

  return data;
}

/* ------------------------------------------------------------------ */
/*  Раскрытие                                                          */
/* ------------------------------------------------------------------ */

function childList(node) {
  if (node.type === 'center') return [];
  return (node.data && node.data.children) || [];
}

function expandCenter(center) {
  center.expanded = true;
  center.el.classList.add('open');

  INNER_RING.forEach((item, index) => {
    const angle = INNER_START + (index / INNER_RING.length) * Math.PI * 2;
    spawnMain(center, decorate(item), angle, INNER_RADIUS, index);
  });

  OUTER_RING.forEach((item, index) => {
    const angle = OUTER_START + (index / OUTER_RING.length) * Math.PI * 2;
    spawnMain(center, decorate(item), angle, OUTER_RADIUS, index + INNER_RING.length);
  });

  const search = addNode({
    parentKey: center.key,
    level: 1,
    type: 'search',
    data: { id: 'search' },
    angle: Math.PI / 2,
    x: center.x,
    y: center.y + SEARCH_OFFSET
  });

  searchKey = search.key;
  search.el.style.setProperty('--sx', '0px');
  search.el.style.setProperty('--sy', -SEARCH_OFFSET + 'px');
  search.el.classList.add('spawn');
  if (search.path) search.path.remove();
  search.path = null;

  draw();
}

function spawnMain(center, data, angle, radius, index) {
  const child = addNode({
    parentKey: center.key,
    level: 1,
    type: 'main',
    data,
    angle,
    x: clampX(center.x + radius * Math.cos(angle)),
    y: clampY(center.y + radius * Math.sin(angle))
  });

  child.el.style.setProperty('--sx', (center.x - child.x) + 'px');
  child.el.style.setProperty('--sy', (center.y - child.y) + 'px');
  child.el.style.animationDelay = (index * 0.03) + 's';
  child.el.classList.add('spawn');

  if (child.path) {
    child.path.style.animationDelay = (index * 0.03) + 's';
    child.path.classList.add('spawn');
  }

  return child;
}

function branchSide(node) {
  if (node.type === 'search') return 1;
  const center = nodes.get(centerKey);
  const dx = center ? node.x - center.x : Math.cos(node.angle);
  if (Math.abs(dx) < 12) return node.x > window.innerWidth / 2 ? -1 : 1;
  return dx < 0 ? -1 : 1;
}

/* Ветка раскрывается вертикальной колонкой в сторону от центра —
   как в эталонном видео. Длинные списки переносятся во вторую колонку. */
function expand(node, list) {
  const items = list || childList(node);
  if (!items.length) return;

  node.expanded = true;
  node.el.classList.add('open');

  let side = branchSide(node);
  const rows = Math.min(items.length, ROWS_PER_COLUMN);
  const columns = Math.ceil(items.length / ROWS_PER_COLUMN);

  /* если у родителя было несколько колонок, дочерняя ветка
     отодвигается за них, чтобы чипы не наезжали друг на друга */
  const behind = node.type === 'leaf'
    ? ((node.totalColumns || 1) - 1 - (node.column || 0)) * COLUMN_STEP
    : 0;

  const reach = (node.type === 'main' || node.type === 'search' ? FIRST_OFFSET : NEXT_OFFSET) + behind;
  const span = (columns - 1) * COLUMN_STEP;

  /* переворачиваем ветку, только если она реально не влезает и
     при этом не протащится через всё кольцо на другую сторону */
  const center = nodes.get(centerKey);
  const overflow = side > 0
    ? node.x + reach + span + 90 - window.innerWidth
    : 90 + reach + span - node.x;

  if (overflow > 120 && center) {
    const flipped = node.x - side * (reach + span);
    const crossesCenter = (node.x - center.x) * (flipped - center.x) < 0;
    if (!crossesCenter) side = -side;
  }

  /* сперва считаем позиции, затем двигаем колонку целиком,
     если она не помещается по вертикали — иначе чипы слипаются */
  const points = items.map((item, index) => {
    const column = Math.floor(index / ROWS_PER_COLUMN);
    const row = index % ROWS_PER_COLUMN;
    const rowsHere = Math.min(items.length - column * ROWS_PER_COLUMN, ROWS_PER_COLUMN);

    const bias = node.type === 'main'
      ? Math.sin(node.angle) * ((rowsHere - 1) / 2) * ROW_HEIGHT * 0.9
      : 0;

    return {
      item, index, column,
      x: node.x + side * (reach + column * COLUMN_STEP),
      y: node.y + (row - (rowsHere - 1) / 2) * ROW_HEIGHT + bias
    };
  });

  for (let column = 0; column < columns; column++) {
    const inColumn = points.filter((point) => point.column === column);
    const top = Math.min(...inColumn.map((point) => point.y));
    const bottom = Math.max(...inColumn.map((point) => point.y));

    let shift = 0;
    if (top < 60) shift = 60 - top;
    else if (bottom > window.innerHeight - 60) shift = window.innerHeight - 60 - bottom;

    if (shift) inColumn.forEach((point) => { point.y += shift; });
  }

  points.forEach((point) => {
    const child = addNode({
      column: point.column,
      totalColumns: columns,
      parentKey: node.key,
      level: node.level + 1,
      type: 'leaf',
      data: point.item,
      angle: side > 0 ? 0 : Math.PI,
      x: clampX(point.x),
      y: point.y
    });

    child.el.style.setProperty('--sx', (node.x - child.x) + 'px');
    child.el.style.setProperty('--sy', (node.y - child.y) + 'px');
    child.el.style.animationDelay = (point.index * 0.035) + 's';
    child.el.classList.add('spawn');

    if (child.path) {
      child.path.style.animationDelay = (point.index * 0.035) + 's';
      child.path.classList.add('spawn');
    }
  });

  draw();
}

/* ------------------------------------------------------------------ */
/*  Линии                                                              */
/* ------------------------------------------------------------------ */

function anchorOf(node, fromX) {
  if (node.type !== 'leaf') return { x: node.x, y: node.y };
  const width = node.el.offsetWidth || 150;
  const side = fromX < node.x ? -1 : 1;
  return { x: node.x + side * (width / 2 - 4), y: node.y };
}

function draw() {
  nodes.forEach((node) => {
    node.el.style.left = node.x + 'px';
    node.el.style.top = node.y + 'px';
  });

  nodes.forEach((node) => {
    if (!node.path) return;
    const parent = nodes.get(node.parentKey);
    if (!parent) return;
    const from = anchorOf(parent, node.x);
    const to = anchorOf(node, parent.x);
    const dx = (to.x - from.x) * 0.55;
    node.path.setAttribute(
      'd',
      'M ' + from.x + ' ' + from.y +
      ' C ' + (from.x + dx) + ' ' + from.y +
      ', ' + (to.x - dx) + ' ' + to.y +
      ', ' + to.x + ' ' + to.y
    );
  });
}

/* ------------------------------------------------------------------ */
/*  Поиск приложений                                                   */
/* ------------------------------------------------------------------ */

let searchTimer = null;

function openSearch() {
  const node = nodes.get(searchKey);
  if (!node) return;

  searchOpen = true;
  window.desktopAPI.setSearchMode(true);
  rebuildElement(node);
  node.el.classList.add('open');

  const input = node.el.querySelector('#search-input');
  if (input) {
    setTimeout(() => input.focus(), 30);
    input.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => runSearch(input.value), 140);
    });
    input.addEventListener('keydown', (event) => {
      event.stopPropagation();
      if (event.key === 'Escape') closeSearch();
    });
    input.addEventListener('mousedown', (event) => event.stopPropagation());
  }

  draw();
}

function closeSearch() {
  const node = nodes.get(searchKey);
  searchOpen = false;
  window.desktopAPI.setSearchMode(false);
  if (!node) return;

  collapse(node, true);
  rebuildElement(node);
  draw();
}

function runSearch(query) {
  const node = nodes.get(searchKey);
  if (!node) return;

  if (!query || !query.trim()) { collapse(node, true); draw(); return; }

  window.desktopAPI.searchApps(query).then((results) => {
    if (!searchOpen) return;
    collapse(node, true);
    node.expanded = false;
    if (!results.length) {
      expand(node, [{ label: 'Ничего не найдено', sub: query }]);
      return;
    }
    expand(node, results.map((item) => ({
      label: item.label, sub: item.sub, icon: item.icon, path: item.path
    })));
  });
}

function rebuildElement(node) {
  const fresh = buildElement(node);
  fresh.style.left = node.x + 'px';
  fresh.style.top = node.y + 'px';
  node.el.replaceWith(fresh);
  node.el = fresh;
  bindNode(node);
}

/* ------------------------------------------------------------------ */
/*  Клики и перетаскивание                                             */
/* ------------------------------------------------------------------ */

function activate(node) {
  if (node.type === 'center') {
    if (node.expanded) {
      if (searchOpen) closeSearch();
      collapse(node);
      searchKey = null;
    } else expandCenter(node);
    draw();
    return;
  }

  if (node.type === 'search') {
    if (searchOpen) closeSearch();
    else openSearch();
    return;
  }

  const items = childList(node);

  if (items.length) {
    if (node.expanded) collapse(node);
    else {
      const parent = nodes.get(node.parentKey);
      if (parent) {
        parent.children.forEach((key) => {
          const sibling = nodes.get(key);
          if (sibling && sibling !== node && sibling.expanded) collapse(sibling);
        });
      }
      expand(node);
    }
    draw();
    return;
  }

  const payload = {};
  ['keys', 'url', 'path', 'cmd', 'tabId', 'clip'].forEach((field) => {
    if (node.data[field]) payload[field] = node.data[field];
  });
  if (Object.keys(payload).length) window.desktopAPI.launch(payload);
}

function bindNode(node) {
  node.el.addEventListener('mousedown', (event) => {
    if (event.target && event.target.tagName === 'INPUT') return;
    event.preventDefault();
    event.stopPropagation();
    setClickable(true);

    const keys = [node.key, ...descendants(node.key)];
    drag = {
      key: node.key,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      origin: keys.map((key) => {
        const item = nodes.get(key);
        return { key, x: item.x, y: item.y };
      })
    };
    node.el.classList.add('dragging');
  });
}

/* Это окно растянуто на весь экран и ловит каждое движение мыши,
   чтобы понять, навели ли вы на узел. Мышь с высокой частотой опроса
   (500–1000 Гц) шлёт сотни таких событий в секунду, и раньше на
   КАЖДОЕ из них шёл синхронный тест положения плюс — при пересечении
   границы узла — системный вызов, который меняет перехват кликов у
   окна. Это и давало подтормаживание курсора по всему столу, даже
   когда меню было свёрнуто. Теперь проверяем позицию не чаще одного
   раза за кадр отрисовки. */
let pendingX = 0;
let pendingY = 0;
let hitTestScheduled = false;

function scheduleHitTest() {
  if (hitTestScheduled) return;
  hitTestScheduled = true;
  requestAnimationFrame(() => {
    hitTestScheduled = false;
    const target = document.elementFromPoint(pendingX, pendingY);
    setClickable(!!(target && target.closest('.node')));
  });
}

document.addEventListener('mousemove', (event) => {
  if (drag) {
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
    drag.origin.forEach((item) => {
      const node = nodes.get(item.key);
      if (!node) return;
      node.x = clampX(item.x + dx);
      node.y = clampY(item.y + dy);
    });
    draw();
    return;
  }

  pendingX = event.clientX;
  pendingY = event.clientY;
  scheduleHitTest();
});

document.addEventListener('mouseup', () => {
  if (!drag) return;
  const node = nodes.get(drag.key);
  if (node) {
    node.el.classList.remove('dragging');
    if (!drag.moved) activate(node);
  }
  drag = null;
});

/* ------------------------------------------------------------------ */
/*  Живые данные                                                       */
/* ------------------------------------------------------------------ */

function ringNodeById(id) {
  let found = null;
  nodes.forEach((node) => {
    if (node.type === 'main' && node.data && node.data.id === id) found = node;
  });
  return found;
}

function applyStats() {
  const map = { system: 1, files: 1, media: 1, mail: 1, tabs: 1, clipboard: 1 };

  Object.keys(map).forEach((id) => {
    const node = ringNodeById(id);
    if (!node) return;

    const source = INNER_RING.concat(OUTER_RING).find((item) => item.id === id);
    if (!source) return;

    const fresh = decorate(source);
    node.data = Object.assign(node.data, fresh);

    const sub = node.el.querySelector('.label .sub');
    if (sub) sub.textContent = fresh.sub || '';

    let badge = node.el.querySelector('.badge');
    if (fresh.badge) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'badge';
        node.el.insertBefore(badge, node.el.querySelector('.label'));
      }
      badge.textContent = fresh.badge;
    } else if (badge) badge.remove();
  });
}

function refreshContextNode() {
  const node = ringNodeById('context');
  if (!node) return;

  const fresh = contextNodeData();
  if (node.data.label === fresh.label && node.data.sub === fresh.sub) return;

  collapse(node, true);
  node.data = fresh;
  rebuildElement(node);
  draw();
}

function pollStats() {
  window.desktopAPI.getStats().then((info) => {
    stats = info;
    applyStats();
  });
}

function pollMail() {
  window.desktopAPI.getMail().then((info) => { mailState = info; applyStats(); });
}

function pollTabs() {
  window.desktopAPI.getTabs().then((info) => { tabsData = info; applyStats(); });
}

function pollClipboard() {
  window.desktopAPI.getClipboard().then((items) => { clipboardHistory = items || []; applyStats(); });
}

/* Esc — свернуть меню, правая кнопка — закрыть все ветки */
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (searchOpen) { closeSearch(); return; }
  const center = nodes.get(centerKey);
  if (center && center.expanded) { collapse(center); searchKey = null; draw(); }
});

document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  const center = nodes.get(centerKey);
  if (!center || !center.expanded) return;
  center.children.forEach((key) => {
    const node = nodes.get(key);
    if (node && node.expanded) collapse(node);
  });
  draw();
});

/* ------------------------------------------------------------------ */
/*  Старт                                                              */
/* ------------------------------------------------------------------ */

function buildGraph() {
  nodes.forEach((node) => {
    node.el.remove();
    if (node.path) node.path.remove();
  });
  nodes.clear();
  nodeSeq = 0;
  searchKey = null;
  searchOpen = false;

  const center = addNode({
    type: 'center',
    level: 0,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  centerKey = center.key;
  draw();
}

window.desktopAPI.onActiveApp((info) => {
  activeApp = info;
  refreshContextNode();
});

window.desktopAPI.getActiveApp().then((info) => {
  if (info) { activeApp = info; refreshContextNode(); }
});

window.addEventListener('resize', () => {
  resizeSvg();
  nodes.forEach((node) => {
    node.x = clampX(node.x);
    node.y = clampY(node.y);
  });
  draw();
});

resizeSvg();
buildGraph();
pollStats();
pollMail();
pollTabs();
pollClipboard();

setInterval(pollStats, 2000);
setInterval(pollClipboard, 2000);
setInterval(pollMail, 30000);
setInterval(pollTabs, 5000);
