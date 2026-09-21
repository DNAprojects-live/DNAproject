const { app, BrowserWindow, screen, ipcMain, shell, clipboard, Tray, Menu, nativeImage } = require('electron');
const { exec, spawn } = require('child_process');
const http = require('http');
const tls = require('tls');
const net = require('net');
const fs = require('fs');
const os = require('os');
const path = require('path');

let win;
let tray;
let lastApp = null;

const TRAY_ICON_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAD9ElEQVR4nL1XW28bRRQ+c9nZezZr7/oSJ3biRE6iNgGRgqqkolIegPfCI/AbKvEP+CskPCBeUd9AogKJN0SRokKcQkmVEG8S78Xeza5neSgWBgl7Yzv9HmfnzPfNN+ecnQGYEhBCAAAgyzKyLIsMjt04+kSmaeKdnXsLlNJXRw4AgDEGhBBsb++sFotFOijqxtEnqlQqWrVazRNCrhWPJyVP0xRKpTK9e3f7rdPT0/NarWYYhiFgnE0InYaAYrFoBkFXiaIobTabbUop0nVdBkiTdrsdD1tjIgf6MAxDrddrBUoptixbkmUZdTpBN5fLz46KnYqA84sL99mz346TJOGO0woxxsS2C/rZ2Z+Xo2InStX+EQiCgIql8kLg+2e5nIkxxszzvMRxHD+O43QSjkzAGKP19Vube3v7X362t/9NpTJfEASWaXNjO0AIhVwup4VhN2VMVO/f39217Bz/fH/vC8/zMu/6WgL6luv6DNvY2Hyz3W63nz49OJBlBTPGaJwkqu95Z5z3IE0BAEbryCzgn5qfmymViguO45xcXl5ceJ7H+98bjbVqksTdw8Nfz/rzRyFzFfSTrb68vHp8fHzw/PnvjqqqYr2+PFsulyVCKPCUh3OVhfWsa2YW0G+v77z7XmNpcbHgOC0uiiKcnJx0m83DS9d1r0SRCb7ndhVZTl6252xpkKkT9p1M4iQJw4jIsoxLpZLOezxxzp2O67ocAHgQBHFtcakFEALOp1h9/R+OKIrItm3VNE0CAKCqGrbtgpjP5xkhBG1t3VlrNFZzgzFTBcYYDMOQVtfW19AAg2XZ0spKo75UXy5jfL3mOpbMhw8/+TSKop8fPfrqa4ExWRTFGc/1XhwdHbbGWS8TMMYgihJSVY09eP+D3e++/yF9Y+vOLQBAN3b5GLhqsWqtVrBt22CMUcYY3rn39q6m6fJ/516bY9SE+fkFU1Zk23PdU9/3O1EUJXEcp4QQLDBGozC8ytJw/g9Dy1BRFEHTdLN5dPjLVRSlAACSJBFJkmmP93oEYRSNTf0SQ1P2w48+fnB+3nohEEosy5YkSUJhGPY8z42uoqgnMEEwZmclgPGPYKiAYqm4wnnKg06QuG47UlWVFQpFmVKKkiRJNU3HAqW9sZj/xlDZmqaJlmUrQeAHvu/H3W43RQgBIQTdvr0xxzlHT5789AfnfGwBQ3PA9/1IEBjVNI3FccwJIUgURawomqbruvX48bc/TpKAACMcQAiBqmoSFQQGKQ9kWVHDMLwKwzDudjsTWZ8ZgiCgzdde31AU5V9ip9V8RjZuXddxPpcXe71eOkg8qfWZQCmFarWqvtKH5iBmTZNKkoQBbu6x+RcbgXWMqUM2pAAAAABJRU5ErkJggg==';

const PLATFORM = process.platform === 'win32' ? 'win' : process.platform === 'darwin' ? 'mac' : 'linux';

const SELF_NAMES = ['electron', 'radial-desktop', 'radial desktop'];

const WIN_SPECIAL = {
  esc: '{ESC}', escape: '{ESC}', enter: '{ENTER}', tab: '{TAB}', del: '{DEL}', delete: '{DEL}',
  backspace: '{BS}', space: ' ', up: '{UP}', down: '{DOWN}', left: '{LEFT}', right: '{RIGHT}',
  home: '{HOME}', end: '{END}', pgup: '{PGUP}', pgdn: '{PGDN}', insert: '{INS}',
  f1: '{F1}', f2: '{F2}', f3: '{F3}', f4: '{F4}', f5: '{F5}', f6: '{F6}',
  f7: '{F7}', f8: '{F8}', f9: '{F9}', f10: '{F10}', f11: '{F11}', f12: '{F12}',
  plus: '{ADD}', minus: '{SUBTRACT}'
};

