import type { Locale } from './locale';

export type MessageKey =
  | 'home.search'
  | 'home.trendingRealms'
  | 'home.legendEPals'
  | 'home.moreEPals'
  | 'home.viewAll'
  | 'home.loadingMore'
  | 'auth.loginRequired'
  | 'auth.loginRequiredFeature'
  | 'auth.loggedOut'
  | 'auth.loggingIn'
  | 'auth.registering'
  | 'auth.loggedIn'
  | 'auth.welcomeTitle'
  | 'auth.welcomeBody'
  | 'auth.goToLogin'
  | 'auth.register'
  | 'auth.registerPrompt'
  | 'auth.modalLogin'
  | 'auth.modalRegister'
  | 'auth.modalContinueHint'
  | 'auth.usernamePlaceholder'
  | 'auth.emailPlaceholder'
  | 'auth.passwordPlaceholder'
  | 'auth.createAccount'
  | 'auth.noAccountRegister'
  | 'auth.haveAccountLogin'
  | 'admin.status.ready'
  | 'admin.status.sessionExpired'
  | 'admin.status.loggingIn'
  | 'admin.status.readyAfterLogin'
  | 'admin.status.loginDashboardLoadFailed'
  | 'admin.status.loggedOut'
  | 'admin.status.dataReportLoadFailed'
  | 'admin.status.processingWithdrawal'
  | 'admin.status.withdrawalApproved'
  | 'admin.status.withdrawalRejected'
  | 'admin.status.processingReport'
  | 'admin.status.reportResolved'
  | 'admin.status.reportDismissed'
  | 'admin.status.invalidServiceJson'
  | 'admin.status.fillWalletDelta'
  | 'admin.status.adjustDone'
  | 'admin.status.adjustFailed'
  | 'admin.status.voucherIssued'
  | 'admin.status.voucherIssueFailed'
  | 'admin.status.accountStatusUpdated'
  | 'admin.status.updateFailed'
  | 'admin.status.profileUpdated'
  | 'admin.status.operationFailed'
  | 'admin.status.runCompleted'
  | 'admin.ops.resolveRiskEvent'
  | 'admin.ops.updateAdminTemplate'
  | 'admin.ops.updateCompanionServices'
  | 'admin.ops.filterAuditLogs'
  | 'admin.ops.loadMoreAudit'
  | 'admin.ops.exportAuditCsv'
  | 'admin.login.title'
  | 'admin.login.subtitle'
  | 'admin.login.emailPlaceholder'
  | 'admin.login.passwordPlaceholder'
  | 'admin.login.submit'
  | 'admin.login.viaUserAppHint'
  | 'admin.login.notAdmin'
  | 'admin.shell.title'
  | 'admin.shell.localWorkbench'
  | 'admin.shell.console'
  | 'admin.shell.userSide'
  | 'admin.shell.logout'
  | 'admin.shell.notifications'
  | 'admin.nav.dashboard'
  | 'admin.nav.users'
  | 'admin.nav.withdrawals'
  | 'admin.nav.reports'
  | 'admin.nav.data'
  | 'admin.nav.companions'
  | 'admin.nav.orders'
  | 'admin.nav.reviews'
  | 'admin.nav.risks'
  | 'admin.nav.finance'
  | 'admin.nav.audit'
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
  | 'order.noCouponOption'
  | 'search.placeholderByIdOrName'
  | 'search.forEpalsTitle'
  | 'search.forEpalsSubtitle'
  | 'search.noResultsForQuery'
  | 'search.resultsHeading'
  | 'search.epalIdPrefix'
  | 'community.selectTitle'
  | 'community.tabTrending'
  | 'community.tabLatest'
  | 'community.feedFollowing'
  | 'community.follow'
  | 'community.following'
  | 'community.gift'
  | 'community.noPostsTitle'
  | 'community.noPostsFollowingHint'
  | 'community.noPostsGenericHint'
  | 'category.servicesTitle'
  | 'category.tabChilling'
  | 'category.tabFavorite'
  | 'category.noGamesForQuery'
  | 'category.noFavoritesYet'
  | 'category.noResultsForSearch'
  | 'im.tabMessage'
  | 'im.tabFriends'
  | 'im.tabOrder'
  | 'im.noMutualFollowers'
  | 'im.mutualFollowerLine'
  | 'im.online'
  | 'im.typeMessagePlaceholder'
  | 'contacts.title'
  | 'contacts.tabFriends'
  | 'contacts.tabFollowing'
  | 'contacts.tabFollowers'
  | 'contacts.emptyFriends'
  | 'contacts.emptyFollowing'
  | 'contacts.emptyFollowers'
  | 'contacts.mutual';

