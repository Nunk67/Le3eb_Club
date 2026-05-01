import type { Locale } from './locale';

export type MessageKey =
  | 'settings.general'
  | 'settings.language'
  | 'settings.pushNotifications'
  | 'settings.clearCache'
  | 'settings.cacheCleared'
  | 'settings.title'
  | 'settings.accountSection'
  | 'settings.editProfile'
  | 'settings.changePassword'
  | 'settings.linkedAccounts'
  | 'settings.about'
  | 'settings.privacyPolicy'
  | 'settings.termsOfService'
  | 'settings.versionLabel'
  | 'settings.logout'
  | 'ranking.title'
  | 'ranking.refreshing'
  | 'ranking.byScore'
  | 'ranking.byRating'
  | 'ranking.byCompleted'
  | 'ranking.noData'
  | 'ranking.scoreLine'
  | 'ranking.completionRate'
  | 'ranking.viewTop10'
  | 'ranking.loadFailed'
  | 'ranking.top10ModalTitle'
  | 'ranking.modalDetailLine'
  | 'ranking.modalScoreLabel'
  | 'ranking.showBreakdown'
  | 'ranking.hideBreakdown'
  | 'ranking.formulaLabel'
  | 'ranking.formulaExpression'
  | 'ranking.breakdownQuality'
  | 'ranking.breakdownVolume'
  | 'ranking.breakdownFulfillment'
  | 'ranking.breakdownRevenue'
  | 'ranking.breakdownRisk'
  | 'me.walletBalance'
  | 'me.accountManagement'
  | 'me.myOrders'
  | 'me.myOrdersSubtitle'
  | 'me.playerProfile'
  | 'me.playerProfileSubtitle'
  | 'me.onlineStatus'
  | 'me.onlineVisible'
  | 'me.onlineHidden'
  | 'me.becomePlayer'
  | 'me.earnDiamonds'
  | 'me.supportSecurity'
  | 'me.menuSettings'
  | 'me.menuAccountSecurity'
  | 'me.menuHelp'
  | 'me.menuGuidelines'
  | 'me.adjustStatus'
  | 'me.statusOnline'
  | 'me.statusOffline'
  | 'me.statusPlaying'
  | 'me.statusResting'
  | 'me.cancel'
  | 'orders.tabAll'
  | 'orders.tabPending'
  | 'orders.tabOngoing'
  | 'orders.tabCompleted'
  | 'apply.stepOf'
  | 'nav.home'
  | 'nav.community'
  | 'nav.im'
  | 'nav.me'
  | 'apply.pendingTitle'
  | 'apply.pendingBody'
  | 'apply.backToProfile'
  | 'apply.chooseGameTitle'
  | 'apply.chooseGameSubtitle'
  | 'apply.searchGamesPlaceholder'
  | 'apply.tabGames'
  | 'apply.tabChill'
  | 'apply.gameConfigTitle'
  | 'apply.gameConfigSubtitle'
  | 'apply.fieldRank'
  | 'apply.selectRank'
  | 'apply.modalRankTitle'
  | 'apply.fieldMainPosition'
  | 'apply.selectPosition'
  | 'apply.modalPositionTitle'
  | 'apply.fieldServer'
  | 'apply.selectServer'
  | 'apply.modalServerTitle'
  | 'apply.fieldPlatform'
  | 'apply.selectPlatform'
  | 'apply.modalPlatformTitle'
  | 'apply.fieldStyle'
  | 'apply.stylePlaceholder'
  | 'apply.fieldIntro'
  | 'apply.introPlaceholder'
  | 'apply.fieldScreenshot'
  | 'apply.addScreenshot'
  | 'apply.step3Title'
  | 'apply.step3Subtitle'
  | 'apply.voiceRecording'
  | 'apply.voiceRecorded'
  | 'apply.voiceRecordPrompt'
  | 'apply.voiceMaxSeconds'
  | 'apply.startRecording'
  | 'apply.done'
  | 'apply.reRecord'
  | 'apply.saved'
  | 'apply.coverImage'
  | 'apply.uploadCover'
  | 'apply.coverPortraitHint'
  | 'apply.coverIntro'
  | 'apply.coverIntroPlaceholder'
  | 'apply.step4Title'
  | 'apply.step4Subtitle'
  | 'apply.serviceName'
  | 'apply.serviceNamePlaceholder'
  | 'apply.priceCoins'
  | 'apply.unitLabel'
  | 'apply.unitPerGame'
  | 'apply.unitPerHour'
  | 'apply.unitPerRound'
  | 'apply.nextStep'
  | 'apply.submitApplication'
  | 'apply.submittedAlert'
  | 'apply.promoPlaceholderDays'
  | 'apply.promoPlaceholderQty'
  | 'apply.limitNone'
  | 'apply.limitTime'
  | 'apply.limitQty'
  | 'apply.categoryTitle'
  | 'apply.categoryHeading'
  | 'apply.categorySubtitle'
  | 'apply.detailsTitle'
  | 'apply.detailsRankLevel'
  | 'apply.detailsRankPlaceholder'
  | 'apply.detailsPlatform'
  | 'apply.detailsStyle'
  | 'apply.detailsStylePlaceholder'
  | 'apply.detailsPricePerHour'
  | 'apply.detailsDiscount'
  | 'apply.detailsSubmit'
  | 'order.confirmTitle'
  | 'order.serviceType'
  | 'order.quantity'
  | 'order.selectUnits'
  | 'order.totalMinutes'
  | 'order.totalGames'
  | 'order.totalTimes'
  | 'order.totalUnits'
  | 'order.priceSummary'
  | 'order.subtotal'
  | 'order.coupon'
  | 'order.selectCoupon'
  | 'order.noCoupons'
  | 'order.discount'
  | 'order.finalPrice'
  | 'order.payStart'
  | 'order.couponModalTitle'
  | 'order.close'
  | 'order.noCouponOption';