const MAC_KEYCODE = {
  esc: 53, escape: 53, enter: 36, tab: 48, del: 117, delete: 51, backspace: 51,
  space: 49, up: 126, down: 125, left: 123, right: 124, home: 115, end: 119,
  f1: 122, f2: 120, f3: 99, f4: 118, f5: 96, f6: 97, f7: 98, f8: 100,
  f9: 101, f10: 109, f11: 103, f12: 111
};

/* ------------------------------------------------------------------ */
/*  Окно и трей                                                        */
/* ------------------------------------------------------------------ */

function createWindow() {
  const display = screen.getPrimaryDisplay();

  win = new BrowserWindow({
    x: display.workArea.x,
    y: display.workArea.y,
    width: display.workAreaSize.width,
    height: display.workAreaSize.height,
    transparent: true,
    frame: false,
    skipTaskbar: true,
    hasShadow: false,
    resizable: false,
    fullscreenable: false,
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.setIgnoreMouseEvents(true, { forward: true });

  screen.on('display-metrics-changed', () => {
    const updated = screen.getPrimaryDisplay();
    win.setBounds({
      x: updated.workArea.x,
      y: updated.workArea.y,
      width: updated.workAreaSize.width,
      height: updated.workAreaSize.height
    });
  });
}

function toggleWindow() {
  if (!win) return;
  if (win.isVisible()) win.hide();
  else win.showInactive();
}

function createTray() {
  tray = new Tray(nativeImage.createFromDataURL('data:image/png;base64,' + TRAY_ICON_BASE64));
  tray.setToolTip('Radial Desktop Menu');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Показать / скрыть', click: toggleWindow },
    { type: 'separator' },
    { label: 'Выход', click: () => app.quit() }
  ]));
  tray.on('click', toggleWindow);
}

function run(command) {
  return new Promise((resolve) => {
    exec(command, { windowsHide: true, timeout: 6000, maxBuffer: 4 * 1024 * 1024 }, (err, stdout) => {
      resolve(err ? '' : String(stdout).trim());
    });
  });
}

function ps(script) {
  const encoded = Buffer.from(script, 'utf16le').toString('base64');
  return run('powershell -NoProfile -NonInteractive -WindowStyle Hidden -EncodedCommand ' + encoded);
}

/* --------------------------------------------------------------- */
/*  Постоянный процесс PowerShell                                    */
/*  Раньше каждый опрос активного окна и трека запускал НОВЫЙ         */
/*  powershell.exe и заново компилировал Add-Type — это тяжёлая       */
/*  операция (и вдобавок каждый новый процесс цепляет антивирус на    */
/*  проверку), из-за чего система подвисала каждые 1.5–4 секунды      */
/*  сама по себе, даже когда меню не трогали. Держим один процесс     */
/*  живым всю сессию и просто пишем ему команды в stdin.              */
/* --------------------------------------------------------------- */

let psProc = null;
let psReady = false;
let psQueue = [];
let psBuffer = '';
const PS_MARKER = '\u0001EOC\u0001';