type MessageDict = Record<MessageKey, string>;

const en: MessageDict = {
  'home.search': 'Search',
  'home.trendingRealms': 'Trending Realms',
  'home.legendEPals': 'Legend ePals',
  'home.moreEPals': 'More ePals',
  'home.viewAll': 'View All',
  'home.loadingMore': 'Loading more...',
  'auth.loginRequired': 'Please log in to continue',
  'auth.loginRequiredFeature': 'Please log in before using this feature',
  'auth.loggedOut': 'Logged out',
  'auth.loggingIn': 'Logging in...',
  'auth.registering': 'Registering...',
  'auth.loggedIn': 'Logged in',
  'auth.welcomeTitle': 'Welcome',
  'auth.welcomeBody': 'You are currently not logged in. Log in to access personal center and account actions.',
  'auth.goToLogin': 'Go to Login',
  'auth.register': 'Register',
  'auth.registerPrompt': 'Create an account to continue',
  'auth.modalLogin': 'Login',
  'auth.modalRegister': 'Register',
  'auth.modalContinueHint': 'Use your account to continue.',
  'auth.usernamePlaceholder': 'username',
  'auth.emailPlaceholder': 'email',
  'auth.passwordPlaceholder': 'password',
  'auth.createAccount': 'Create account',
  'auth.noAccountRegister': 'No account? Register now',
  'auth.haveAccountLogin': 'Already have an account? Log in',
  'admin.status.ready': 'Ready',
  'admin.status.sessionExpired': 'Session expired, please log in again',
  'admin.status.loggingIn': 'Signing in...',
  'admin.status.readyAfterLogin': 'Ready',
  'admin.status.loginDashboardLoadFailed': 'Logged in, but dashboard load failed: {message}',
  'admin.status.loggedOut': 'Logged out',
  'admin.status.dataReportLoadFailed': 'Data report load failed',
  'admin.status.processingWithdrawal': 'Processing withdrawal...',
  'admin.status.withdrawalApproved': 'Withdrawal approved',
  'admin.status.withdrawalRejected': 'Withdrawal rejected',
  'admin.status.processingReport': 'Processing report...',
  'admin.status.reportResolved': 'Report resolved',
  'admin.status.reportDismissed': 'Report dismissed',
  'admin.status.invalidServiceJson': 'Invalid services JSON',
  'admin.status.fillWalletDelta': 'Please enter coin or diamond delta',
  'admin.status.adjustDone': 'Wallet adjustment completed',
  'admin.status.adjustFailed': 'Wallet adjustment failed',
  'admin.status.voucherIssued': 'Voucher issued',
  'admin.status.voucherIssueFailed': 'Voucher issue failed',
  'admin.status.accountStatusUpdated': 'Account status updated',
  'admin.status.updateFailed': 'Update failed',
  'admin.status.profileUpdated': 'Profile updated',
  'admin.status.operationFailed': 'Operation failed',
  'admin.status.runCompleted': '{label} · completed',
  'admin.ops.resolveRiskEvent': 'Resolve risk event',
  'admin.ops.updateAdminTemplate': 'Update admin role template',
  'admin.ops.updateCompanionServices': 'Update companion services',
  'admin.ops.filterAuditLogs': 'Filter audit logs',
  'admin.ops.loadMoreAudit': 'Load more audit logs',
  'admin.ops.exportAuditCsv': 'Export audit CSV',
  'admin.login.title': 'Admin Login',
  'admin.login.subtitle': 'Unified entry for authentication, moderation, risk control, finance, and audit.',
  'admin.login.emailPlaceholder': 'Admin email',
  'admin.login.passwordPlaceholder': 'Password',
  'admin.login.submit': 'Sign In',
  'admin.login.viaUserAppHint': 'Sign in with your admin account using the same login as the user app.',
  'admin.login.notAdmin': 'This account does not have admin access.',
  'admin.shell.title': 'Admin Workspace',
  'admin.shell.localWorkbench': 'Local workbench - operations debug only',
  'admin.shell.console': 'Le3eb Console',
  'admin.shell.userSide': 'User App',
  'admin.shell.logout': 'Logout',
  'admin.shell.notifications': 'Notifications',
  'admin.nav.dashboard': 'Dashboard',
  'admin.nav.users': 'User Management',
  'admin.nav.withdrawals': 'Withdrawal Review',
  'admin.nav.reports': 'Report Review',
  'admin.nav.data': 'Data Reports',
  'admin.nav.companions': 'Companion Review',
  'admin.nav.orders': 'Order Management',
  'admin.nav.reviews': 'Review Moderation',
  'admin.nav.risks': 'Risk Events',
  'admin.nav.finance': 'Finance Reconciliation',
  'admin.nav.audit': 'Audit Logs',
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
  'order.noCouponOption': "Don't use coupon",
  'search.placeholderByIdOrName': 'Search by ID or Name',
  'search.forEpalsTitle': 'Search for EPals',
  'search.forEpalsSubtitle': 'Enter an ID or nickname to find someone',
  'search.noResultsForQuery': 'No results found for "{query}"',
  'search.resultsHeading': 'Search Results',
  'search.epalIdPrefix': 'ID:',
  'community.selectTitle': 'Select Community',
  'community.tabTrending': 'Trending',
  'community.tabLatest': 'Latest',
  'community.feedFollowing': 'Following',
  'community.follow': 'Follow',
  'community.following': 'Following',
  'community.gift': 'Gift',
  'community.noPostsTitle': 'No posts found',
  'community.noPostsFollowingHint': "You haven't followed anyone yet or they haven't posted.",
  'community.noPostsGenericHint': 'Try exploring other tabs or categories.',
  'category.servicesTitle': 'Services',
  'category.tabChilling': 'Chilling',
  'category.tabFavorite': 'Favorite',
  'category.noGamesForQuery': 'No games found for "{query}"',
  'category.noFavoritesYet': 'No favorites yet',
  'category.noResultsForSearch': 'No results found',
  'im.tabMessage': 'Message',
  'im.tabFriends': 'Friends',
  'im.tabOrder': 'Order',
  'im.noMutualFollowers': 'No mutual followers found',
  'im.mutualFollowerLine': 'Mutual follower • {game}',
  'im.online': 'Online',
  'im.typeMessagePlaceholder': 'Type a message...',
  'contacts.title': 'Contacts',
  'contacts.tabFriends': 'Friends',
  'contacts.tabFollowing': 'Following',
  'contacts.tabFollowers': 'Followers',
  'contacts.emptyFriends': 'No friends yet',
  'contacts.emptyFollowing': 'No following yet',
  'contacts.emptyFollowers': 'No followers yet',
  'contacts.mutual': 'Mutual'
};