type MessageDict = Record<MessageKey, string>;

const en: MessageDict = {
  'settings.general': 'General',
  'settings.language': 'Language',
  'settings.pushNotifications': 'Push Notifications',
  'settings.clearCache': 'Clear Cache',
  'settings.cacheCleared': 'Cache cleared successfully!',
  'settings.title': 'Settings',
  'settings.accountSection': 'Account',
  'settings.editProfile': 'Edit Profile',
  'settings.changePassword': 'Change Password',
  'settings.linkedAccounts': 'Linked Accounts',
  'settings.about': 'About',
  'settings.privacyPolicy': 'Privacy Policy',
  'settings.termsOfService': 'Terms of Service',
  'settings.versionLabel': 'Version',
  'settings.logout': 'Logout Account',
  'ranking.title': 'Companion Rankings',
  'ranking.refreshing': 'Refreshing...',
  'ranking.byScore': 'By Score',
  'ranking.byRating': 'By Rating',
  'ranking.byCompleted': 'By Completed',
  'ranking.noData': 'No ranking data available yet.',
  'ranking.scoreLine': 'Score {score} · {poolTag} · {completed} completed',
  'ranking.completionRate': '{rate}% completion',
  'ranking.viewTop10': 'View Top 10',
  'ranking.loadFailed': 'Failed to load rankings',
  'ranking.top10ModalTitle': 'Top 10 Rankings',
  'ranking.modalDetailLine': '{poolTag} · ★ {rating} · {completed} completed · {completionPct}% completion',
  'ranking.modalScoreLabel': 'Score {score}',
  'ranking.showBreakdown': 'Show score breakdown',
  'ranking.hideBreakdown': 'Hide score breakdown',
  'ranking.formulaLabel': 'Formula:',
  'ranking.formulaExpression': 'score = quality + volume + fulfillment + revenue - riskPenalty',
  'ranking.breakdownQuality': 'Quality:',
  'ranking.breakdownVolume': 'Volume:',
  'ranking.breakdownFulfillment': 'Fulfillment:',
  'ranking.breakdownRevenue': 'Revenue:',
  'ranking.breakdownRisk': 'Risk Penalty:',
  'me.walletBalance': 'Wallet Balance',
  'me.accountManagement': 'Account Management',
  'me.myOrders': 'My Orders',
  'me.myOrdersSubtitle': 'Manage your service history',
  'me.playerProfile': 'Player Profile',
  'me.playerProfileSubtitle': 'Manage your services & price',
  'me.onlineStatus': 'Online Status',
  'me.onlineVisible': 'Visible to customers',
  'me.onlineHidden': 'Hidden from list',
  'me.becomePlayer': 'Become a Player',
  'me.earnDiamonds': 'Earn Diamonds Now',
  'me.supportSecurity': 'Support & Security',
  'me.menuSettings': 'Settings',
  'me.menuAccountSecurity': 'Account Security',
  'me.menuHelp': 'Help & Support',
  'me.menuGuidelines': 'Community Guidelines',
  'me.adjustStatus': 'Adjust Status',
  'me.statusOnline': 'Online',
  'me.statusOffline': 'Offline',
  'me.statusPlaying': 'Playing',
  'me.statusResting': 'Resting',
  'me.cancel': 'Cancel',
  'orders.tabAll': 'All',
  'orders.tabPending': 'Pending',
  'orders.tabOngoing': 'Ongoing',
  'orders.tabCompleted': 'Completed',
  'apply.stepOf': 'Step {current} of {total}',
  'nav.home': 'Home',
  'nav.community': 'Community',
  'nav.im': 'Messages',
  'nav.me': 'Me',
  'apply.pendingTitle': 'Application Pending',
  'apply.pendingBody':
    'Our team is reviewing your application. This usually takes 24-48 hours. We will notify you once approved!',
  'apply.backToProfile': 'Back to Profile',
  'apply.chooseGameTitle': 'Choose Your Game',
  'apply.chooseGameSubtitle': 'Select the main game you want to provide services for.',
  'apply.searchGamesPlaceholder': 'Search games...',
  'apply.tabGames': 'Games',
  'apply.tabChill': 'Chill',
  'apply.gameConfigTitle': 'Game Configuration',
  'apply.gameConfigSubtitle': 'Configure your {gameName} details.',
  'apply.fieldRank': 'Rank',
  'apply.selectRank': 'Select Rank',
  'apply.modalRankTitle': 'Select Rank',
  'apply.fieldMainPosition': 'Main Position',
  'apply.selectPosition': 'Select Position',
  'apply.modalPositionTitle': 'Select Position',
  'apply.fieldServer': 'Server',
  'apply.selectServer': 'Select Server',
  'apply.modalServerTitle': 'Select Server',
  'apply.fieldPlatform': 'Platform',
  'apply.selectPlatform': 'Select Platform',
  'apply.modalPlatformTitle': 'Select Platform',
  'apply.fieldStyle': 'Style',
  'apply.stylePlaceholder': 'e.g. Aggressive, Strategic, Chill',
  'apply.fieldIntro': 'Introduction',
  'apply.introPlaceholder': 'Tell users about your skills and playstyle...',
  'apply.fieldScreenshot': 'Game Screenshot',
  'apply.addScreenshot': 'Add Game Screenshot',
  'apply.step3Title': 'Voice & Cover',
  'apply.step3Subtitle': 'Make your profile stand out with a voice recording and a great cover.',
  'apply.voiceRecording': 'Voice Recording',
  'apply.voiceRecorded': 'Greeting Recorded',
  'apply.voiceRecordPrompt': 'Record your greeting',
  'apply.voiceMaxSeconds': 'Max 30 seconds',
  'apply.startRecording': 'Start Recording',
  'apply.done': 'Done',
  'apply.reRecord': 'Re-record',
  'apply.saved': 'Saved',
  'apply.coverImage': 'Cover Image',
  'apply.uploadCover': 'Upload Cover',
  'apply.coverPortraitHint': 'Portrait recommended',
  'apply.coverIntro': 'Cover Intro',
  'apply.coverIntroPlaceholder': 'A short catchy intro for your cover...',
  'apply.step4Title': 'Service & Pricing',
  'apply.step4Subtitle': 'Set your service name, price, and optional promotions.',
  'apply.serviceName': 'Service Name',
  'apply.serviceNamePlaceholder': 'e.g. Pro Carry Service',
  'apply.priceCoins': 'Price (Coins)',
  'apply.unitLabel': 'Unit',
  'apply.unitPerGame': 'Per Game',
  'apply.unitPerHour': 'Per Hour',
  'apply.unitPerRound': 'Per Round',
  'apply.nextStep': 'Next Step',
  'apply.submitApplication': 'Submit Application',
  'apply.submittedAlert': 'Application submitted successfully!',
  'apply.promoPlaceholderDays': 'Days',
  'apply.promoPlaceholderQty': 'Quantity',
  'apply.limitNone': 'None',
  'apply.limitTime': 'Time',
  'apply.limitQty': 'Qty',
  'apply.categoryTitle': 'Select Category',
  'apply.categoryHeading': 'Service Category',
  'apply.categorySubtitle': 'What kind of service will you provide for {gameName}?',
  'apply.detailsTitle': 'Service Details',
  'apply.detailsRankLevel': 'Rank / Level',
  'apply.detailsRankPlaceholder': 'e.g. Diamond IV, Level 100',
  'apply.detailsPlatform': 'Platform',
  'apply.detailsStyle': 'Style',
  'apply.detailsStylePlaceholder': 'e.g. Aggressive, Chill, Pro',
  'apply.detailsPricePerHour': 'Price (Coins/hr)',
  'apply.detailsDiscount': 'Discount (%)',
  'apply.detailsSubmit': 'Submit Application',
  'order.confirmTitle': 'Confirm Order',
  'order.serviceType': 'Service Type',
  'order.quantity': 'Quantity',
  'order.selectUnits': 'Select Units',
  'order.totalMinutes': 'Total: {n}min',
  'order.totalGames': 'Total: {n} Games',
  'order.totalTimes': 'Total: {n} Times',
  'order.totalUnits': 'Total: {n} {unit}(s)',
  'order.priceSummary': 'Price Summary',
  'order.subtotal': 'Subtotal',
  'order.coupon': 'Coupon',
  'order.selectCoupon': 'Select coupon',
  'order.noCoupons': 'No Available Coupons',
  'order.discount': 'Discount',
  'order.finalPrice': 'Final Price',
  'order.payStart': 'Pay & Start',
  'order.couponModalTitle': 'Select Coupon',
  'order.close': 'Close',
  'order.noCouponOption': "Don't use coupon"
};