function startPersistentPS() {
  if (PLATFORM !== 'win') return;

  try {
    psProc = spawn('powershell.exe', ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', '-'], { windowsHide: true });
  } catch (err) {
    psProc = null;
    return;
  }

  psReady = false;
  psBuffer = '';

  psProc.stdout.setEncoding('utf8');
  psProc.stdout.on('data', (chunk) => {
    psBuffer += chunk;
    let index;
    while ((index = psBuffer.indexOf(PS_MARKER)) !== -1) {
      const out = psBuffer.slice(0, index).trim();
      psBuffer = psBuffer.slice(index + PS_MARKER.length);
      const resolve = psQueue.shift();
      if (resolve) resolve(out);
    }
  });

  psProc.on('error', () => { psProc = null; psReady = false; });

  psProc.on('exit', () => {
    psProc = null;
    psReady = false;
    psQueue.splice(0).forEach((resolve) => resolve(''));
    setTimeout(startPersistentPS, 3000);
  });

  /* Типы P/Invoke компилируются один раз при старте процесса,
     а не при каждом опросе — это и убирает основную нагрузку. */
  const bootstrap =
    'Add-Type -Namespace Fg -Name Api -MemberDefinition \'' +
    '[DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow(); ' +
    '[DllImport("user32.dll")] public static extern int GetWindowThreadProcessId(IntPtr h, out int p);\'; ' +
    'Add-Type -Namespace Kb -Name Api -MemberDefinition \'[DllImport("user32.dll")] public static extern void keybd_event(byte b, byte s, uint f, int e);\'; ' +
    'Write-Output "' + PS_MARKER + '"';

  try {
    psProc.stdin.write(bootstrap + '\r\n');
    psReady = true;
  } catch (err) {
    psReady = false;
  }
}

function psRun(command) {
  return new Promise((resolve) => {
    if (!psProc || !psReady) { resolve(''); return; }
    psQueue.push(resolve);
    try {
      psProc.stdin.write(command + '; Write-Output "' + PS_MARKER + '"\r\n');
    } catch (err) {
      psQueue.pop();
      resolve('');
    }
  });
}

/* ------------------------------------------------------------------ */
/*  Активное окно                                                      */
/* ------------------------------------------------------------------ */

const DETECT_WIN_BODY =
  '$h=[Fg.Api]::GetForegroundWindow(); $p=0; [void][Fg.Api]::GetWindowThreadProcessId($h,[ref]$p); ' +
  '$proc=Get-Process -Id $p -ErrorAction SilentlyContinue; ' +
  'if($proc){ Write-Output ($proc.Id.ToString() + \'|\' + $proc.ProcessName + \'|\' + $proc.MainWindowTitle) }';

const DETECT = {
  mac: 'osascript -e \'tell application "System Events" to set p to first application process whose frontmost is true\' -e \'tell application "System Events" to get (unix id of p as string) & "|" & (name of p) & "|" & (name of p)\'',
  linux: 'xdotool getactivewindow getwindowpid getwindowclassname getwindowname 2>/dev/null | paste -sd "|"'
};

async function detectActiveApp() {
  const raw = PLATFORM === 'win'
    ? (psReady ? await psRun(DETECT_WIN_BODY) : '')
    : await run(DETECT[PLATFORM]);
  if (!raw) return;

  const parts = raw.split('|');
  const pid = parseInt(parts[0], 10);
  const name = (parts[1] || '').trim();
  const title = (parts[2] || '').trim();

  if (!name) return;
  if (SELF_NAMES.includes(name.toLowerCase())) return;

  if (!lastApp || lastApp.name !== name || lastApp.title !== title) {
    lastApp = { pid, name, title };
    send('active-app', lastApp);
  }
}

function send(channel, payload) {
  if (win && !win.isDestroyed()) win.webContents.send(channel, payload);
}

/* ------------------------------------------------------------------ */
/*  Живая статистика: CPU, RAM, диск                                   */
/* ------------------------------------------------------------------ */

let cpuSnapshot = null;
let diskFree = null;
let diskLabel = PLATFORM === 'win' ? 'C:' : '/';

function cpuPercent() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) total += cpu.times[type];
    idle += cpu.times.idle;
  });

  const snapshot = { idle, total };
  if (!cpuSnapshot) {
    cpuSnapshot = snapshot;
    return 0;
  }

  const idleDelta = snapshot.idle - cpuSnapshot.idle;
  const totalDelta = snapshot.total - cpuSnapshot.total;
  cpuSnapshot = snapshot;

  if (totalDelta <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((1 - idleDelta / totalDelta) * 100)));
}

async function refreshDisk() {
  if (PLATFORM === 'win') {
    const out = await ps('$d = Get-PSDrive -Name C -ErrorAction SilentlyContinue; if ($d) { [math]::Round($d.Free / 1GB) }');
    if (out) diskFree = parseInt(out, 10);
    diskLabel = 'C:';
    return;
  }

  const out = await run('df -k / | tail -1');
  const columns = out.split(/\s+/);
  if (columns.length > 3) diskFree = Math.round(parseInt(columns[3], 10) / 1024 / 1024);
  diskLabel = '/';
}

/* ------------------------------------------------------------------ */
/*  Медиа: что сейчас играет                                           */
/* ------------------------------------------------------------------ */

const PLAYERS = ['spotify', 'aimp', 'vlc', 'foobar2000', 'musicbee', 'yandexmusic', 'itunes', 'music', 'deezer', 'winamp'];
let mediaState = { playing: false, title: '', artist: '', player: '' };