const zhCN: MessageDict = {
  'home.search': '搜索',
  'home.trendingRealms': '热门专区',
  'home.legendEPals': '传奇陪玩',
  'home.moreEPals': '更多陪玩',
  'home.viewAll': '查看全部',
  'home.loadingMore': '加载更多...',
  'auth.loginRequired': '请先登录后继续',
  'auth.loginRequiredFeature': '使用此功能前请先登录',
  'auth.loggedOut': '已退出登录',
  'auth.loggingIn': '登录中...',
  'auth.registering': '注册中...',
  'auth.loggedIn': '登录成功',
  'auth.welcomeTitle': '欢迎',
  'auth.welcomeBody': '你当前尚未登录，登录后可访问个人中心与账户功能。',
  'auth.goToLogin': '去登录',
  'auth.register': '注册',
  'auth.registerPrompt': '创建账号后继续',
  'auth.modalLogin': '登录',
  'auth.modalRegister': '注册',
  'auth.modalContinueHint': '使用你的账号继续。',
  'auth.usernamePlaceholder': '用户名',
  'auth.emailPlaceholder': '邮箱',
  'auth.passwordPlaceholder': '密码',
  'auth.createAccount': '创建账号',
  'auth.noAccountRegister': '没有账号？立即注册',
  'auth.haveAccountLogin': '已有账号？去登录',
  'admin.status.ready': '就绪',
  'admin.status.sessionExpired': '会话已过期，请重新登录',
  'admin.status.loggingIn': '正在登录…',
  'admin.status.readyAfterLogin': '已就绪',
  'admin.status.loginDashboardLoadFailed': '已登录，但仪表盘加载失败：{message}',
  'admin.status.loggedOut': '已退出登录',
  'admin.status.dataReportLoadFailed': '数据报表加载失败',
  'admin.status.processingWithdrawal': '处理提现中…',
  'admin.status.withdrawalApproved': '提现已通过',
  'admin.status.withdrawalRejected': '提现已拒绝',
  'admin.status.processingReport': '处理举报中…',
  'admin.status.reportResolved': '举报已结案',
  'admin.status.reportDismissed': '举报已驳回',
  'admin.status.invalidServiceJson': '服务 JSON 格式错误',
  'admin.status.fillWalletDelta': '请填写金币或钻石变动',
  'admin.status.adjustDone': '调账完成',
  'admin.status.adjustFailed': '调账失败',
  'admin.status.voucherIssued': '代金券已发放',
  'admin.status.voucherIssueFailed': '代金券发放失败',
  'admin.status.accountStatusUpdated': '账号状态已更新',
  'admin.status.updateFailed': '更新失败',
  'admin.status.profileUpdated': '资料已更新',
  'admin.status.operationFailed': '操作失败',
  'admin.status.runCompleted': '{label} · 已完成',
  'admin.ops.resolveRiskEvent': '处理风控事件',
  'admin.ops.updateAdminTemplate': '更新管理员模板',
  'admin.ops.updateCompanionServices': '更新陪玩服务',
  'admin.ops.filterAuditLogs': '筛选审计日志',
  'admin.ops.loadMoreAudit': '加载下一批审计',
  'admin.ops.exportAuditCsv': '导出审计 CSV',
  'admin.login.title': '管理后台登录',
  'admin.login.subtitle': '鉴权、审核、风控、财务与审计的统一入口。',
  'admin.login.emailPlaceholder': '管理员邮箱',
  'admin.login.passwordPlaceholder': '密码',
  'admin.login.submit': '登录',
  'admin.login.viaUserAppHint': '请使用与用户端相同的登录界面，输入管理员账号密码进入运营后台。',
  'admin.login.notAdmin': '该账号没有运营后台权限。',
  'admin.shell.title': '管理后台',
  'admin.shell.localWorkbench': '本地工作台 · 仅供运营调试',
  'admin.shell.console': 'Le3eb 控制台',
  'admin.shell.userSide': '用户端',
  'admin.shell.logout': '退出',
  'admin.shell.notifications': '通知',
  'admin.nav.dashboard': '仪表盘',
  'admin.nav.users': '用户管理',
  'admin.nav.withdrawals': '提现审核',
  'admin.nav.reports': '举报审核',
  'admin.nav.data': '数据报表',
  'admin.nav.companions': '陪玩审核',
  'admin.nav.orders': '订单管理',
  'admin.nav.reviews': '评价审核',
  'admin.nav.risks': '风控事件',
  'admin.nav.finance': '财务对账',
  'admin.nav.audit': '审计日志',
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
  'order.noCouponOption': '不使用优惠券',
  'search.placeholderByIdOrName': '按 ID 或昵称搜索',
  'search.forEpalsTitle': '搜索陪玩',
  'search.forEpalsSubtitle': '输入 ID 或昵称查找用户',
  'search.noResultsForQuery': '未找到与「{query}」相关的结果',
  'search.resultsHeading': '搜索结果',
  'search.epalIdPrefix': 'ID：',
  'community.selectTitle': '选择社区',
  'community.tabTrending': '热门',
  'community.tabLatest': '最新',
  'community.feedFollowing': '关注',
  'community.follow': '关注',
  'community.following': '已关注',
  'community.gift': '礼物',
  'community.noPostsTitle': '暂无动态',
  'community.noPostsFollowingHint': '你还没有关注任何人，或对方尚未发帖。',
  'community.noPostsGenericHint': '试试其他标签或分区。',
  'category.servicesTitle': '服务',
  'category.tabChilling': '休闲',
  'category.tabFavorite': '收藏',
  'category.noGamesForQuery': '未找到与「{query}」相关的游戏',
  'category.noFavoritesYet': '暂无收藏',
  'category.noResultsForSearch': '暂无结果',
  'im.tabMessage': '消息',
  'im.tabFriends': '好友',
  'im.tabOrder': '订单',
  'im.noMutualFollowers': '暂无互相关注',
  'im.mutualFollowerLine': '互相关注 • {game}',
  'im.online': '在线',
  'im.typeMessagePlaceholder': '输入消息…',
  'contacts.title': '联系人',
  'contacts.tabFriends': '好友',
  'contacts.tabFollowing': '关注',
  'contacts.tabFollowers': '粉丝',
  'contacts.emptyFriends': '暂无好友',
  'contacts.emptyFollowing': '暂无关注',
  'contacts.emptyFollowers': '暂无粉丝',
  'contacts.mutual': '互关'
};

