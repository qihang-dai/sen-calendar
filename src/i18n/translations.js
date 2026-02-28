export const translations = {
  en: {
    appKanji:   '千',
    appName:    'Sen',
    appSubtitle: 'Your personal well-being journal',

    // Header
    viewMonth: 'Month',
    viewYear:  'Year',

    // Setup guide
    setupBeforeTitle: 'Before we begin',
    setupBeforeDesc:  'Sen stores your data in JSONBin — a free, private JSON storage service. Your logs sync across all your devices without any account or login.',
    setupStep1: 'Go to jsonbin.io and create a free account',
    setupStep2: 'In your dashboard, go to API Keys and copy your Master Key',
    setupStep3: 'Come back here and paste it in — Sen will create a private storage bin automatically',
    setupPrivacy: 'Your data is private. Only accessible with your Master Key. Sen never sends it anywhere else.',
    setupHaveKey: 'I have my key →',
    setupSkip:    'Skip sync — use this device only',
    setupConnectTitle: 'Connect your storage',
    setupNewMode:      'New setup',
    setupExistingMode: 'I already have a bin',
    setupMasterKey:    'JSONBin Master Key',
    setupBinId:        'Bin ID',
    setupBinHint:      "Find this in your JSONBin dashboard under your bin's settings",
    setupCreate:       'Create & Connect',
    setupConnectBtn:   'Connect',
    setupConnecting:   'Connecting...',
    setupBack:         '← Back',

    // Day modal
    dayVibe:          'Day vibe',
    suggested:        'Suggested',
    maxEmojisNote:    'Max 4 emojis — deselect one to change',
    sectionFap:       'Fap',
    fapClean:         'Clean',
    sectionWork:      'Work fulfillment',
    sectionLoved:     'Feel loved',
    sectionSocial:    'Social / hangout',
    sectionProductive:'Productive / learning',
    sectionGym:       'Gym / workout',
    gymDone:          'Done it',
    gymRest:          'Rest day',
    sectionSmoking:   'No smoking',
    smokeFree:        'Smoke-free',
    smokedToday:      'Smoked',
    sectionNote:      'Note',
    notePlaceholder:  'Anything on your mind...',
    todayBadge:       'Today',
    futureNote:       'Not there yet 🌿',
    save:             'Save',
    clearDay:         'Clear day',
    clearMonth:       'Clear month',
    clearMonthConfirm:'Confirm clear?',

    // Month view day labels
    dayLabels:     ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dayLabelsMini: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],

    // Streak stat (MonthView)
    streakLongest:  'Best streak',
    streakCurrent:  'Running now',
    streakDays:     'days',
    streakPB:       'Personal best!',

    // Dimension legend labels
    dimLabels: {
      work:       'Work',
      loved:      'Loved',
      social:     'Social',
      productive: 'Productive',
      gym:        'Gym',
      smoking:    'No Smoke',
      fap:        'Fap',
    },

    // Settings modal
    settingsTitle:    'Settings',
    syncStorageTitle: 'Sync storage',
    syncStorageDesc:  'Connect a JSONBin account to sync your data across devices.',
    getKeyLink:       'Get a free key →',
    saveKeys:         'Save keys',
    keysSaved:        'Saved ✓',
    disconnectSync:   'Disconnect sync',
    aboutTitle:       'About',
    aboutDesc:        "Sen saves your well-being logs in your browser's localStorage as a backup, and syncs to JSONBin when connected. Data never leaves these two places.",
  },

  zh: {
    appKanji:   '戒',
    appName:    '戒色日历',
    appSubtitle: '你的个人身心健康日记',

    // Header
    viewMonth: '月视图',
    viewYear:  '年视图',

    // Setup guide
    setupBeforeTitle: '开始之前',
    setupBeforeDesc:  '戒色日历 将数据存储在 JSONBin——一项免费的私人 JSON 存储服务。你的记录可以在所有设备间同步，无需注册账号或登录。',
    setupStep1: '前往 jsonbin.io 注册一个免费账户',
    setupStep2: '在控制台中打开「API Keys」，复制你的 Master Key',
    setupStep3: '回到这里粘贴密钥——应用会自动为你创建私人存储仓',
    setupPrivacy: '你的数据完全私密，仅凭 Master Key 才能访问。戒色日历不会将其发送到任何其他地方。',
    setupHaveKey: '我有密钥了 →',
    setupSkip:    '跳过同步，仅在本设备使用',
    setupConnectTitle: '连接存储',
    setupNewMode:      '新建配置',
    setupExistingMode: '我已有存储仓',
    setupMasterKey:    'JSONBin Master Key',
    setupBinId:        'Bin ID',
    setupBinHint:      '在 JSONBin 控制台中对应存储仓的设置页面可以找到',
    setupCreate:       '创建并连接',
    setupConnectBtn:   '连接',
    setupConnecting:   '连接中……',
    setupBack:         '← 返回',

    // Day modal
    dayVibe:          '今日心情',
    suggested:        '推荐',
    maxEmojisNote:    '最多选 4 个，取消一个后可继续添加',
    sectionFap:       '色戒',
    fapClean:         '已戒',
    sectionWork:      '工作充实感',
    sectionLoved:     '被爱感',
    sectionSocial:    '社交 / 出去玩',
    sectionProductive:'自我提升',
    sectionGym:       '健身 / 运动',
    gymDone:          '练了',
    gymRest:          '休息日',
    sectionSmoking:   '戒烟',
    smokeFree:        '未抽烟',
    smokedToday:      '抽了',
    sectionNote:      '随笔',
    notePlaceholder:  '写点什么……',
    todayBadge:       '今天',
    futureNote:       '还没到那天呢 🌿',
    save:             '保存',
    clearDay:         '清除记录',
    clearMonth:       '清空本月',
    clearMonthConfirm:'确认清空？',

    // Month view day labels
    dayLabels:     ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    dayLabelsMini: ['一', '二', '三', '四', '五', '六', '日'],

    // Streak stat (MonthView)
    streakLongest:  '最长连胜',
    streakCurrent:  '当前连胜',
    streakDays:     '天',
    streakPB:       '个人最佳！',

    // Dimension legend labels
    dimLabels: {
      work:       '工作',
      loved:      '被爱',
      social:     '社交',
      productive: '自律',
      gym:        '健身',
      smoking:    '戒烟',
      fap:        '色戒',
    },

    // Settings modal
    settingsTitle:    '设置',
    syncStorageTitle: '云同步',
    syncStorageDesc:  '连接 JSONBin 账户，让数据在所有设备间同步。',
    getKeyLink:       '获取免费密钥 →',
    saveKeys:         '保存密钥',
    keysSaved:        '已保存 ✓',
    disconnectSync:   '断开同步',
    aboutTitle:       '关于',
    aboutDesc:        '戒色日历 将记录保存在浏览器的 localStorage 中作为备份，连接后同步至 JSONBin。数据仅存在于这两个地方。',
  },
}