async function refreshMedia() {
  if (PLATFORM === 'win') {
    const script =
      'Get-Process | Where-Object { $_.MainWindowTitle -ne "" } | ' +
      'Select-Object ProcessName, MainWindowTitle | ForEach-Object { $_.ProcessName + "|" + $_.MainWindowTitle }';
    const out = psReady ? await psRun(script) : await ps(script);

    const line = out.split(/\r?\n/).map((row) => row.trim()).find((row) => {
      const name = row.split('|')[0].toLowerCase();
      return PLAYERS.some((player) => name.includes(player));
    });

    if (!line) {
      mediaState = { playing: false, title: '', artist: '', player: '' };
      return;
    }

    const [player, ...rest] = line.split('|');
    const title = rest.join('|').trim();
    const idle = title.toLowerCase() === player.toLowerCase() || /^(spotify|aimp|vlc|музыка|music)$/i.test(title);

    if (idle) {
      mediaState = { playing: false, title: '', artist: '', player };
      return;
    }

    const dash = title.split(' - ');
    mediaState = {
      playing: true,
      player,
      artist: dash.length > 1 ? dash[0].trim() : '',
      title: dash.length > 1 ? dash.slice(1).join(' - ').trim() : title
    };
    return;
  }

  if (PLATFORM === 'linux') {
    const status = await run('playerctl status 2>/dev/null');
    if (status.toLowerCase() !== 'playing') {
      mediaState = { playing: false, title: '', artist: '', player: '' };
      return;
    }
    const title = await run('playerctl metadata title 2>/dev/null');
    const artist = await run('playerctl metadata artist 2>/dev/null');
    mediaState = { playing: true, title, artist, player: 'playerctl' };
    return;
  }

  const out = await run('osascript -e \'tell application "Music" to if player state is playing then (get name of current track) & "|" & (get artist of current track)\' 2>/dev/null');
  if (!out) {
    mediaState = { playing: false, title: '', artist: '', player: '' };
    return;
  }
  const [title, artist] = out.split('|');
  mediaState = { playing: true, title: title || '', artist: artist || '', player: 'Music' };
}

/* ------------------------------------------------------------------ */
/*  История буфера обмена                                              */
/* ------------------------------------------------------------------ */

const CLIPBOARD_LIMIT = 8;
let clipboardHistory = [];
let lastClipboard = '';

function pollClipboard() {
  let text = '';
  try { text = clipboard.readText(); } catch (err) { return; }

  text = String(text || '').trim();
  if (!text || text === lastClipboard || text.length > 2000) return;

  lastClipboard = text;
  clipboardHistory = [text].concat(clipboardHistory.filter((item) => item !== text)).slice(0, CLIPBOARD_LIMIT);
}

/* ------------------------------------------------------------------ */
/*  Почта: минимальный IMAP-клиент без зависимостей                    */
/* ------------------------------------------------------------------ */

const MAIL_CONFIG_PATHS = [
  path.join(app.getPath('userData'), 'mail.json'),
  path.join(__dirname, 'mail.json')
];

let mailState = { configured: false, unread: 0, messages: [], error: '' };

function readMailConfig() {
  for (const file of MAIL_CONFIG_PATHS) {
    try {
      if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      return null;
    }
  }
  return null;
}

function decodeWord(value) {
  return String(value).replace(/=\?([^?]+)\?([BbQq])\?([^?]*)\?=/g, (match, charset, encoding, text) => {
    try {
      const buffer = encoding.toUpperCase() === 'B'
        ? Buffer.from(text, 'base64')
        : Buffer.from(text.replace(/_/g, ' ').replace(/=([A-Fa-f0-9]{2})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16))), 'binary');
      const name = charset.toLowerCase();
      if (name === 'utf-8' || name === 'utf8') return buffer.toString('utf8');
      if (name === 'koi8-r' || name.startsWith('windows-125') || name.startsWith('iso-8859')) {
        return new TextDecoder(name).decode(buffer);
      }
      return buffer.toString('utf8');
    } catch (err) {
      return match;
    }
  }).replace(/\s+/g, ' ').trim();
}

