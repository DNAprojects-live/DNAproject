/* ------------------------------------------------------------------ */
/*  Внутреннее кольцо — 6 узлов, шаг 60°, старт сверху                 */
/* ------------------------------------------------------------------ */

const INNER_RING = [
  { id: 'context', dynamic: true },

  {
    id: 'system',
    label: 'Система',
    sub: 'загрузка',
    code: 'SYS',
    children: [
      {
        label: 'Снимок экрана',
        sub: 'скриншоты',
        children: [
          { label: 'Область', sub: 'Win + Shift + S', keys: 'win+shift+s' },
          { label: 'Весь экран', sub: 'PrtScr', keys: 'printscreen' },
          { label: 'Активное окно', sub: 'Alt + PrtScr', keys: 'alt+printscreen' },
          { label: 'Запись экрана', sub: 'Win + Alt + R', keys: 'win+alt+r' },
          { label: 'Папка снимков', sub: 'Screenshots', path: '~/Pictures/Screenshots' }
        ]
      },
      {
        label: 'Звук',
        sub: 'громкость',
        children: [
          { label: 'Тише', sub: 'volume down', keys: 'volumedown' },
          { label: 'Громче', sub: 'volume up', keys: 'volumeup' },
          { label: 'Без звука', sub: 'mute', keys: 'volumemute' },
          { label: 'Микшер', sub: 'sndvol', cmd: { win: 'sndvol.exe', mac: 'open -a "Audio MIDI Setup"', linux: 'pavucontrol' } },
          { label: 'Устройства вывода', sub: 'ms-settings:sound', cmd: { win: 'start ms-settings:sound', mac: 'open -a "System Settings"', linux: 'pavucontrol' } }
        ]
      },
      {
        label: 'Экран',
        sub: 'дисплей',
        children: [
          { label: 'Проекция', sub: 'Win + P', keys: 'win+p' },
          { label: 'Параметры дисплея', sub: 'ms-settings:display', cmd: { win: 'start ms-settings:display', mac: 'open -a "System Settings"', linux: 'gnome-control-center display' } },
          { label: 'Ночной свет', sub: 'nightlight', cmd: { win: 'start ms-settings:nightlight', mac: 'open -a "System Settings"', linux: 'gnome-control-center display' } },
          { label: 'Масштаб', sub: 'ms-settings:display', cmd: { win: 'start ms-settings:display', mac: 'open -a "System Settings"', linux: 'gnome-control-center display' } }
        ]
      },
      {
        label: 'Питание',
        sub: 'сон · выключение',
        children: [
          { label: 'Сон', sub: 'suspend', cmd: { win: 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0', mac: 'pmset sleepnow', linux: 'systemctl suspend' } },
          { label: 'Блокировка', sub: 'Win + L', keys: 'win+l' },
          { label: 'Перезагрузка', sub: 'reboot', cmd: { win: 'shutdown /r /t 0', mac: 'osascript -e "tell app \\"System Events\\" to restart"', linux: 'systemctl reboot' } },
          { label: 'Выключить', sub: 'shutdown', cmd: { win: 'shutdown /s /t 0', mac: 'osascript -e "tell app \\"System Events\\" to shut down"', linux: 'systemctl poweroff' } },
          { label: 'Схема питания', sub: 'powercfg.cpl', cmd: { win: 'control powercfg.cpl', mac: 'open -a "System Settings"', linux: 'gnome-control-center power' } }
        ]
      },
      {
        label: 'Параметры',
        sub: 'ms-settings',
        children: [
          { label: 'Все параметры', sub: 'ms-settings:', cmd: { win: 'start ms-settings:', mac: 'open -a "System Settings"', linux: 'gnome-control-center' } },
          { label: 'Обновления', sub: 'windowsupdate', cmd: { win: 'start ms-settings:windowsupdate', mac: 'open -a "System Settings"', linux: 'gnome-software --mode=updates' } },
          { label: 'Bluetooth', sub: 'bluetooth', cmd: { win: 'start ms-settings:bluetooth', mac: 'open -a "System Settings"', linux: 'gnome-control-center bluetooth' } },
          { label: 'Приложения', sub: 'appsfeatures', cmd: { win: 'start ms-settings:appsfeatures', mac: 'open -a "System Settings"', linux: 'gnome-control-center applications' } },
          { label: 'Автозагрузка', sub: 'startupapps', cmd: { win: 'start ms-settings:startupapps', mac: 'open -a "System Settings"', linux: 'gnome-session-properties' } }
        ]
      },
      {
        label: 'Обслуживание',
        sub: 'диски и мусор',
        children: [
          { label: 'Очистка диска', sub: 'cleanmgr', cmd: { win: 'cleanmgr.exe', mac: 'open -a "Disk Utility"', linux: 'baobab' } },
          { label: 'Временные файлы', sub: '%temp%', path: '%TEMP%' },
          { label: 'Управление дисками', sub: 'diskmgmt', cmd: { win: 'diskmgmt.msc', mac: 'open -a "Disk Utility"', linux: 'gnome-disks' } },
          { label: 'Службы', sub: 'services.msc', cmd: { win: 'services.msc', mac: 'open -a "Activity Monitor"', linux: 'systemctl --user list-units' } }
        ]
      },
      { label: 'Диспетчер задач', sub: 'Ctrl + Shift + Esc', cmd: { win: 'taskmgr.exe', mac: 'open -a "Activity Monitor"', linux: 'gnome-system-monitor' } },
      { label: 'О системе', sub: 'winver', cmd: { win: 'msinfo32.exe', mac: 'open -a "System Information"', linux: 'gnome-control-center info-overview' } }
    ]
  },

  {
    id: 'social',
    label: 'Связь',
    sub: 'мессенджеры',
    code: 'MSG',
    children: [
      {
        label: 'Telegram',
        sub: 'tg://',
        logo: 'telegram.org',
        children: [
          { label: 'Открыть', sub: 'приложение', logo: 'telegram.org', cmd: { win: 'start tg://', mac: 'open -a Telegram', linux: 'xdg-open tg://' } },
          { label: 'Веб-версия', sub: 'web.telegram.org', logo: 'telegram.org', url: 'https://web.telegram.org' },
          { label: 'Избранное', sub: 'saved messages', logo: 'telegram.org', cmd: { win: 'start tg://settings', mac: 'open -a Telegram', linux: 'xdg-open tg://' } },
          { label: 'Поиск по чатам', sub: 'Ctrl + F', keys: 'mod+f' }
        ]
      },
      {
        label: 'Discord',
        sub: 'discord://',
        logo: 'discord.com',
        children: [
          { label: 'Открыть', sub: 'приложение', logo: 'discord.com', cmd: { win: 'start discord://', mac: 'open -a Discord', linux: 'xdg-open discord://' } },
          { label: 'Веб-версия', sub: 'discord.com/app', logo: 'discord.com', url: 'https://discord.com/app' },
          { label: 'Микрофон', sub: 'Ctrl + Shift + M', keys: 'mod+shift+m' },
          { label: 'Звук', sub: 'Ctrl + Shift + D', keys: 'mod+shift+d' }
        ]
      },
      {
        label: 'WhatsApp',
        sub: 'whatsapp',
        logo: 'whatsapp.com',
        children: [
          { label: 'Веб-версия', sub: 'web.whatsapp.com', logo: 'whatsapp.com', url: 'https://web.whatsapp.com' },
          { label: 'Приложение', sub: 'whatsapp://', cmd: { win: 'start whatsapp://', mac: 'open -a WhatsApp', linux: 'xdg-open whatsapp://' } }
        ]
      },
      {
        label: 'Рабочие чаты',
        sub: 'команда',
        children: [
          { label: 'Slack', sub: 'slack.com', logo: 'slack.com', url: 'https://app.slack.com/client' },
          { label: 'Teams', sub: 'teams', logo: 'microsoft.com', url: 'https://teams.microsoft.com' },
          { label: 'Zoom', sub: 'zoom.us', logo: 'zoom.us', url: 'https://zoom.us/join' },
          { label: 'Google Meet', sub: 'meet', logo: 'meet.google.com', url: 'https://meet.google.com' }
        ]
      },
      {
        label: 'Соцсети',
        sub: 'лента',
        children: [
          { label: 'X', sub: 'x.com', logo: 'x.com', url: 'https://x.com' },
          { label: 'Reddit', sub: 'reddit.com', logo: 'reddit.com', url: 'https://reddit.com' },
          { label: 'VK', sub: 'vk.com', logo: 'vk.com', url: 'https://vk.com' },
          { label: 'LinkedIn', sub: 'linkedin.com', logo: 'linkedin.com', url: 'https://linkedin.com/feed' }
        ]
      }
    ]
  },

  {
    id: 'media',
    label: 'Медиа',
    sub: 'тишина',
    code: '♪',
    children: [
      {
        label: 'Управление',
        sub: 'плеер',
        children: [
          { label: 'Пауза / плей', sub: 'media play', keys: 'playpause' },
          { label: 'Следующий', sub: 'media next', keys: 'nexttrack' },
          { label: 'Предыдущий', sub: 'media prev', keys: 'prevtrack' },
          { label: 'Стоп', sub: 'media stop', keys: 'stoptrack' }
        ]
      },
      {
        label: 'Громкость',
        sub: 'уровень',
        children: [
          { label: 'Громче', sub: 'volume up', keys: 'volumeup' },
          { label: 'Тише', sub: 'volume down', keys: 'volumedown' },
          { label: 'Без звука', sub: 'mute', keys: 'volumemute' },
          { label: 'Микшер', sub: 'sndvol', cmd: { win: 'sndvol.exe', mac: 'open -a "Audio MIDI Setup"', linux: 'pavucontrol' } }
        ]
      },
      {
        label: 'Сервисы',
        sub: 'музыка и видео',
        children: [
          { label: 'Spotify', sub: 'spotify', logo: 'spotify.com', cmd: { win: 'start spotify:', mac: 'open -a Spotify', linux: 'xdg-open spotify:' } },
          { label: 'YouTube Music', sub: 'music.youtube.com', logo: 'music.youtube.com', url: 'https://music.youtube.com' },
          { label: 'Яндекс Музыка', sub: 'music.yandex.ru', logo: 'music.yandex.ru', url: 'https://music.yandex.ru' },
          { label: 'Twitch', sub: 'twitch.tv', logo: 'twitch.tv', url: 'https://twitch.tv' },
          { label: 'Кинопоиск', sub: 'kinopoisk.ru', logo: 'kinopoisk.ru', url: 'https://hd.kinopoisk.ru' }
        ]
      },
      { label: 'Папка с музыкой', sub: 'Music', path: '~/Music' },
      { label: 'Папка с видео', sub: 'Videos', path: '~/Videos' }
    ]
  },

  {
    id: 'files',
    label: 'Файлы',
    sub: 'проводник',
    code: 'FS',
    children: [
      {
        label: 'Основные папки',
        sub: 'быстрый доступ',
        children: [
          { label: 'Документы', sub: 'Documents', path: '~/Documents' },
          { label: 'Загрузки', sub: 'Downloads', path: '~/Downloads' },
          { label: 'Рабочий стол', sub: 'Desktop', path: '~/Desktop' },
          { label: 'Домашняя папка', sub: 'home', path: '~' }
        ]
      },
      {
        label: 'Медиапапки',
        sub: 'картинки и видео',
        children: [
          { label: 'Изображения', sub: 'Pictures', path: '~/Pictures' },
          { label: 'Видео', sub: 'Videos', path: '~/Videos' },
          { label: 'Музыка', sub: 'Music', path: '~/Music' },
          { label: 'Снимки экрана', sub: 'Screenshots', path: '~/Pictures/Screenshots' }
        ]
      },
      {
        label: 'Диски',
        sub: 'накопители',
        children: [
          { label: 'Этот компьютер', sub: 'диски', cmd: { win: 'explorer.exe shell:MyComputerFolder', mac: 'open /Volumes', linux: 'xdg-open /' } },
          { label: 'Системный диск', sub: 'C:', cmd: { win: 'explorer.exe C:\\', mac: 'open /', linux: 'xdg-open /' } },
          { label: 'Сетевое окружение', sub: 'network', cmd: { win: 'explorer.exe shell:NetworkPlacesFolder', mac: 'open smb://', linux: 'xdg-open network:///' } },
          { label: 'Управление дисками', sub: 'diskmgmt', cmd: { win: 'diskmgmt.msc', mac: 'open -a "Disk Utility"', linux: 'gnome-disks' } }
        ]
      },
      {
        label: 'Действия',
        sub: 'в проводнике',
        children: [
          { label: 'Новая папка', sub: 'Ctrl + Shift + N', keys: 'mod+shift+n' },
          { label: 'Переименовать', sub: 'F2', keys: 'f2' },
          { label: 'Свойства', sub: 'Alt + Enter', keys: 'alt+enter' },
          { label: 'Скрытые файлы', sub: 'Ctrl + Shift + H', keys: 'mod+shift+h' },
          { label: 'Поиск', sub: 'Ctrl + F', keys: 'mod+f' }
        ]
      },
      { label: 'Облако', sub: 'OneDrive', path: '~/OneDrive' },
      { label: 'Корзина', sub: 'очистка', cmd: { win: 'explorer.exe shell:RecycleBinFolder', mac: 'open ~/.Trash', linux: 'xdg-open trash:///' } }
    ]
  },

  {
    id: 'browser',
    label: 'Браузер',
    sub: 'избранное',
    code: 'BR',
    children: [
      {
        label: 'YouTube',
        sub: 'youtube.com',
        logo: 'youtube.com',
        children: [
          { label: 'Главная', sub: 'home', logo: 'youtube.com', url: 'https://www.youtube.com' },
          { label: 'Подписки', sub: 'feed', logo: 'youtube.com', url: 'https://www.youtube.com/feed/subscriptions' },
          { label: 'Смотреть позже', sub: 'WL', logo: 'youtube.com', url: 'https://www.youtube.com/playlist?list=WL' },
          { label: 'История', sub: 'history', logo: 'youtube.com', url: 'https://www.youtube.com/feed/history' },
          { label: 'Студия', sub: 'studio', logo: 'youtube.com', url: 'https://studio.youtube.com' }
        ]
      },
      {
        label: 'GitHub',
        sub: 'github.com',
        logo: 'github.com',
        children: [
          { label: 'Репозитории', sub: 'repositories', logo: 'github.com', url: 'https://github.com/settings/repositories' },
          { label: 'Новый репозиторий', sub: 'new', logo: 'github.com', url: 'https://github.com/new' },
          { label: 'Pull requests', sub: 'pulls', logo: 'github.com', url: 'https://github.com/pulls' },
          { label: 'Issues', sub: 'issues', logo: 'github.com', url: 'https://github.com/issues' },
          { label: 'Gist', sub: 'gist', logo: 'gist.github.com', url: 'https://gist.github.com' }
        ]
      },
      {
        label: 'Нейросети',
        sub: 'AI',
        children: [
          { label: 'Claude', sub: 'claude.ai', logo: 'claude.ai', url: 'https://claude.ai/new' },
          { label: 'ChatGPT', sub: 'chatgpt.com', logo: 'chatgpt.com', url: 'https://chatgpt.com' },
          { label: 'Gemini', sub: 'gemini.google.com', logo: 'gemini.google.com', url: 'https://gemini.google.com' },
          { label: 'Perplexity', sub: 'perplexity.ai', logo: 'perplexity.ai', url: 'https://perplexity.ai' }
        ]
      },
      {
        label: 'Google',
        sub: 'сервисы',
        logo: 'google.com',
        children: [
          { label: 'Поиск', sub: 'google.com', logo: 'google.com', url: 'https://google.com' },
          { label: 'Диск', sub: 'drive', logo: 'drive.google.com', url: 'https://drive.google.com' },
          { label: 'Карты', sub: 'maps', logo: 'maps.google.com', url: 'https://maps.google.com' },
          { label: 'Календарь', sub: 'calendar', logo: 'calendar.google.com', url: 'https://calendar.google.com' },
          { label: 'Переводчик', sub: 'translate', logo: 'translate.google.com', url: 'https://translate.google.com' }
        ]
      },
      {
        label: 'Работа',
        sub: 'инструменты',
        children: [
          { label: 'Figma', sub: 'figma.com', logo: 'figma.com', url: 'https://figma.com/files' },
          { label: 'Notion', sub: 'notion.so', logo: 'notion.so', url: 'https://notion.so' },
          { label: 'Stack Overflow', sub: 'stackoverflow', logo: 'stackoverflow.com', url: 'https://stackoverflow.com' },
          { label: 'Trello', sub: 'trello.com', logo: 'trello.com', url: 'https://trello.com' }
        ]
      },
      {
        label: 'Обучение',
        sub: 'чтение',
        children: [
          { label: 'Habr', sub: 'habr.com', logo: 'habr.com', url: 'https://habr.com' },
          { label: 'MDN', sub: 'developer.mozilla.org', logo: 'developer.mozilla.org', url: 'https://developer.mozilla.org' },
          { label: 'Stepik', sub: 'stepik.org', logo: 'stepik.org', url: 'https://stepik.org' },
          { label: 'Coursera', sub: 'coursera.org', logo: 'coursera.org', url: 'https://coursera.org' }
        ]
      }
    ]
  }
];

/* ------------------------------------------------------------------ */
/*  Внешнее кольцо — 6 узлов между внутренними                         */
/* ------------------------------------------------------------------ */

const OUTER_RING = [
  {
    id: 'tabs',
    label: 'Вкладки',
    sub: 'браузер не подключён',
    code: 'TAB',
    dynamic: true,
    children: []
  },

  {
    id: 'windows',
    label: 'Окна',
    sub: 'раскладка',
    code: 'WIN',
    children: [
      {
        label: 'Раскладка',
        sub: 'привязка',
        children: [
          { label: 'Влево', sub: 'Win + ←', keys: 'win+left' },
          { label: 'Вправо', sub: 'Win + →', keys: 'win+right' },
          { label: 'Развернуть', sub: 'Win + ↑', keys: 'win+up' },
          { label: 'Свернуть', sub: 'Win + ↓', keys: 'win+down' },
          { label: 'Макеты', sub: 'Win + Z', keys: 'win+z' }
        ]
      },
      {
        label: 'Рабочие столы',
        sub: 'виртуальные',
        children: [
          { label: 'Новый', sub: 'Win + Ctrl + D', keys: 'win+ctrl+d' },
          { label: 'Следующий', sub: 'Win + Ctrl + →', keys: 'win+ctrl+right' },
          { label: 'Предыдущий', sub: 'Win + Ctrl + ←', keys: 'win+ctrl+left' },
          { label: 'Закрыть', sub: 'Win + Ctrl + F4', keys: 'win+ctrl+f4' }
        ]
      },
      { label: 'Свернуть всё', sub: 'Win + D', keys: 'win+d' },
      { label: 'Представление задач', sub: 'Win + Tab', keys: 'win+tab' },
      { label: 'Переключить окно', sub: 'Alt + Tab', keys: 'alt+tab' },
      { label: 'Закрыть окно', sub: 'Alt + F4', keys: 'alt+f4' }
    ]
  },

  {
    id: 'mail',
    label: 'Почта',
    sub: 'не настроена',
    code: '@',
    dynamic: true,
    children: []
  },

  {
    id: 'clipboard',
    label: 'Буфер',
    sub: 'пусто',
    code: 'CLP',
    dynamic: true,
    children: []
  },

  {
    id: 'apps',
    label: 'Приложения',
    sub: 'быстрый запуск',
    code: 'APP',
    children: [
      {
        label: 'Стандартные',
        sub: 'система',
        children: [
          { label: 'Проводник', sub: 'explorer', cmd: { win: 'explorer.exe', mac: 'open ~', linux: 'xdg-open ~' } },
          { label: 'Блокнот', sub: 'notepad', cmd: { win: 'notepad.exe', mac: 'open -a TextEdit', linux: 'gedit' } },
          { label: 'Калькулятор', sub: 'calc', cmd: { win: 'calc.exe', mac: 'open -a Calculator', linux: 'gnome-calculator' } },
          { label: 'Ножницы', sub: 'snippingtool', cmd: { win: 'snippingtool.exe', mac: 'open -a "Screenshot"', linux: 'gnome-screenshot -i' } },
          { label: 'Paint', sub: 'mspaint', cmd: { win: 'mspaint.exe', mac: 'open -a Preview', linux: 'gimp' } }
        ]
      },
      {
        label: 'Офис',
        sub: 'документы',
        children: [
          { label: 'Word', sub: 'winword', logo: 'microsoft.com', cmd: { win: 'start winword', mac: 'open -a "Microsoft Word"', linux: 'libreoffice --writer' } },
          { label: 'Excel', sub: 'excel', logo: 'microsoft.com', cmd: { win: 'start excel', mac: 'open -a "Microsoft Excel"', linux: 'libreoffice --calc' } },
          { label: 'PowerPoint', sub: 'powerpnt', logo: 'microsoft.com', cmd: { win: 'start powerpnt', mac: 'open -a "Microsoft PowerPoint"', linux: 'libreoffice --impress' } },
          { label: 'Google Документы', sub: 'docs', logo: 'docs.google.com', url: 'https://docs.google.com' }
        ]
      },
      {
        label: 'Разработка',
        sub: 'код',
        children: [
          { label: 'VS Code', sub: 'code', logo: 'visualstudio.com', cmd: { win: 'code', mac: 'open -a "Visual Studio Code"', linux: 'code' } },
          { label: 'Терминал', sub: 'shell', cmd: { win: 'start wt.exe', mac: 'open -a Terminal', linux: 'x-terminal-emulator' } },
          { label: 'PowerShell', sub: 'powershell', cmd: { win: 'start powershell', mac: 'open -a Terminal', linux: 'x-terminal-emulator' } },
          { label: 'Реестр', sub: 'regedit', cmd: { win: 'regedit.exe', mac: 'open -a Terminal', linux: 'dconf-editor' } }
        ]
      },
      {
        label: 'Игры',
        sub: 'лаунчеры',
        children: [
          { label: 'Steam', sub: 'steam://', logo: 'steampowered.com', url: 'steam://open/games' },
          { label: 'Epic Games', sub: 'epic', logo: 'epicgames.com', cmd: { win: 'start com.epicgames.launcher://', mac: 'open -a "Epic Games Launcher"', linux: 'xdg-open com.epicgames.launcher://' } },
          { label: 'Магазин игр', sub: 'store', logo: 'steampowered.com', url: 'steam://open/store' }
        ]
      },
      { label: 'Панель управления', sub: 'control', cmd: { win: 'control.exe', mac: 'open -a "System Settings"', linux: 'gnome-control-center' } }
    ]
  },

  {
    id: 'network',
    label: 'Сеть',
    sub: 'подключение',
    code: 'NET',
    children: [
      {
        label: 'Подключения',
        sub: 'настройки',
        children: [
          { label: 'Wi-Fi', sub: 'network-wifi', cmd: { win: 'start ms-settings:network-wifi', mac: 'open -a "System Settings"', linux: 'gnome-control-center wifi' } },
          { label: 'VPN', sub: 'network-vpn', cmd: { win: 'start ms-settings:network-vpn', mac: 'open -a "System Settings"', linux: 'gnome-control-center network' } },
          { label: 'Сетевые адаптеры', sub: 'ncpa.cpl', cmd: { win: 'control ncpa.cpl', mac: 'open -a "System Settings"', linux: 'gnome-control-center network' } },
          { label: 'Bluetooth', sub: 'bluetooth', cmd: { win: 'start ms-settings:bluetooth', mac: 'open -a "System Settings"', linux: 'gnome-control-center bluetooth' } }
        ]
      },
      {
        label: 'Диагностика',
        sub: 'проверка',
        children: [
          { label: 'IP-адрес', sub: 'ipconfig', cmd: { win: 'cmd /k ipconfig /all', mac: 'open -a Terminal', linux: 'x-terminal-emulator -e "ip addr; read"' } },
          { label: 'Пинг', sub: 'ping 8.8.8.8', cmd: { win: 'cmd /k ping 8.8.8.8 -t', mac: 'open -a Terminal', linux: 'x-terminal-emulator -e "ping 8.8.8.8"' } },
          { label: 'Сбросить DNS', sub: 'flushdns', cmd: { win: 'cmd /k ipconfig /flushdns', mac: 'sudo killall -HUP mDNSResponder', linux: 'systemd-resolve --flush-caches' } },
          { label: 'Трассировка', sub: 'tracert', cmd: { win: 'cmd /k tracert 8.8.8.8', mac: 'open -a Terminal', linux: 'x-terminal-emulator -e "traceroute 8.8.8.8"' } }
        ]
      },
      { label: 'Скорость', sub: 'speedtest.net', logo: 'speedtest.net', url: 'https://www.speedtest.net' },
      { label: 'Мой IP', sub: '2ip.ru', logo: '2ip.ru', url: 'https://2ip.ru' }
    ]
  }
];

/* ------------------------------------------------------------------ */
/*  Профили приложений для узла «Контекст»                             */
/* ------------------------------------------------------------------ */

const APP_PROFILES = [
  {
    match: ['photoshop'],
    label: 'Photoshop',
    logo: 'adobe.com',
    children: [
      {
        label: 'Слои',
        sub: 'layers',
        children: [
          { label: 'Новый слой', sub: 'Ctrl + Shift + N', keys: 'mod+shift+n' },
          { label: 'Дублировать', sub: 'Ctrl + J', keys: 'mod+j' },
          { label: 'Объединить с нижним', sub: 'Ctrl + E', keys: 'mod+e' },
          { label: 'Объединить видимые', sub: 'Ctrl + Shift + E', keys: 'mod+shift+e' },
          { label: 'Сгруппировать', sub: 'Ctrl + G', keys: 'mod+g' },
          { label: 'Обтравочная маска', sub: 'Ctrl + Alt + G', keys: 'mod+alt+g' }
        ]
      },
      {
        label: 'Коррекция',
        sub: 'adjustments',
        children: [
          { label: 'Уровни', sub: 'Ctrl + L', keys: 'mod+l' },
          { label: 'Кривые', sub: 'Ctrl + M', keys: 'mod+m' },
          { label: 'Цветовой тон', sub: 'Ctrl + U', keys: 'mod+u' },
          { label: 'Цветовой баланс', sub: 'Ctrl + B', keys: 'mod+b' },
          { label: 'Обесцветить', sub: 'Ctrl + Shift + U', keys: 'mod+shift+u' },
          { label: 'Инверсия', sub: 'Ctrl + I', keys: 'mod+i' }
        ]
      },
      {
        label: 'Инструменты',
        sub: 'tools',
        children: [
          { label: 'Перемещение', sub: 'V', keys: 'v' },
          { label: 'Кисть', sub: 'B', keys: 'b' },
          { label: 'Ластик', sub: 'E', keys: 'e' },
          { label: 'Штамп', sub: 'S', keys: 's' },
          { label: 'Лассо', sub: 'L', keys: 'l' },
          { label: 'Текст', sub: 'T', keys: 't' },
          { label: 'Градиент', sub: 'G', keys: 'g' },
          { label: 'Пипетка', sub: 'I', keys: 'i' }
        ]
      },
      {
        label: 'Выделение',
        sub: 'selection',
        children: [
          { label: 'Выделить всё', sub: 'Ctrl + A', keys: 'mod+a' },
          { label: 'Снять выделение', sub: 'Ctrl + D', keys: 'mod+d' },
          { label: 'Инвертировать', sub: 'Ctrl + Shift + I', keys: 'mod+shift+i' },
          { label: 'Вернуть выделение', sub: 'Ctrl + Shift + D', keys: 'mod+shift+d' }
        ]
      },
      {
        label: 'Трансформация',
        sub: 'transform',
        children: [
          { label: 'Свободная', sub: 'Ctrl + T', keys: 'mod+t' },
          { label: 'Отразить и повернуть', sub: 'Ctrl + T', keys: 'mod+t' },
          { label: 'Повторить', sub: 'Ctrl + Shift + T', keys: 'mod+shift+t' }
        ]
      },
      {
        label: 'Файл',
        sub: 'file',
        children: [
          { label: 'Создать', sub: 'Ctrl + N', keys: 'mod+n' },
          { label: 'Открыть', sub: 'Ctrl + O', keys: 'mod+o' },
          { label: 'Сохранить', sub: 'Ctrl + S', keys: 'mod+s' },
          { label: 'Сохранить как', sub: 'Ctrl + Shift + S', keys: 'mod+shift+s' },
          { label: 'Экспорт', sub: 'Ctrl + Alt + Shift + W', keys: 'mod+alt+shift+w' }
        ]
      },
      {
        label: 'Просмотр',
        sub: 'view',
        children: [
          { label: 'Вписать в экран', sub: 'Ctrl + 0', keys: 'mod+0' },
          { label: '100%', sub: 'Ctrl + 1', keys: 'mod+1' },
          { label: 'Линейки', sub: 'Ctrl + R', keys: 'mod+r' },
          { label: 'Направляющие', sub: 'Ctrl + ;', keys: 'mod+;' }
        ]
      }
    ]
  },

  {
    match: ['illustrator'],
    label: 'Illustrator',
    logo: 'adobe.com',
    children: [
      {
        label: 'Инструменты',
        sub: 'tools',
        children: [
          { label: 'Выделение', sub: 'V', keys: 'v' },
          { label: 'Прямое выделение', sub: 'A', keys: 'a' },
          { label: 'Перо', sub: 'P', keys: 'p' },
          { label: 'Текст', sub: 'T', keys: 't' },
          { label: 'Прямоугольник', sub: 'M', keys: 'm' },
          { label: 'Эллипс', sub: 'L', keys: 'l' }
        ]
      },
      {
        label: 'Объекты',
        sub: 'objects',
        children: [
          { label: 'Сгруппировать', sub: 'Ctrl + G', keys: 'mod+g' },
          { label: 'Разгруппировать', sub: 'Ctrl + Shift + G', keys: 'mod+shift+g' },
          { label: 'На передний план', sub: 'Ctrl + Shift + ]', keys: 'mod+shift+]' },
          { label: 'На задний план', sub: 'Ctrl + Shift + [', keys: 'mod+shift+[' },
          { label: 'Заблокировать', sub: 'Ctrl + 2', keys: 'mod+2' }
        ]
      },
      {
        label: 'Контуры',
        sub: 'paths',
        children: [
          { label: 'Контуры в кривые', sub: 'Ctrl + Shift + O', keys: 'mod+shift+o' },
          { label: 'Соединить', sub: 'Ctrl + J', keys: 'mod+j' },
          { label: 'Обработка контуров', sub: 'Ctrl + Shift + F9', keys: 'mod+shift+f9' }
        ]
      },
      {
        label: 'Файл',
        sub: 'file',
        children: [
          { label: 'Сохранить', sub: 'Ctrl + S', keys: 'mod+s' },
          { label: 'Экспорт', sub: 'Ctrl + Alt + Shift + S', keys: 'mod+alt+shift+s' },
          { label: 'Монтажные области', sub: 'Shift + O', keys: 'shift+o' }
        ]
      }
    ]
  },

  {
    match: ['premiere'],
    label: 'Premiere Pro',
    logo: 'adobe.com',
    children: [
      {
        label: 'Монтаж',
        sub: 'timeline',
        children: [
          { label: 'Разрезать', sub: 'Ctrl + K', keys: 'mod+k' },
          { label: 'Удалить со сдвигом', sub: 'Shift + Delete', keys: 'shift+delete' },
          { label: 'Вставить', sub: 'Ctrl + V', keys: 'mod+v' },
          { label: 'Связать / отвязать', sub: 'Ctrl + L', keys: 'mod+l' }
        ]
      },
      {
        label: 'Инструменты',
        sub: 'tools',
        children: [
          { label: 'Выделение', sub: 'V', keys: 'v' },
          { label: 'Лезвие', sub: 'C', keys: 'c' },
          { label: 'Растягивание', sub: 'R', keys: 'r' },
          { label: 'Рука', sub: 'H', keys: 'h' }
        ]
      },
      {
        label: 'Воспроизведение',
        sub: 'playback',
        children: [
          { label: 'Play / пауза', sub: 'Space', keys: 'space' },
          { label: 'Кадр вперёд', sub: '→', keys: 'right' },
          { label: 'Кадр назад', sub: '←', keys: 'left' },
          { label: 'Метка', sub: 'M', keys: 'm' }
        ]
      },
      { label: 'Экспорт', sub: 'Ctrl + M', keys: 'mod+m' },
      { label: 'Сохранить', sub: 'Ctrl + S', keys: 'mod+s' }
    ]
  },

  {
    match: ['afterfx', 'after effects'],
    label: 'After Effects',
    logo: 'adobe.com',
    children: [
      {
        label: 'Свойства слоя',
        sub: 'properties',
        children: [
          { label: 'Позиция', sub: 'P', keys: 'p' },
          { label: 'Масштаб', sub: 'S', keys: 's' },
          { label: 'Поворот', sub: 'R', keys: 'r' },
          { label: 'Прозрачность', sub: 'T', keys: 't' },
          { label: 'Точка привязки', sub: 'A', keys: 'a' }
        ]
      },
      {
        label: 'Композиция',
        sub: 'composition',
        children: [
          { label: 'Новая композиция', sub: 'Ctrl + N', keys: 'mod+n' },
          { label: 'Настройки', sub: 'Ctrl + K', keys: 'mod+k' },
          { label: 'Превью', sub: 'Space', keys: 'space' },
          { label: 'Очередь рендера', sub: 'Ctrl + M', keys: 'mod+m' }
        ]
      },
      {
        label: 'Слои',
        sub: 'layers',
        children: [
          { label: 'Новый нулевой', sub: 'Ctrl + Alt + Shift + Y', keys: 'mod+alt+shift+y' },
          { label: 'Новая сплошная', sub: 'Ctrl + Y', keys: 'mod+y' },
          { label: 'Предкомпозиция', sub: 'Ctrl + Shift + C', keys: 'mod+shift+c' },
          { label: 'Разрезать слой', sub: 'Ctrl + Shift + D', keys: 'mod+shift+d' }
        ]
      }
    ]
  },

  {
    match: ['lightroom'],
    label: 'Lightroom',
    logo: 'adobe.com',
    children: [
      {
        label: 'Модули',
        sub: 'modules',
        children: [
          { label: 'Библиотека', sub: 'G', keys: 'g' },
          { label: 'Коррекция', sub: 'D', keys: 'd' },
          { label: 'Карта', sub: 'Ctrl + Alt + 3', keys: 'mod+alt+3' }
        ]
      },
      {
        label: 'Обработка',
        sub: 'develop',
        children: [
          { label: 'Кадрирование', sub: 'R', keys: 'r' },
          { label: 'До / после', sub: 'Y', keys: 'y' },
          { label: 'Автотон', sub: 'Ctrl + U', keys: 'mod+u' },
          { label: 'Сброс', sub: 'Ctrl + Shift + R', keys: 'mod+shift+r' }
        ]
      },
      {
        label: 'Отбор',
        sub: 'flags',
        children: [
          { label: 'Отметить', sub: 'P', keys: 'p' },
          { label: 'Отклонить', sub: 'X', keys: 'x' },
          { label: '5 звёзд', sub: '5', keys: '5' }
        ]
      },
      { label: 'Экспорт', sub: 'Ctrl + Shift + E', keys: 'mod+shift+e' }
    ]
  },

  {
    match: ['figma'],
    label: 'Figma',
    logo: 'figma.com',
    children: [
      {
        label: 'Инструменты',
        sub: 'tools',
        children: [
          { label: 'Перемещение', sub: 'V', keys: 'v' },
          { label: 'Рамка', sub: 'F', keys: 'f' },
          { label: 'Прямоугольник', sub: 'R', keys: 'r' },
          { label: 'Эллипс', sub: 'O', keys: 'o' },
          { label: 'Текст', sub: 'T', keys: 't' },
          { label: 'Перо', sub: 'P', keys: 'p' },
          { label: 'Комментарий', sub: 'C', keys: 'c' }
        ]
      },
      {
        label: 'Объекты',
        sub: 'objects',
        children: [
          { label: 'Группировать', sub: 'Ctrl + G', keys: 'mod+g' },
          { label: 'Разгруппировать', sub: 'Ctrl + Shift + G', keys: 'mod+shift+g' },
          { label: 'Авто-лейаут', sub: 'Shift + A', keys: 'shift+a' },
          { label: 'Создать компонент', sub: 'Ctrl + Alt + K', keys: 'mod+alt+k' },
          { label: 'Отделить экземпляр', sub: 'Ctrl + Alt + B', keys: 'mod+alt+b' },
          { label: 'Маска', sub: 'Ctrl + Alt + M', keys: 'mod+alt+m' }
        ]
      },
      {
        label: 'Выравнивание',
        sub: 'align',
        children: [
          { label: 'По левому краю', sub: 'Alt + A', keys: 'alt+a' },
          { label: 'По правому краю', sub: 'Alt + D', keys: 'alt+d' },
          { label: 'По центру', sub: 'Alt + H', keys: 'alt+h' },
          { label: 'По верху', sub: 'Alt + W', keys: 'alt+w' },
          { label: 'Распределить', sub: 'Alt + Ctrl + H', keys: 'alt+ctrl+h' }
        ]
      },
      {
        label: 'Просмотр',
        sub: 'view',
        children: [
          { label: 'Показать всё', sub: 'Shift + 1', keys: 'shift+1' },
          { label: 'По выделению', sub: 'Shift + 2', keys: 'shift+2' },
          { label: '100%', sub: 'Shift + 0', keys: 'shift+0' },
          { label: 'Сетка макета', sub: 'Ctrl + Shift + 4', keys: 'mod+shift+4' },
          { label: 'Пиксельная сетка', sub: 'Ctrl + \'', keys: "mod+'" }
        ]
      },
      {
        label: 'Панели',
        sub: 'panels',
        children: [
          { label: 'Слои', sub: 'Alt + 1', keys: 'alt+1' },
          { label: 'Компоненты', sub: 'Alt + 2', keys: 'alt+2' },
          { label: 'Прототип', sub: 'Alt + 9', keys: 'alt+9' },
          { label: 'Экспорт', sub: 'Ctrl + Shift + E', keys: 'mod+shift+e' }
        ]
      }
    ]
  },

  {
    match: ['blender'],
    label: 'Blender',
    logo: 'blender.org',
    children: [
      {
        label: 'Трансформация',
        sub: 'transform',
        children: [
          { label: 'Переместить', sub: 'G', keys: 'g' },
          { label: 'Повернуть', sub: 'R', keys: 'r' },
          { label: 'Масштаб', sub: 'S', keys: 's' },
          { label: 'Применить', sub: 'Ctrl + A', keys: 'mod+a' }
        ]
      },
      {
        label: 'Режимы',
        sub: 'modes',
        children: [
          { label: 'Правка / объект', sub: 'Tab', keys: 'tab' },
          { label: 'Скульптинг', sub: 'Ctrl + Tab', keys: 'mod+tab' },
          { label: 'Каркас', sub: 'Shift + Z', keys: 'shift+z' }
        ]
      },
      {
        label: 'Объекты',
        sub: 'objects',
        children: [
          { label: 'Добавить', sub: 'Shift + A', keys: 'shift+a' },
          { label: 'Дублировать', sub: 'Shift + D', keys: 'shift+d' },
          { label: 'Удалить', sub: 'X', keys: 'x' },
          { label: 'Объединить', sub: 'Ctrl + J', keys: 'mod+j' }
        ]
      },
      { label: 'Рендер', sub: 'F12', keys: 'f12' },
      { label: 'Сохранить', sub: 'Ctrl + S', keys: 'mod+s' }
    ]
  },

  {
    match: ['resolve'],
    label: 'DaVinci Resolve',
    logo: 'blackmagicdesign.com',
    children: [
      {
        label: 'Страницы',
        sub: 'pages',
        children: [
          { label: 'Медиа', sub: 'Shift + 2', keys: 'shift+2' },
          { label: 'Монтаж', sub: 'Shift + 4', keys: 'shift+4' },
          { label: 'Фьюжн', sub: 'Shift + 5', keys: 'shift+5' },
          { label: 'Цвет', sub: 'Shift + 6', keys: 'shift+6' },
          { label: 'Доставка', sub: 'Shift + 8', keys: 'shift+8' }
        ]
      },
      {
        label: 'Монтаж',
        sub: 'edit',
        children: [
          { label: 'Разрезать', sub: 'Ctrl + B', keys: 'mod+b' },
          { label: 'Вставить', sub: 'Ctrl + V', keys: 'mod+v' },
          { label: 'Play / пауза', sub: 'Space', keys: 'space' }
        ]
      }
    ]
  },

  {
    match: ['obs'],
    label: 'OBS Studio',
    logo: 'obsproject.com',
    children: [
      {
        label: 'Эфир',
        sub: 'stream',
        children: [
          { label: 'Запись', sub: 'Ctrl + Shift + R', keys: 'mod+shift+r' },
          { label: 'Трансляция', sub: 'Ctrl + Shift + S', keys: 'mod+shift+s' },
          { label: 'Пауза записи', sub: 'Ctrl + Shift + P', keys: 'mod+shift+p' }
        ]
      },
      { label: 'Студийный режим', sub: 'studio', keys: 'mod+shift+t' },
      { label: 'Настройки', sub: 'settings', keys: 'mod+,' }
    ]
  },

  {
    match: ['unity'],
    label: 'Unity',
    logo: 'unity.com',
    children: [
      {
        label: 'Запуск',
        sub: 'play',
        children: [
          { label: 'Играть', sub: 'Ctrl + P', keys: 'mod+p' },
          { label: 'Пауза', sub: 'Ctrl + Shift + P', keys: 'mod+shift+p' },
          { label: 'Шаг', sub: 'Ctrl + Alt + P', keys: 'mod+alt+p' }
        ]
      },
      {
        label: 'Инструменты',
        sub: 'tools',
        children: [
          { label: 'Рука', sub: 'Q', keys: 'q' },
          { label: 'Перемещение', sub: 'W', keys: 'w' },
          { label: 'Поворот', sub: 'E', keys: 'e' },
          { label: 'Масштаб', sub: 'R', keys: 'r' }
        ]
      },
      { label: 'Сохранить сцену', sub: 'Ctrl + S', keys: 'mod+s' },
      { label: 'Сборка', sub: 'Ctrl + B', keys: 'mod+b' }
    ]
  },

  {
    match: ['chrome', 'firefox', 'msedge', 'opera', 'brave', 'yandex', 'safari', 'vivaldi', 'arc'],
    label: 'Браузер',
    logo: 'google.com',
    children: [
      {
        label: 'Вкладки',
        sub: 'tabs',
        children: [
          { label: 'Новая вкладка', sub: 'Ctrl + T', keys: 'mod+t' },
          { label: 'Закрыть', sub: 'Ctrl + W', keys: 'mod+w' },
          { label: 'Вернуть закрытую', sub: 'Ctrl + Shift + T', keys: 'mod+shift+t' },
          { label: 'Следующая', sub: 'Ctrl + Tab', keys: 'mod+tab' },
          { label: 'Закрепить', sub: 'меню вкладки', keys: 'mod+shift+a' }
        ]
      },
      {
        label: 'Навигация',
        sub: 'navigation',
        children: [
          { label: 'Адресная строка', sub: 'Ctrl + L', keys: 'mod+l' },
          { label: 'Обновить', sub: 'F5', keys: 'f5' },
          { label: 'Жёсткое обновление', sub: 'Ctrl + F5', keys: 'mod+f5' },
          { label: 'Назад', sub: 'Alt + ←', keys: 'alt+left' },
          { label: 'Вперёд', sub: 'Alt + →', keys: 'alt+right' }
        ]
      },
      {
        label: 'Разработка',
        sub: 'devtools',
        children: [
          { label: 'Инструменты', sub: 'F12', keys: 'f12' },
          { label: 'Консоль', sub: 'Ctrl + Shift + J', keys: 'mod+shift+j' },
          { label: 'Инспектор', sub: 'Ctrl + Shift + C', keys: 'mod+shift+c' },
          { label: 'Исходный код', sub: 'Ctrl + U', keys: 'mod+u' }
        ]
      },
      {
        label: 'Данные',
        sub: 'history',
        children: [
          { label: 'История', sub: 'Ctrl + H', keys: 'mod+h' },
          { label: 'Загрузки', sub: 'Ctrl + J', keys: 'mod+j' },
          { label: 'Закладки', sub: 'Ctrl + Shift + O', keys: 'mod+shift+o' },
          { label: 'Инкогнито', sub: 'Ctrl + Shift + N', keys: 'mod+shift+n' },
          { label: 'Очистить данные', sub: 'Ctrl + Shift + Del', keys: 'mod+shift+delete' }
        ]
      },
      { label: 'Найти на странице', sub: 'Ctrl + F', keys: 'mod+f' },
      { label: 'Масштаб по умолчанию', sub: 'Ctrl + 0', keys: 'mod+0' }
    ]
  },

  {
    match: ['code', 'cursor', 'sublime', 'webstorm', 'pycharm', 'idea', 'atom', 'notepad++'],
    label: 'Редактор кода',
    logo: 'visualstudio.com',
    children: [
      {
        label: 'Навигация',
        sub: 'navigation',
        children: [
          { label: 'Палитра команд', sub: 'Ctrl + Shift + P', keys: 'mod+shift+p' },
          { label: 'Быстрый переход', sub: 'Ctrl + P', keys: 'mod+p' },
          { label: 'К строке', sub: 'Ctrl + G', keys: 'mod+g' },
          { label: 'К определению', sub: 'F12', keys: 'f12' },
          { label: 'Назад', sub: 'Alt + ←', keys: 'alt+left' }
        ]
      },
      {
        label: 'Правка',
        sub: 'edit',
        children: [
          { label: 'Комментарий', sub: 'Ctrl + /', keys: 'mod+/' },
          { label: 'Дублировать строку', sub: 'Shift + Alt + ↓', keys: 'shift+alt+down' },
          { label: 'Переместить строку', sub: 'Alt + ↓', keys: 'alt+down' },
          { label: 'Формат кода', sub: 'Shift + Alt + F', keys: 'shift+alt+f' },
          { label: 'Мультикурсор', sub: 'Ctrl + D', keys: 'mod+d' },
          { label: 'Переименовать', sub: 'F2', keys: 'f2' }
        ]
      },
      {
        label: 'Поиск',
        sub: 'search',
        children: [
          { label: 'В файле', sub: 'Ctrl + F', keys: 'mod+f' },
          { label: 'По проекту', sub: 'Ctrl + Shift + F', keys: 'mod+shift+f' },
          { label: 'Замена', sub: 'Ctrl + H', keys: 'mod+h' }
        ]
      },
      {
        label: 'Панели',
        sub: 'panels',
        children: [
          { label: 'Терминал', sub: 'Ctrl + `', keys: 'mod+`' },
          { label: 'Боковая панель', sub: 'Ctrl + B', keys: 'mod+b' },
          { label: 'Проблемы', sub: 'Ctrl + Shift + M', keys: 'mod+shift+m' },
          { label: 'Git', sub: 'Ctrl + Shift + G', keys: 'mod+shift+g' }
        ]
      },
      { label: 'Сохранить', sub: 'Ctrl + S', keys: 'mod+s' },
      { label: 'Сохранить всё', sub: 'Ctrl + K S', keys: 'mod+k' }
    ]
  },

  {
    match: ['winword'],
    label: 'Word',
    logo: 'microsoft.com',
    children: [
      {
        label: 'Форматирование',
        sub: 'format',
        children: [
          { label: 'Жирный', sub: 'Ctrl + B', keys: 'mod+b' },
          { label: 'Курсив', sub: 'Ctrl + I', keys: 'mod+i' },
          { label: 'Подчёркнутый', sub: 'Ctrl + U', keys: 'mod+u' },
          { label: 'По центру', sub: 'Ctrl + E', keys: 'mod+e' },
          { label: 'Очистить формат', sub: 'Ctrl + Space', keys: 'mod+space' }
        ]
      },
      {
        label: 'Документ',
        sub: 'document',
        children: [
          { label: 'Сохранить', sub: 'Ctrl + S', keys: 'mod+s' },
          { label: 'Печать', sub: 'Ctrl + P', keys: 'mod+p' },
          { label: 'Найти и заменить', sub: 'Ctrl + H', keys: 'mod+h' },
          { label: 'Разрыв страницы', sub: 'Ctrl + Enter', keys: 'mod+enter' }
        ]
      }
    ]
  },

  {
    match: ['excel'],
    label: 'Excel',
    logo: 'microsoft.com',
    children: [
      {
        label: 'Формулы',
        sub: 'formulas',
        children: [
          { label: 'Автосумма', sub: 'Alt + =', keys: 'alt+=' },
          { label: 'Вставить функцию', sub: 'Shift + F3', keys: 'shift+f3' },
          { label: 'Пересчитать', sub: 'F9', keys: 'f9' },
          { label: 'Показать формулы', sub: 'Ctrl + `', keys: 'mod+`' }
        ]
      },
      {
        label: 'Таблица',
        sub: 'data',
        children: [
          { label: 'Формат ячеек', sub: 'Ctrl + 1', keys: 'mod+1' },
          { label: 'Фильтр', sub: 'Ctrl + Shift + L', keys: 'mod+shift+l' },
          { label: 'Новая строка', sub: 'Ctrl + +', keys: 'mod+plus' },
          { label: 'Удалить строку', sub: 'Ctrl + -', keys: 'mod+minus' },
          { label: 'Закрепить области', sub: 'Alt + W F', keys: 'alt+w' }
        ]
      },
      { label: 'Сохранить', sub: 'Ctrl + S', keys: 'mod+s' }
    ]
  },

  {
    match: ['powerpnt'],
    label: 'PowerPoint',
    logo: 'microsoft.com',
    children: [
      {
        label: 'Показ',
        sub: 'slideshow',
        children: [
          { label: 'С начала', sub: 'F5', keys: 'f5' },
          { label: 'С текущего', sub: 'Shift + F5', keys: 'shift+f5' },
          { label: 'Выйти', sub: 'Esc', keys: 'esc' }
        ]
      },
      {
        label: 'Слайды',
        sub: 'slides',
        children: [
          { label: 'Новый слайд', sub: 'Ctrl + M', keys: 'mod+m' },
          { label: 'Дублировать', sub: 'Ctrl + D', keys: 'mod+d' },
          { label: 'Сортировщик', sub: 'Alt + W S', keys: 'alt+w' }
        ]
      }
    ]
  },

  {
    match: ['telegram', 'whatsapp', 'discord', 'slack', 'viber'],
    label: 'Мессенджер',
    logo: 'telegram.org',
    children: [
      {
        label: 'Чаты',
        sub: 'chats',
        children: [
          { label: 'Поиск', sub: 'Ctrl + F', keys: 'mod+f' },
          { label: 'Следующий чат', sub: 'Ctrl + Tab', keys: 'mod+tab' },
          { label: 'Новое сообщение', sub: 'Ctrl + N', keys: 'mod+n' },
          { label: 'Архив', sub: 'Ctrl + 0', keys: 'mod+0' }
        ]
      },
      {
        label: 'Звонок',
        sub: 'call',
        children: [
          { label: 'Микрофон', sub: 'Ctrl + Shift + M', keys: 'mod+shift+m' },
          { label: 'Звук', sub: 'Ctrl + Shift + D', keys: 'mod+shift+d' }
        ]
      },
      { label: 'Свернуть', sub: 'Esc', keys: 'esc' }
    ]
  },

  {
    match: ['zoom', 'teams'],
    label: 'Видеозвонок',
    logo: 'zoom.us',
    children: [
      {
        label: 'Управление',
        sub: 'controls',
        children: [
          { label: 'Микрофон', sub: 'Alt + A', keys: 'alt+a' },
          { label: 'Камера', sub: 'Alt + V', keys: 'alt+v' },
          { label: 'Демонстрация', sub: 'Alt + S', keys: 'alt+s' },
          { label: 'Пауза показа', sub: 'Alt + T', keys: 'alt+t' }
        ]
      },
      {
        label: 'Панели',
        sub: 'panels',
        children: [
          { label: 'Чат', sub: 'Alt + H', keys: 'alt+h' },
          { label: 'Участники', sub: 'Alt + U', keys: 'alt+u' },
          { label: 'Запись', sub: 'Alt + R', keys: 'alt+r' }
        ]
      },
      { label: 'Выйти', sub: 'Alt + Q', keys: 'alt+q' }
    ]
  },

  {
    match: ['vlc', 'mpc', 'potplayer', 'spotify', 'aimp', 'foobar'],
    label: 'Плеер',
    logo: 'videolan.org',
    children: [
      {
        label: 'Воспроизведение',
        sub: 'playback',
        children: [
          { label: 'Пауза / плей', sub: 'Space', keys: 'space' },
          { label: 'Следующий', sub: 'media next', keys: 'nexttrack' },
          { label: 'Предыдущий', sub: 'media prev', keys: 'prevtrack' },
          { label: 'Стоп', sub: 'media stop', keys: 'stoptrack' }
        ]
      },
      {
        label: 'Экран',
        sub: 'view',
        children: [
          { label: 'Полный экран', sub: 'F', keys: 'f' },
          { label: 'Субтитры', sub: 'V', keys: 'v' },
          { label: 'Дорожка', sub: 'B', keys: 'b' }
        ]
      }
    ]
  },

  {
    match: ['explorer'],
    label: 'Проводник',
    logo: 'microsoft.com',
    children: [
      {
        label: 'Файлы',
        sub: 'files',
        children: [
          { label: 'Новая папка', sub: 'Ctrl + Shift + N', keys: 'mod+shift+n' },
          { label: 'Переименовать', sub: 'F2', keys: 'f2' },
          { label: 'Удалить', sub: 'Delete', keys: 'delete' },
          { label: 'Свойства', sub: 'Alt + Enter', keys: 'alt+enter' },
          { label: 'Копировать путь', sub: 'Ctrl + Shift + C', keys: 'mod+shift+c' }
        ]
      },
      {
        label: 'Вид',
        sub: 'view',
        children: [
          { label: 'Скрытые файлы', sub: 'Ctrl + Shift + H', keys: 'mod+shift+h' },
          { label: 'Крупные значки', sub: 'Ctrl + Shift + 2', keys: 'mod+shift+2' },
          { label: 'Таблица', sub: 'Ctrl + Shift + 6', keys: 'mod+shift+6' },
          { label: 'Область просмотра', sub: 'Alt + P', keys: 'alt+p' }
        ]
      },
      { label: 'Новое окно', sub: 'Ctrl + N', keys: 'mod+n' }
    ]
  },

  {
    match: ['notion', 'obsidian'],
    label: 'Заметки',
    logo: 'notion.so',
    children: [
      {
        label: 'Навигация',
        sub: 'navigation',
        children: [
          { label: 'Поиск', sub: 'Ctrl + P', keys: 'mod+p' },
          { label: 'Новая заметка', sub: 'Ctrl + N', keys: 'mod+n' },
          { label: 'Назад', sub: 'Ctrl + [', keys: 'mod+[' }
        ]
      },
      {
        label: 'Правка',
        sub: 'edit',
        children: [
          { label: 'Предпросмотр', sub: 'Ctrl + E', keys: 'mod+e' },
          { label: 'Жирный', sub: 'Ctrl + B', keys: 'mod+b' },
          { label: 'Ссылка', sub: 'Ctrl + K', keys: 'mod+k' }
        ]
      }
    ]
  },

  {
    match: ['gimp', 'krita'],
    label: 'Графика',
    logo: 'gimp.org',
    children: [
      {
        label: 'Инструменты',
        sub: 'tools',
        children: [
          { label: 'Кисть', sub: 'P', keys: 'p' },
          { label: 'Ластик', sub: 'Shift + E', keys: 'shift+e' },
          { label: 'Заливка', sub: 'Shift + B', keys: 'shift+b' },
          { label: 'Выделение', sub: 'R', keys: 'r' }
        ]
      },
      {
        label: 'Слои',
        sub: 'layers',
        children: [
          { label: 'Новый слой', sub: 'Ctrl + Shift + N', keys: 'mod+shift+n' },
          { label: 'Объединить', sub: 'Ctrl + M', keys: 'mod+m' },
          { label: 'Дублировать', sub: 'Ctrl + Shift + D', keys: 'mod+shift+d' }
        ]
      },
      { label: 'Экспорт', sub: 'Ctrl + Shift + E', keys: 'mod+shift+e' }
    ]
  },

  {
    match: ['acad', 'autocad'],
    label: 'AutoCAD',
    logo: 'autodesk.com',
    children: [
      {
        label: 'Черчение',
        sub: 'draw',
        children: [
          { label: 'Линия', sub: 'L', keys: 'l' },
          { label: 'Круг', sub: 'C', keys: 'c' },
          { label: 'Полилиния', sub: 'PL', keys: 'p' }
        ]
      },
      {
        label: 'Правка',
        sub: 'modify',
        children: [
          { label: 'Обрезать', sub: 'TR', keys: 't' },
          { label: 'Копировать', sub: 'CO', keys: 'c' },
          { label: 'Масштаб', sub: 'SC', keys: 's' }
        ]
      },
      { label: 'Сохранить', sub: 'Ctrl + S', keys: 'mod+s' }
    ]
  },

  {
    match: ['windowsterminal', 'cmd', 'powershell', 'terminal', 'konsole'],
    label: 'Терминал',
    logo: 'microsoft.com',
    children: [
      {
        label: 'Вкладки',
        sub: 'tabs',
        children: [
          { label: 'Новая вкладка', sub: 'Ctrl + Shift + T', keys: 'mod+shift+t' },
          { label: 'Закрыть', sub: 'Ctrl + Shift + W', keys: 'mod+shift+w' },
          { label: 'Следующая', sub: 'Ctrl + Tab', keys: 'mod+tab' }
        ]
      },
      {
        label: 'Панели',
        sub: 'panes',
        children: [
          { label: 'Разделить вправо', sub: 'Alt + Shift + D', keys: 'alt+shift+d' },
          { label: 'Разделить вниз', sub: 'Alt + Shift + -', keys: 'alt+shift+minus' }
        ]
      },
      { label: 'Копировать', sub: 'Ctrl + Shift + C', keys: 'mod+shift+c' },
      { label: 'Вставить', sub: 'Ctrl + Shift + V', keys: 'mod+shift+v' }
    ]
  },

  {
    match: ['steam'],
    label: 'Steam',
    logo: 'steampowered.com',
    children: [
      {
        label: 'Разделы',
        sub: 'sections',
        children: [
          { label: 'Библиотека', sub: 'library', url: 'steam://open/games' },
          { label: 'Магазин', sub: 'store', url: 'steam://open/store' },
          { label: 'Друзья', sub: 'friends', url: 'steam://open/friends' },
          { label: 'Загрузки', sub: 'downloads', url: 'steam://open/downloads' }
        ]
      },
      { label: 'Оверлей', sub: 'Shift + Tab', keys: 'shift+tab' }
    ]
  }
];

const FALLBACK_PROFILE = {
  label: 'Активное окно',
  children: [
    {
      label: 'Правка',
      sub: 'edit',
      children: [
        { label: 'Копировать', sub: 'Ctrl + C', keys: 'mod+c' },
        { label: 'Вставить', sub: 'Ctrl + V', keys: 'mod+v' },
        { label: 'Вырезать', sub: 'Ctrl + X', keys: 'mod+x' },
        { label: 'Выделить всё', sub: 'Ctrl + A', keys: 'mod+a' },
        { label: 'Отменить', sub: 'Ctrl + Z', keys: 'mod+z' },
        { label: 'Повторить', sub: 'Ctrl + Y', keys: 'mod+y' }
      ]
    },
    {
      label: 'Файл',
      sub: 'file',
      children: [
        { label: 'Сохранить', sub: 'Ctrl + S', keys: 'mod+s' },
        { label: 'Открыть', sub: 'Ctrl + O', keys: 'mod+o' },
        { label: 'Печать', sub: 'Ctrl + P', keys: 'mod+p' },
        { label: 'Создать', sub: 'Ctrl + N', keys: 'mod+n' }
      ]
    },
    {
      label: 'Окно',
      sub: 'window',
      children: [
        { label: 'Развернуть', sub: 'Win + ↑', keys: 'win+up' },
        { label: 'Свернуть', sub: 'Win + ↓', keys: 'win+down' },
        { label: 'Закрыть', sub: 'Alt + F4', keys: 'alt+f4' }
      ]
    },
    { label: 'Найти', sub: 'Ctrl + F', keys: 'mod+f' }
  ]
};

function profileForApp(info) {
  if (!info) return FALLBACK_PROFILE;

  const haystack = ((info.name || '') + ' ' + (info.title || '')).toLowerCase();
  const found = APP_PROFILES.find((profile) => profile.match.some((token) => haystack.includes(token)));
  if (found) return found;

  const name = (info.name || '').trim();
  return Object.assign({}, FALLBACK_PROFILE, {
    label: name ? name.charAt(0).toUpperCase() + name.slice(1) : FALLBACK_PROFILE.label
  });
}