const zhCN: MessageDict = {
  'settings.general': '通用',
  'settings.language': '语言',
  'settings.pushNotifications': '推送通知',
  'settings.clearCache': '清理缓存',
  'settings.cacheCleared': '缓存已清理！',
  'settings.title': '设置',
  'settings.accountSection': '账号',
  'settings.editProfile': '编辑资料',
  'settings.changePassword': '修改密码',
  'settings.linkedAccounts': '关联账号',
  'settings.about': '关于',
  'settings.privacyPolicy': '隐私政策',
  'settings.termsOfService': '服务条款',
  'settings.versionLabel': '版本',
  'settings.logout': '退出登录',
  'ranking.title': '陪玩排行榜',
  'ranking.refreshing': '刷新中...',
  'ranking.byScore': '按分数',
  'ranking.byRating': '按评分',
  'ranking.byCompleted': '按完成单',
  'ranking.noData': '暂无排行榜数据。',
  'ranking.scoreLine': '分数 {score} · {poolTag} · 完成 {completed} 单',
  'ranking.completionRate': '完单率 {rate}%',
  'ranking.viewTop10': '查看 Top 10',
  'ranking.loadFailed': '加载排行榜失败',
  'ranking.top10ModalTitle': 'Top 10 排行榜',
  'ranking.modalDetailLine': '{poolTag} · ★ {rating} · 完成 {completed} 单 · 完单率 {completionPct}%',
  'ranking.modalScoreLabel': '分数 {score}',
  'ranking.showBreakdown': '显示得分拆解',
  'ranking.hideBreakdown': '隐藏得分拆解',
  'ranking.formulaLabel': '公式：',
  'ranking.formulaExpression': 'score = quality + volume + fulfillment + revenue - riskPenalty',
  'ranking.breakdownQuality': '质量：',
  'ranking.breakdownVolume': '体量：',
  'ranking.breakdownFulfillment': '履约：',
  'ranking.breakdownRevenue': '收入：',
  'ranking.breakdownRisk': '风险惩罚：',
  'me.walletBalance': '钱包余额',
  'me.accountManagement': '账号管理',
  'me.myOrders': '我的订单',
  'me.myOrdersSubtitle': '查看与管理服务记录',
  'me.playerProfile': '陪玩档案',
  'me.playerProfileSubtitle': '管理服务与定价',
  'me.onlineStatus': '在线状态',
  'me.onlineVisible': '对客户可见',
  'me.onlineHidden': '从列表隐藏',
  'me.becomePlayer': '成为陪玩',
  'me.earnDiamonds': '立即赚取钻石',
  'me.supportSecurity': '支持与安全',
  'me.menuSettings': '设置',
  'me.menuAccountSecurity': '账号安全',
  'me.menuHelp': '帮助与支持',
  'me.menuGuidelines': '社区准则',
  'me.adjustStatus': '调整状态',
  'me.statusOnline': '在线',
  'me.statusOffline': '离线',
  'me.statusPlaying': '游戏中',
  'me.statusResting': '休息',
  'me.cancel': '取消',
  'orders.tabAll': '全部',
  'orders.tabPending': '待处理',
  'orders.tabOngoing': '进行中',
  'orders.tabCompleted': '已完成',
  'apply.stepOf': '第 {current} / {total} 步',
  'nav.home': '首页',
  'nav.community': '社区',
  'nav.im': '消息',
  'nav.me': '我的',
  'apply.pendingTitle': '申请审核中',
  'apply.pendingBody': '我们正在审核你的申请，通常需要 24–48 小时，通过后会通知你。',
  'apply.backToProfile': '返回个人页',
  'apply.chooseGameTitle': '选择主玩游戏',
  'apply.chooseGameSubtitle': '选择你主要提供陪玩服务的游戏。',
  'apply.searchGamesPlaceholder': '搜索游戏…',
  'apply.tabGames': '游戏',
  'apply.tabChill': '休闲',
  'apply.gameConfigTitle': '游戏配置',
  'apply.gameConfigSubtitle': '配置你的 {gameName} 详情。',
  'apply.fieldRank': '段位',
  'apply.selectRank': '选择段位',
  'apply.modalRankTitle': '选择段位',
  'apply.fieldMainPosition': '主打位置',
  'apply.selectPosition': '选择位置',
  'apply.modalPositionTitle': '选择位置',
  'apply.fieldServer': '服务器',
  'apply.selectServer': '选择服务器',
  'apply.modalServerTitle': '选择服务器',
  'apply.fieldPlatform': '平台',
  'apply.selectPlatform': '选择平台',
  'apply.modalPlatformTitle': '选择平台',
  'apply.fieldStyle': '风格',
  'apply.stylePlaceholder': '例如：激进、稳健、轻松',
  'apply.fieldIntro': '自我介绍',
  'apply.introPlaceholder': '向用户介绍你的特长与打法…',
  'apply.fieldScreenshot': '游戏截图',
  'apply.addScreenshot': '添加截图',
  'apply.step3Title': '语音与封面',
  'apply.step3Subtitle': '用语音与封面让你的档案更吸睛。',
  'apply.voiceRecording': '语音录制',
  'apply.voiceRecorded': '已录制问候',
  'apply.voiceRecordPrompt': '录制问候语',
  'apply.voiceMaxSeconds': '最长 30 秒',
  'apply.startRecording': '开始录制',
  'apply.done': '完成',
  'apply.reRecord': '重录',
  'apply.saved': '已保存',
  'apply.coverImage': '封面图',
  'apply.uploadCover': '上传封面',
  'apply.coverPortraitHint': '建议使用竖图',
  'apply.coverIntro': '封面简介',
  'apply.coverIntroPlaceholder': '一句简短的封面文案…',
  'apply.step4Title': '服务与定价',
  'apply.step4Subtitle': '设置服务名称、价格与可选促销。',
  'apply.serviceName': '服务名称',
  'apply.serviceNamePlaceholder': '例如：上分护航',
  'apply.priceCoins': '价格（金币）',
  'apply.unitLabel': '计价单位',
  'apply.unitPerGame': '按局',
  'apply.unitPerHour': '按小时',
  'apply.unitPerRound': '按回合',
  'apply.nextStep': '下一步',
  'apply.submitApplication': '提交申请',
  'apply.submittedAlert': '申请已提交！',
  'apply.promoPlaceholderDays': '天数',
  'apply.promoPlaceholderQty': '数量',
  'apply.limitNone': '不限',
  'apply.limitTime': '时限',
  'apply.limitQty': '限量',
  'apply.categoryTitle': '选择类目',
  'apply.categoryHeading': '服务类目',
  'apply.categorySubtitle': '你将为 {gameName} 提供哪种服务？',
  'apply.detailsTitle': '服务详情',
  'apply.detailsRankLevel': '段位 / 等级',
  'apply.detailsRankPlaceholder': '例如：钻石 IV、100 级',
  'apply.detailsPlatform': '平台',
  'apply.detailsStyle': '风格',
  'apply.detailsStylePlaceholder': '例如：激进、轻松、职业',
  'apply.detailsPricePerHour': '价格（金币/小时）',
  'apply.detailsDiscount': '折扣（%）',
  'apply.detailsSubmit': '提交申请',
  'order.confirmTitle': '确认订单',
  'order.serviceType': '服务类型',
  'order.quantity': '数量',
  'order.selectUnits': '选择数量',
  'order.totalMinutes': '合计：{n} 分钟',
  'order.totalGames': '合计：{n} 局',
  'order.totalTimes': '合计：{n} 次',
  'order.totalUnits': '合计：{n} {unit}',
  'order.priceSummary': '价格明细',
  'order.subtotal': '小计',
  'order.coupon': '优惠券',
  'order.selectCoupon': '选择优惠券',
  'order.noCoupons': '暂无可用优惠券',
  'order.discount': '优惠',
  'order.finalPrice': '应付',
  'order.payStart': '支付并开始',
  'order.couponModalTitle': '选择优惠券',
  'order.close': '关闭',
  'order.noCouponOption': '不使用优惠券'
};