function imapFetch(config) {
  return new Promise((resolve, reject) => {
    const port = config.port || 993;
    const useTls = config.tls !== false;
    const socket = useTls
      ? tls.connect({ host: config.host, port, servername: config.host, rejectUnauthorized: false })
      : net.connect({ host: config.host, port });

    let buffer = '';
    let step = 0;
    let unread = 0;
    let uids = [];
    const messages = [];
    const timer = setTimeout(() => { socket.destroy(); reject(new Error('таймаут')); }, 15000);

    const write = (tag, command) => socket.write(tag + ' ' + command + '\r\n');

    const finish = (err) => {
      clearTimeout(timer);
      try { socket.end(); } catch (e) { /* ignore */ }
      if (err) reject(err);
      else resolve({ unread, messages });
    };

    socket.on('error', (err) => { clearTimeout(timer); reject(err); });

    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8');

      if (step === 0 && /^\* OK/m.test(buffer)) {
        buffer = '';
        step = 1;
        write('a1', 'LOGIN "' + config.user + '" "' + String(config.pass).replace(/"/g, '\\"') + '"');
        return;
      }

      if (step === 1 && /^a1 /m.test(buffer)) {
        if (!/^a1 OK/m.test(buffer)) return finish(new Error('логин отклонён'));
        buffer = '';
        step = 2;
        write('a2', 'SELECT "' + (config.mailbox || 'INBOX') + '"');
        return;
      }

      if (step === 2 && /^a2 /m.test(buffer)) {
        if (!/^a2 OK/m.test(buffer)) return finish(new Error('папка недоступна'));
        buffer = '';
        step = 3;
        write('a3', 'SEARCH UNSEEN');
        return;
      }

      if (step === 3 && /^a3 /m.test(buffer)) {
        const line = (buffer.match(/^\* SEARCH([^\r\n]*)/m) || [])[1] || '';
        uids = line.trim().split(/\s+/).filter(Boolean);
        unread = uids.length;
        buffer = '';

        if (!unread) return finish(null);

        const slice = uids.slice(-6).reverse().join(',');
        step = 4;
        write('a4', 'FETCH ' + slice + ' (BODY.PEEK[HEADER.FIELDS (FROM SUBJECT)])');
        return;
      }

      if (step === 4 && /^a4 /m.test(buffer)) {
        const blocks = buffer.split(/^\* \d+ FETCH/m).slice(1);

        blocks.forEach((block) => {
          const from = (block.match(/^From:\s*([^\r\n]*(?:\r?\n[ \t][^\r\n]*)*)/mi) || [])[1] || '';
          const subject = (block.match(/^Subject:\s*([^\r\n]*(?:\r?\n[ \t][^\r\n]*)*)/mi) || [])[1] || '';
          const cleanFrom = decodeWord(from);
          const address = (cleanFrom.match(/<([^>]+)>/) || [])[1] || cleanFrom;
          const display = cleanFrom.replace(/<[^>]*>/, '').replace(/"/g, '').trim();

          messages.push({
            label: display || address,
            sub: decodeWord(subject) || 'без темы',
            address
          });
        });

        return finish(null);
      }
    });
  });
}

async function refreshMail() {
  const config = readMailConfig();
  if (!config || !config.host || !config.user) {
    mailState = { configured: false, unread: 0, messages: [], error: '' };
    return;
  }

  try {
    const result = await imapFetch(config);
    mailState = { configured: true, unread: result.unread, messages: result.messages, error: '' };
  } catch (err) {
    mailState = { configured: true, unread: 0, messages: [], error: err.message || 'ошибка' };
  }
}

/* ------------------------------------------------------------------ */
/*  Вкладки браузера: локальный мост для расширения                    */
/* ------------------------------------------------------------------ */

const BRIDGE_PORT = 7788;
let tabsState = { tabs: [], updated: 0 };

function startBridge() {
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    if (req.method === 'POST' && req.url === '/tabs') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; if (body.length > 400000) req.destroy(); });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          tabsState = { tabs: Array.isArray(parsed) ? parsed.slice(0, 40) : [], updated: Date.now() };
        } catch (err) { /* ignore */ }
        res.writeHead(200); res.end('ok');
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/activate') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => { res.writeHead(200); res.end('ok'); });
      return;
    }

    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, pending: pendingTabAction }));
    pendingTabAction = null;
  });

  server.on('error', () => { /* порт занят — мост просто не работает */ });
  server.listen(BRIDGE_PORT, '127.0.0.1');
}

let pendingTabAction = null;

function tabsConnected() {
  return Date.now() - tabsState.updated < 12000;
}

/* ------------------------------------------------------------------ */
/*  Поиск установленных приложений                                     */
/* ------------------------------------------------------------------ */

let appIndex = [];

function walk(dir, depth, out) {
  if (depth < 0) return;
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (err) { return; }

  entries.forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full, depth - 1, out); return; }
    const ext = path.extname(entry.name).toLowerCase();
    if (ext === '.lnk' || ext === '.url' || ext === '.appref-ms') {
      out.push({ label: path.basename(entry.name, ext), path: full });
    }
  });
}

function parseDesktopFile(file) {
  try {
    const text = fs.readFileSync(file, 'utf8');
    if (/NoDisplay\s*=\s*true/i.test(text)) return null;
    const name = (text.match(/^Name(?:\[ru\])?\s*=\s*(.+)$/m) || [])[1];
    if (!name) return null;
    return { label: name.trim(), path: file };
  } catch (err) {
    return null;
  }
}