const ar: MessageDict = {
  ...en,
  'home.search': 'بحث',
  'home.trendingRealms': 'العوالم الرائجة',
  'home.legendEPals': 'رفاق أسطوريون',
  'home.moreEPals': 'رفاق أكثر',
  'home.viewAll': 'عرض الكل',
  'home.loadingMore': 'جاري تحميل المزيد...',
  'auth.loginRequired': 'يرجى تسجيل الدخول للمتابعة',
  'auth.loginRequiredFeature': 'يرجى تسجيل الدخول قبل استخدام هذه الميزة',
  'auth.loggedOut': 'تم تسجيل الخروج',
  'auth.loggingIn': 'جارٍ تسجيل الدخول...',
  'auth.registering': 'جارٍ إنشاء الحساب...',
  'auth.loggedIn': 'تم تسجيل الدخول',
  'auth.welcomeTitle': 'مرحبًا',
  'auth.welcomeBody': 'أنت غير مسجل الدخول حاليًا. سجّل الدخول للوصول إلى المركز الشخصي وإجراءات الحساب.',
  'auth.goToLogin': 'الانتقال إلى تسجيل الدخول',
  'auth.register': 'تسجيل',
  'auth.registerPrompt': 'أنشئ حسابًا للمتابعة',
  'auth.modalLogin': 'تسجيل الدخول',
  'auth.modalRegister': 'تسجيل',
  'auth.modalContinueHint': 'استخدم حسابك للمتابعة.',
  'auth.usernamePlaceholder': 'اسم المستخدم',
  'auth.emailPlaceholder': 'البريد الإلكتروني',
  'auth.passwordPlaceholder': 'كلمة المرور',
  'auth.createAccount': 'إنشاء حساب',
  'auth.noAccountRegister': 'ليس لديك حساب؟ سجّل الآن',
  'auth.haveAccountLogin': 'لديك حساب؟ سجّل الدخول',
  'admin.status.ready': 'جاهز',
  'admin.status.sessionExpired': 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى',
  'admin.status.loggingIn': 'جارٍ تسجيل الدخول...',
  'admin.status.readyAfterLogin': 'جاهز',
  'admin.status.loginDashboardLoadFailed': 'تم تسجيل الدخول، لكن فشل تحميل لوحة التحكم: {message}',
  'admin.status.loggedOut': 'تم تسجيل الخروج',
  'admin.status.dataReportLoadFailed': 'فشل تحميل تقارير البيانات',
  'admin.status.processingWithdrawal': 'جارٍ معالجة السحب...',
  'admin.status.withdrawalApproved': 'تمت الموافقة على السحب',
  'admin.status.withdrawalRejected': 'تم رفض السحب',
  'admin.status.processingReport': 'جارٍ معالجة البلاغ...',
  'admin.status.reportResolved': 'تم إغلاق البلاغ',
  'admin.status.reportDismissed': 'تم رفض البلاغ',
  'admin.status.invalidServiceJson': 'تنسيق JSON للخدمات غير صالح',
  'admin.status.fillWalletDelta': 'يرجى إدخال تعديل العملات أو الألماس',
  'admin.status.adjustDone': 'تم إكمال تعديل الرصيد',
  'admin.status.adjustFailed': 'فشل تعديل الرصيد',
  'admin.status.voucherIssued': 'تم إصدار القسيمة',
  'admin.status.voucherIssueFailed': 'فشل إصدار القسيمة',
  'admin.status.accountStatusUpdated': 'تم تحديث حالة الحساب',
  'admin.status.updateFailed': 'فشل التحديث',
  'admin.status.profileUpdated': 'تم تحديث الملف',
  'admin.status.operationFailed': 'فشلت العملية',
  'admin.status.runCompleted': '{label} · مكتمل',
  'admin.ops.resolveRiskEvent': 'معالجة حدث المخاطر',
  'admin.ops.updateAdminTemplate': 'تحديث قالب صلاحيات المشرف',
  'admin.ops.updateCompanionServices': 'تحديث خدمات المرافق',
  'admin.ops.filterAuditLogs': 'تصفية سجلات التدقيق',
  'admin.ops.loadMoreAudit': 'تحميل المزيد من سجلات التدقيق',
  'admin.ops.exportAuditCsv': 'تصدير تدقيق CSV',
  'admin.login.title': 'تسجيل دخول الإدارة',
  'admin.login.subtitle': 'بوابة موحدة للمصادقة والمراجعة وإدارة المخاطر والمالية والتدقيق.',
  'admin.login.emailPlaceholder': 'بريد المدير',
  'admin.login.passwordPlaceholder': 'كلمة المرور',
  'admin.login.submit': 'تسجيل الدخول',
  'admin.login.viaUserAppHint': 'سجّل الدخول بحساب المدير عبر نفس واجهة تسجيل الدخول في تطبيق المستخدم.',
  'admin.login.notAdmin': 'هذا الحساب لا يملك صلاحية الوصول إلى لوحة الإدارة.',
  'admin.shell.title': 'لوحة الإدارة',
  'admin.shell.localWorkbench': 'منصة محلية - للاختبار التشغيلي فقط',
  'admin.shell.console': 'وحدة تحكم Le3eb',
  'admin.shell.userSide': 'واجهة المستخدم',
  'admin.shell.logout': 'تسجيل الخروج',
  'admin.shell.notifications': 'الإشعارات',
  'admin.nav.dashboard': 'لوحة التحكم',
  'admin.nav.users': 'إدارة المستخدمين',
  'admin.nav.withdrawals': 'مراجعة السحب',
  'admin.nav.reports': 'مراجعة البلاغات',
  'admin.nav.data': 'تقارير البيانات',
  'admin.nav.companions': 'مراجعة المرافقين',
  'admin.nav.orders': 'إدارة الطلبات',
  'admin.nav.reviews': 'مراجعة التقييمات',
  'admin.nav.risks': 'أحداث المخاطر',
  'admin.nav.finance': 'التسوية المالية',
  'admin.nav.audit': 'سجلات التدقيق',
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
  'nav.me': 'أنا',
  'search.placeholderByIdOrName': 'ابحث بالمعرف أو الاسم',
  'search.forEpalsTitle': 'ابحث عن المرافقين',
  'search.forEpalsSubtitle': 'أدخل معرفًا أو اسمًا مستعارًا',
  'search.noResultsForQuery': 'لا توجد نتائج لـ "{query}"',
  'search.resultsHeading': 'نتائج البحث',
  'search.epalIdPrefix': 'المعرّف:',
  'community.selectTitle': 'اختر المجتمع',
  'community.tabTrending': 'رائج',
  'community.tabLatest': 'الأحدث',
  'community.feedFollowing': 'متابَعون',
  'community.follow': 'متابعة',
  'community.following': 'يتابع',
  'community.gift': 'هدية',
  'community.noPostsTitle': 'لا توجد منشورات',
  'community.noPostsFollowingHint': 'لم تتابع أحدًا بعد أو لم ينشروا محتوى.',
  'community.noPostsGenericHint': 'جرّب علامات تبويب أو أقسام أخرى.',
  'category.servicesTitle': 'الخدمات',
  'category.tabChilling': 'ترفيه',
  'category.tabFavorite': 'المفضلة',
  'category.noGamesForQuery': 'لا ألعاب لـ "{query}"',
  'category.noFavoritesYet': 'لا مفضلات بعد',
  'category.noResultsForSearch': 'لا توجد نتائج',
  'im.tabMessage': 'رسائل',
  'im.tabFriends': 'أصدقاء',
  'im.tabOrder': 'طلب',
  'im.noMutualFollowers': 'لا متابعين متبادلين',
  'im.mutualFollowerLine': 'متابعة متبادلة • {game}',
  'im.online': 'متصل',
  'im.typeMessagePlaceholder': 'اكتب رسالة...',
  'contacts.title': 'جهات الاتصال',
  'contacts.tabFriends': 'أصدقاء',
  'contacts.tabFollowing': 'متابَعون',
  'contacts.tabFollowers': 'متابعون',
  'contacts.emptyFriends': 'لا أصدقاء بعد',
  'contacts.emptyFollowing': 'لا متابعات بعد',
  'contacts.emptyFollowers': 'لا متابعين بعد',
  'contacts.mutual': 'متبادل'
};