const ar: MessageDict = {
  ...en,
  'settings.general': 'عام',
  'settings.language': 'اللغة',
  'settings.pushNotifications': 'إشعارات الدفع',
  'settings.clearCache': 'مسح ذاكرة التخزين',
  'settings.cacheCleared': 'تم مسح ذاكرة التخزين!',
  'settings.title': 'الإعدادات',
  'settings.accountSection': 'الحساب',
  'settings.editProfile': 'تعديل الملف',
  'settings.changePassword': 'تغيير كلمة المرور',
  'settings.linkedAccounts': 'الحسابات المرتبطة',
  'settings.about': 'حول',
  'settings.privacyPolicy': 'سياسة الخصوصية',
  'settings.termsOfService': 'شروط الخدمة',
  'settings.versionLabel': 'الإصدار',
  'settings.logout': 'تسجيل الخروج',
  'ranking.title': 'تصنيف المرافقين',
  'ranking.top10ModalTitle': 'أفضل 10 في التصنيف',
  'me.walletBalance': 'رصيد المحفظة',
  'me.accountManagement': 'إدارة الحساب',
  'me.myOrders': 'طلباتي',
  'me.myOrdersSubtitle': 'إدارة سجل الخدمات',
  'me.playerProfile': 'ملف اللاعب',
  'me.playerProfileSubtitle': 'إدارة الخدمات والسعر',
  'me.onlineStatus': 'حالة الاتصال',
  'me.onlineVisible': 'ظاهر للعملاء',
  'me.onlineHidden': 'مخفي من القائمة',
  'me.becomePlayer': 'كن مرافقًا',
  'me.earnDiamonds': 'اربح الماس الآن',
  'me.supportSecurity': 'الدعم والأمان',
  'me.menuSettings': 'الإعدادات',
  'me.menuAccountSecurity': 'أمان الحساب',
  'me.menuHelp': 'المساعدة والدعم',
  'me.menuGuidelines': 'إرشادات المجتمع',
  'me.adjustStatus': 'ضبط الحالة',
  'me.cancel': 'إلغاء',
  'orders.tabAll': 'الكل',
  'orders.tabPending': 'قيد الانتظار',
  'orders.tabOngoing': 'جاري',
  'orders.tabCompleted': 'مكتمل',
  'apply.stepOf': 'الخطوة {current} من {total}',
  'nav.home': 'الرئيسية',
  'nav.community': 'المجتمع',
  'nav.im': 'الرسائل',
  'nav.me': 'أنا'
};