function buildAppIndex() {
  const found = [];

  if (PLATFORM === 'win') {
    const roots = [
      path.join(process.env.ProgramData || 'C:\\ProgramData', 'Microsoft', 'Windows', 'Start Menu', 'Programs'),
      path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs'),
      path.join(os.homedir(), 'Desktop'),
      path.join(process.env.PUBLIC || 'C:\\Users\\Public', 'Desktop')
    ];
    roots.forEach((root) => walk(root, 3, found));
  } else if (PLATFORM === 'mac') {
    ['/Applications', '/System/Applications', path.join(os.homedir(), 'Applications')].forEach((root) => {
      let entries = [];
      try { entries = fs.readdirSync(root); } catch (err) { return; }
      entries.filter((name) => name.endsWith('.app')).forEach((name) => {
        found.push({ label: name.replace(/\.app$/, ''), path: path.join(root, name) });
      });
    });
  } else {
    ['/usr/share/applications', path.join(os.homedir(), '.local/share/applications')].forEach((root) => {
      let entries = [];
      try { entries = fs.readdirSync(root); } catch (err) { return; }
      entries.filter((name) => name.endsWith('.desktop')).forEach((name) => {
        const item = parseDesktopFile(path.join(root, name));
        if (item) found.push(item);
      });
    });
  }

  const seen = new Set();
  appIndex = found.filter((item) => {
    const key = item.label.toLowerCase();
    if (seen.has(key) || key.length < 2) return false;
    if (/(uninstall|удалить|readme|документация|website|веб-сайт|help)/i.test(item.label)) return false;
    seen.add(key);
    return true;
  });
}

const iconCache = new Map();

