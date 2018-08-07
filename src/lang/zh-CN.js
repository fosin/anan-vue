export default {
  route: {
    dashboard: '首页',
    system: '系统管理',
    system_permission: '权限管理',
    system_user: '用户管理',
    system_organiz: '机构管理',
    system_role: '角色管理',
    config: '配置管理',
    config_application: '分布式配置管理',
    config_parameter: '通用参数管理',
    config_dictionary: '通用字典管理',
    monitor: '监控管理',
    monitor_eureka: '服务注册中心监控',
    monitor_admin: '服务指标监控',
    monitor_sleuth: '服务链路监控',
    monitor_cache: '缓存监控',
    monitor_elk: '日志监控',
    monitor_onlineuser: '在线用户监控',
    authentication: '授权管理',
    authentication_client: '客户端授权管理',
    authentication_service: '服务授权管理'
  },
  navbar: {
    logOut: '退出登录',
    dashboard: '首页',
    github: '项目地址',
    screenfull: '全屏',
    userInfo: '用户信息',
    userSetting: '用户设置',
    systemSetting: '系统设置',
    theme: '换肤'
  },
  login: {
    title: '微服务开发云平台',
    logIn: '登录',
    rememberMe: '记住我',
    username: {
      lable: '账号',
      placeholder: '请输入账户'
    },
    password: {
      lable: '密码',
      placeholder: '密码不能为空'
    },
    role: {
      lable: '角色',
      placeholder: '请选择一个角色'
    }
  },
  documentation: {
    documentation: '文档',
    github: 'Github 地址'
  },
  permission: {
    roles: '你的权限',
    switchRoles: '切换权限'
  },
  guide: {
    description: '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  components: {
    documentation: '文档',
    tinymceTips: '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    dropzoneTips: '由于我司业务有特殊需求，而且要传七牛 所以没用第三方，选择了自己封装。代码非常的简单，具体代码你可以在这里看到 @/components/Dropzone',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2: '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  table: {
    dynamicTips1: '固定表头, 按照表头顺序排序',
    dynamicTips2: '不固定表头, 按照点击顺序排序',
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    importance: '重要性',
    type: '类型',
    remark: '点评',
    search: '搜索',
    add: '新增',
    export: '导出',
    reviewer: '审核人',
    id: '序号',
    date: '时间',
    author: '作者',
    readings: '阅读数',
    status: '状态',
    actions: '操作',
    edit: '编辑',
    publish: '发布',
    draft: '草稿',
    delete: '删除',
    cancel: '取 消',
    confirm: '确 定',
    create: '创建',
    update: '更新',
    resetPass: '重置密码',
    reset: '重置',
    permission: '权限',
    role: '角色',
    user: '用户',
    refresh: '刷新',
    applys: '应用更改',
    apply: '应用当前'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  zip: {
    export: '导出',
    placeholder: '请输入文件名(默认file)'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  lang: {
    switchSuccess: '切换默认语言成功'
  }
}