const fr: MessageDict = {
  ...en,
  'settings.title': 'Parametres',
  'settings.accountSection': 'Compte',
  'settings.editProfile': 'Modifier le profil',
  'settings.changePassword': 'Changer le mot de passe',
  'settings.linkedAccounts': 'Comptes lies',
  'settings.about': 'A propos',
  'settings.privacyPolicy': 'Politique de confidentialite',
  'settings.termsOfService': 'Conditions d utilisation',
  'settings.versionLabel': 'Version',
  'settings.logout': 'Deconnexion',
  'ranking.title': 'Classement des compagnons',
  'me.walletBalance': 'Solde du portefeuille',
  'me.accountManagement': 'Gestion du compte',
  'me.myOrders': 'Mes commandes',
  'me.myOrdersSubtitle': 'Historique des services',
  'me.playerProfile': 'Profil joueur',
  'me.playerProfileSubtitle': 'Services et tarifs',
  'me.onlineStatus': 'Statut en ligne',
  'me.onlineVisible': 'Visible aux clients',
  'me.onlineHidden': 'Masque dans la liste',
  'me.becomePlayer': 'Devenir joueur',
  'me.earnDiamonds': 'Gagnez des diamants',
  'me.supportSecurity': 'Support et securite',
  'me.menuSettings': 'Parametres',
  'me.menuAccountSecurity': 'Securite du compte',
  'me.menuHelp': 'Aide et support',
  'me.menuGuidelines': 'Regles de la communaute',
  'me.adjustStatus': 'Ajuster le statut',
  'me.cancel': 'Annuler',
  'orders.tabAll': 'Tous',
  'orders.tabPending': 'En attente',
  'orders.tabOngoing': 'En cours',
  'orders.tabCompleted': 'Termine',
  'apply.stepOf': 'Etape {current} sur {total}'
};