async function iconsFor(items) {
  if (PLATFORM !== 'win') return {};

  const missing = items.filter((item) => !iconCache.has(item.path));
  if (missing.length) {
    const list = missing.map((item) => "'" + item.path.replace(/'/g, "''") + "'").join(',');
    const out = await ps(
      'Add-Type -AssemblyName System.Drawing; ' +
      '$paths = @(' + list + '); ' +
      'foreach ($p in $paths) { try { ' +
      '$icon = [System.Drawing.Icon]::ExtractAssociatedIcon($p); ' +
      'if ($icon) { $ms = New-Object System.IO.MemoryStream; ' +
      '$icon.ToBitmap().Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); ' +
      'Write-Output ($p + "::" + [Convert]::ToBase64String($ms.ToArray())) } } catch { } }'
    );

    out.split(/\r?\n/).forEach((line) => {
      const index = line.indexOf('::');
      if (index === -1) return;
      iconCache.set(line.slice(0, index).trim(), 'data:image/png;base64,' + line.slice(index + 2).trim());
    });

    missing.forEach((item) => { if (!iconCache.has(item.path)) iconCache.set(item.path, ''); });
  }

  const result = {};
  items.forEach((item) => { result[item.path] = iconCache.get(item.path) || ''; });
  return result;
}

function scoreMatch(label, query) {
  const name = label.toLowerCase();
  if (name === query) return 0;
  if (name.startsWith(query)) return 1;
  const words = name.split(/[\s\-_.]+/);
  if (words.some((word) => word.startsWith(query))) return 2;
  if (name.includes(query)) return 3;
  return -1;
}

/* ------------------------------------------------------------------ */
/*  Отправка горячих клавиш                                            */
/* ------------------------------------------------------------------ */

function parseKeys(spec) {
  const parts = String(spec).toLowerCase().split('+').map((p) => p.trim()).filter(Boolean);
  const mods = [];
  let key = '';

  parts.forEach((part) => {
    if (part === 'mod') mods.push(PLATFORM === 'mac' ? 'cmd' : 'ctrl');
    else if (['ctrl', 'control', 'shift', 'alt', 'option', 'cmd', 'command', 'win', 'super'].includes(part)) {
      mods.push(part === 'control' ? 'ctrl' : part === 'option' ? 'alt' : part === 'command' ? 'cmd' : part === 'super' ? 'win' : part);
    } else key = part;
  });

  return { mods, key };
}

function windowsSendKeys(spec) {
  const { mods, key } = parseKeys(spec);
  let prefix = '';
  if (mods.includes('ctrl') || mods.includes('cmd')) prefix += '^';
  if (mods.includes('alt')) prefix += '%';
  if (mods.includes('shift')) prefix += '+';
  let body = WIN_SPECIAL[key];
  if (!body) body = key.length === 1 && '+^%~(){}[]'.includes(key) ? '{' + key + '}' : key;
  return prefix + body;
}

function macScript(spec, appName) {
  const { mods, key } = parseKeys(spec);
  const using = [];
  if (mods.includes('cmd')) using.push('command down');
  if (mods.includes('ctrl')) using.push('control down');
  if (mods.includes('alt')) using.push('option down');
  if (mods.includes('shift')) using.push('shift down');

  const usingPart = using.length ? ' using {' + using.join(', ') + '}' : '';
  const action = MAC_KEYCODE[key] !== undefined
    ? 'key code ' + MAC_KEYCODE[key] + usingPart
    : 'keystroke "' + key + '"' + usingPart;

  const activate = appName ? 'tell application "' + appName + '" to activate\ndelay 0.12\n' : '';
  return activate + 'tell application "System Events" to ' + action;
}

function linuxKeys(spec) {
  const { mods, key } = parseKeys(spec);
  const map = { cmd: 'super', win: 'super', ctrl: 'ctrl', alt: 'alt', shift: 'shift' };
  return mods.map((m) => map[m] || m).concat(key).join('+');
}

const VK = {
  esc: 0x1B, escape: 0x1B, enter: 0x0D, tab: 0x09, space: 0x20, backspace: 0x08,
  delete: 0x2E, del: 0x2E, insert: 0x2D, home: 0x24, end: 0x23, pgup: 0x21, pgdn: 0x22,
  left: 0x25, up: 0x26, right: 0x27, down: 0x28,
  playpause: 0xB3, nexttrack: 0xB0, prevtrack: 0xB1, stoptrack: 0xB2,
  volumeup: 0xAF, volumedown: 0xAE, volumemute: 0xAD,
  plus: 0xBB, minus: 0xBD, '=': 0xBB, '`': 0xC0, '/': 0xBF
};

const VK_MODS = { ctrl: 0x11, cmd: 0x11, shift: 0x10, alt: 0x12, win: 0x5B };

const MEDIA_KEYS = ['playpause', 'nexttrack', 'prevtrack', 'stoptrack', 'volumeup', 'volumedown', 'volumemute'];

const LINUX_MEDIA = {
  playpause: 'XF86AudioPlay', nexttrack: 'XF86AudioNext', prevtrack: 'XF86AudioPrev',
  stoptrack: 'XF86AudioStop', volumeup: 'XF86AudioRaiseVolume',
  volumedown: 'XF86AudioLowerVolume', volumemute: 'XF86AudioMute'
};

function vkFor(key) {
  if (VK[key] !== undefined) return VK[key];
  if (/^f([1-9]|1[0-2])$/.test(key)) return 0x6F + parseInt(key.slice(1), 10);
  if (/^[a-z]$/.test(key)) return key.toUpperCase().charCodeAt(0);
  if (/^[0-9]$/.test(key)) return 0x30 + parseInt(key, 10);
  return null;
}

function winLowLevelPress(mods, key) {
  const codes = mods.map((mod) => VK_MODS[mod]).filter(Boolean);
  const target = vkFor(key);
  if (target === null) return false;

  const down = codes.concat(target);
  const up = down.slice().reverse();
  const presses =
    down.map((code) => '[Kb.Api]::keybd_event(' + code + ',0,0,0);').join(' ') +
    ' Start-Sleep -Milliseconds 30; ' +
    up.map((code) => '[Kb.Api]::keybd_event(' + code + ',0,2,0);').join(' ');

  if (psReady) { psRun(presses); return true; }

  /* запасной путь, если постоянный процесс ещё не поднялся */
  ps(
    'Add-Type -Namespace Kb -Name Api -MemberDefinition \'[DllImport("user32.dll")] public static extern void keybd_event(byte b, byte s, uint f, int e);\'; ' + presses
  );
  return true;
}

function sendKeys(spec) {
  if (!spec) return;

  if (PLATFORM === 'win') {
    const { mods, key } = parseKeys(spec);

    if (mods.includes('win') || MEDIA_KEYS.includes(key)) {
      if (winLowLevelPress(mods, key)) return;
    }

    const keys = windowsSendKeys(spec).replace(/'/g, "''");
    const activate = lastApp ? '$w.AppActivate(' + lastApp.pid + '); Start-Sleep -Milliseconds 120; ' : '';
    run('powershell -NoProfile -WindowStyle Hidden -Command "' +
      '$w = New-Object -ComObject wscript.shell; ' + activate +
      '$w.SendKeys(\'' + keys + '\')"');
    return;
  }

  if (PLATFORM === 'mac') {
    const script = macScript(spec, lastApp ? lastApp.name : null).replace(/'/g, "'\\''");
    run("osascript -e '" + script.split('\n').join("' -e '") + "'");
    return;
  }

  const parsed = parseKeys(spec);
  if (LINUX_MEDIA[parsed.key]) { run('xdotool key ' + LINUX_MEDIA[parsed.key]); return; }

  const activate = lastApp && lastApp.pid ? 'xdotool windowactivate $(xdotool search --pid ' + lastApp.pid + ' | head -1); sleep 0.1; ' : '';
  run(activate + 'xdotool key --clearmodifiers ' + linuxKeys(spec));
}

function resolveCommand(payload) {
  if (!payload) return null;
  if (typeof payload === 'string') return { type: payload.startsWith('http') ? 'url' : 'shell', value: payload };
  if (payload.keys) return { type: 'keys', value: payload.keys };
  if (payload.url) return { type: 'url', value: payload.url };
  if (payload.path) return { type: 'path', value: payload.path };
  if (payload.tabId) return { type: 'tab', value: payload.tabId };
  if (payload.clip) return { type: 'clip', value: payload.clip };
  if (payload.cmd) {
    const value = payload.cmd[PLATFORM];
    return value ? { type: 'shell', value } : null;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  IPC                                                                */
/* ------------------------------------------------------------------ */

ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
  if (win) win.setIgnoreMouseEvents(ignore, options);
});

ipcMain.on('launch', (event, payload) => {
  const target = resolveCommand(payload);
  if (!target) return;

  if (target.type === 'keys') { sendKeys(target.value); return; }
  if (target.type === 'url') { shell.openExternal(target.value); return; }
  if (target.type === 'tab') { pendingTabAction = { activate: target.value }; return; }

  if (target.type === 'clip') {
    clipboard.writeText(target.value);
    lastClipboard = target.value;
    setTimeout(() => sendKeys('mod+v'), 120);
    return;
  }

  if (target.type === 'path') {
    const resolved = target.value.replace('~', os.homedir()).replace('%USERPROFILE%', os.homedir());
    shell.openPath(path.normalize(resolved));
    return;
  }

  run(target.value);
});

ipcMain.handle('get-stats', () => {
  const total = os.totalmem();
  const free = os.freemem();

  return {
    cpu: cpuPercent(),
    ram: Math.round(((total - free) / total) * 100),
    ramTotalGb: Math.round(total / 1024 / 1024 / 1024),
    diskFree,
    diskLabel,
    media: mediaState,
    mail: { configured: mailState.configured, unread: mailState.unread, error: mailState.error },
    tabs: { connected: tabsConnected(), count: tabsState.tabs.length },
    userName: os.userInfo().username,
    platform: PLATFORM
  };
});

ipcMain.handle('get-mail', () => mailState);

ipcMain.handle('get-clipboard', () => clipboardHistory);

ipcMain.handle('get-tabs', () => ({ connected: tabsConnected(), tabs: tabsState.tabs }));

ipcMain.handle('search-apps', async (event, query) => {
  const text = String(query || '').trim().toLowerCase();
  if (text.length < 1) return [];

  const scored = [];
  appIndex.forEach((item) => {
    const score = scoreMatch(item.label, text);
    if (score >= 0) scored.push({ item, score });
  });

  scored.sort((a, b) => a.score - b.score || a.item.label.length - b.item.label.length);
  const top = scored.slice(0, 6).map((entry) => entry.item);
  const icons = await iconsFor(top);

  return top.map((item) => ({ label: item.label, sub: 'приложение', path: item.path, icon: icons[item.path] || '' }));
});

ipcMain.handle('get-active-app', () => lastApp);

ipcMain.on('set-search-mode', (event, on) => {
  if (!win) return;
  win.setFocusable(!!on);
  if (on) win.focus();
  else win.blur();
});

ipcMain.on('quit-app', () => app.quit());

/* ------------------------------------------------------------------ */
/*  Старт                                                              */
/* ------------------------------------------------------------------ */

app.whenReady().then(() => {
  createWindow();
  createTray();
  startBridge();
  buildAppIndex();
  startPersistentPS();

  /* небольшая пауза перед первым опросом — даём процессу время
     скомпилировать типы один раз, дальше опросы уже дешёвые */
  setTimeout(() => {
    detectActiveApp();
    setInterval(detectActiveApp, 2000);
  }, 500);

  cpuPercent();
  refreshDisk();
  refreshMedia();
  refreshMail();

  setInterval(pollClipboard, 1000);
  setInterval(refreshDisk, 60000);
  setInterval(refreshMedia, 5000);
  setInterval(refreshMail, 120000);
  setInterval(buildAppIndex, 300000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (psProc) { try { psProc.kill(); } catch (err) { /* ignore */ } }
});