const fr: MessageDict = {
  ...en,
  'home.search': 'Search',
  'home.trendingRealms': 'Trending Realms',
  'home.legendEPals': 'Legend ePals',
  'home.moreEPals': 'More ePals',
  'home.viewAll': 'View All',
  'home.loadingMore': 'Loading more...',
  'auth.loginRequired': 'Please log in to continue',
  'auth.loginRequiredFeature': 'Please log in before using this feature',
  'auth.loggedOut': 'Logged out',
  'auth.loggingIn': 'Logging in...',
  'auth.registering': 'Registering...',
  'auth.loggedIn': 'Logged in',
  'auth.welcomeTitle': 'Welcome',
  'auth.welcomeBody': 'You are currently not logged in. Log in to access personal center and account actions.',
  'auth.goToLogin': 'Go to Login',
  'auth.register': 'Register',
  'auth.registerPrompt': 'Create an account to continue',
  'auth.modalLogin': 'Login',
  'auth.modalRegister': 'Register',
  'auth.modalContinueHint': 'Use your account to continue.',
  'auth.usernamePlaceholder': 'username',
  'auth.emailPlaceholder': 'email',
  'auth.passwordPlaceholder': 'password',
  'auth.createAccount': 'Create account',
  'auth.noAccountRegister': 'No account? Register now',
  'auth.haveAccountLogin': 'Already have an account? Log in',
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
  'home.search': 'Search',
  'home.trendingRealms': 'Trending Realms',
  'home.legendEPals': 'Legend ePals',
  'home.moreEPals': 'More ePals',
  'home.viewAll': 'View All',
  'home.loadingMore': 'Loading more...',
  'auth.loginRequired': 'Please log in to continue',
  'auth.loginRequiredFeature': 'Please log in before using this feature',
  'auth.loggedOut': 'Logged out',
  'auth.loggingIn': 'Logging in...',
  'auth.registering': 'Registering...',
  'auth.loggedIn': 'Logged in',
  'auth.welcomeTitle': 'Welcome',
  'auth.welcomeBody': 'You are currently not logged in. Log in to access personal center and account actions.',
  'auth.goToLogin': 'Go to Login',
  'auth.register': 'Register',
  'auth.registerPrompt': 'Create an account to continue',
  'auth.modalLogin': 'Login',
  'auth.modalRegister': 'Register',
  'auth.modalContinueHint': 'Use your account to continue.',
  'auth.usernamePlaceholder': 'username',
  'auth.emailPlaceholder': 'email',
  'auth.passwordPlaceholder': 'password',
  'auth.createAccount': 'Create account',
  'auth.noAccountRegister': 'No account? Register now',
  'auth.haveAccountLogin': 'Already have an account? Log in',
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
  'home.search': 'Search',
  'home.trendingRealms': 'Trending Realms',
  'home.legendEPals': 'Legend ePals',
  'home.moreEPals': 'More ePals',
  'home.viewAll': 'View All',
  'home.loadingMore': 'Loading more...',
  'auth.loginRequired': 'Please log in to continue',
  'auth.loginRequiredFeature': 'Please log in before using this feature',
  'auth.loggedOut': 'Logged out',
  'auth.loggingIn': 'Logging in...',
  'auth.registering': 'Registering...',
  'auth.loggedIn': 'Logged in',
  'auth.welcomeTitle': 'Welcome',
  'auth.welcomeBody': 'You are currently not logged in. Log in to access personal center and account actions.',
  'auth.goToLogin': 'Go to Login',
  'auth.register': 'Register',
  'auth.registerPrompt': 'Create an account to continue',
  'auth.modalLogin': 'Login',
  'auth.modalRegister': 'Register',
  'auth.modalContinueHint': 'Use your account to continue.',
  'auth.usernamePlaceholder': 'username',
  'auth.emailPlaceholder': 'email',
  'auth.passwordPlaceholder': 'password',
  'auth.createAccount': 'Create account',
  'auth.noAccountRegister': 'No account? Register now',
  'auth.haveAccountLogin': 'Already have an account? Log in',
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