const ru: MessageDict = {
  ...en,
  'settings.title': 'Настройки',
  'settings.accountSection': 'Аккаунт',
  'settings.editProfile': 'Редактировать профиль',
  'settings.changePassword': 'Сменить пароль',
  'settings.linkedAccounts': 'Связанные аккаунты',
  'settings.about': 'О приложении',
  'settings.privacyPolicy': 'Политика конфиденциальности',
  'settings.termsOfService': 'Условия использования',
  'settings.versionLabel': 'Версия',
  'settings.logout': 'Выйти',
  'ranking.title': 'Рейтинг компаньонов',
  'me.walletBalance': 'Баланс кошелька',
  'me.accountManagement': 'Управление аккаунтом',
  'me.myOrders': 'Мои заказы',
  'me.myOrdersSubtitle': 'История услуг',
  'me.playerProfile': 'Профиль игрока',
  'me.playerProfileSubtitle': 'Услуги и цена',
  'me.onlineStatus': 'Статус онлайн',
  'me.onlineVisible': 'Виден клиентам',
  'me.onlineHidden': 'Скрыт из списка',
  'me.becomePlayer': 'Стать игроком',
  'me.earnDiamonds': 'Зарабатывайте алмазы',
  'me.supportSecurity': 'Поддержка и безопасность',
  'me.menuSettings': 'Настройки',
  'me.menuAccountSecurity': 'Безопасность',
  'me.menuHelp': 'Помощь',
  'me.menuGuidelines': 'Правила сообщества',
  'me.adjustStatus': 'Изменить статус',
  'me.cancel': 'Отмена',
  'orders.tabAll': 'Все',
  'orders.tabPending': 'В ожидании',
  'orders.tabOngoing': 'В работе',
  'orders.tabCompleted': 'Завершено',
  'apply.stepOf': 'Шаг {current} из {total}'
};

const tr: MessageDict = {
  ...en,
  'settings.title': 'Ayarlar',
  'settings.accountSection': 'Hesap',
  'settings.editProfile': 'Profili Duzenle',
  'settings.changePassword': 'Sifreyi Degistir',
  'settings.linkedAccounts': 'Bagli Hesaplar',
  'settings.about': 'Hakkinda',
  'settings.privacyPolicy': 'Gizlilik Politikasi',
  'settings.termsOfService': 'Kullanim Sartlari',
  'settings.versionLabel': 'Surum',
  'settings.logout': 'Cikis Yap',
  'ranking.title': 'Partner Siralamasi',
  'me.walletBalance': 'Cuzdan Bakiyesi',
  'me.accountManagement': 'Hesap Yonetimi',
  'me.myOrders': 'Siparislerim',
  'me.myOrdersSubtitle': 'Hizmet gecmisinizi yonetin',
  'me.playerProfile': 'Oyuncu Profili',
  'me.playerProfileSubtitle': 'Hizmet ve fiyat',
  'me.onlineStatus': 'Cevrimici Durum',
  'me.onlineVisible': 'Musterilere gorunur',
  'me.onlineHidden': 'Listede gizli',
  'me.becomePlayer': 'Oyuncu Ol',
  'me.earnDiamonds': 'Simdi Elmas Kazan',
  'me.supportSecurity': 'Destek ve Guvenlik',
  'me.menuSettings': 'Ayarlar',
  'me.menuAccountSecurity': 'Hesap Guvenligi',
  'me.menuHelp': 'Yardim ve Destek',
  'me.menuGuidelines': 'Topluluk Kurallari',
  'me.adjustStatus': 'Durumu Ayarla',
  'me.cancel': 'Iptal',
  'orders.tabAll': 'Tumu',
  'orders.tabPending': 'Beklemede',
  'orders.tabOngoing': 'Devam eden',
  'orders.tabCompleted': 'Tamamlandi',
  'apply.stepOf': 'Adim {current} / {total}'
};

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ar: 'Arabic',
  'zh-CN': 'Chinese (Simplified)',
  fr: 'French',
  ru: 'Russian',
  tr: 'Turkish'
};

export const messages: Record<Locale, MessageDict> = {
  en,
  ar,
  'zh-CN': zhCN,
  fr,
  ru,
  tr
};
