export default {
  route: {
    Dashboard: '首页',
    System: '系统管理',
    SystemUser: '用户管理',
    SystemOrganiz: '机构管理',
    SystemRole: '角色管理',
    Development: '开发管理',
    DevelopmentPermission: '权限管理',
    DevelopmentSwaggerDoc: '开发文档',
    DevelopmentVersion: '版本管理',
    DevelopmentVersionRole: '版本角色管理',
    DevelopmentAuthClient: '客户端授权管理',
    Config: '配置管理',
    ConfigNacos: 'Nacos配置管理',
    ConfigParameter: '通用参数管理',
    ConfigDictionary: '通用字典管理',
    Monitor: '监控管理',
    MonitorEureka: 'Eureka服务注册中心',
    MonitorAdmin: 'SBA服务指标监控',
    MonitorZipkin: 'Zipkin链路监控',
    MonitorRedis: 'Redis缓存监控',
    MonitorKibana: 'Kibana日志监控',
    MonitorOnlineuser: '在线用户监控',
    MonitorDruid: 'Druid数据库连接池监控',
    MonitorCircuitbreaker: '断路器监控',
    MonitorGrafana: 'Grafana监控',
    MonitorRabbitmq: 'RabbitMQ管理监控',
    MonitorKubernetes: 'K8S原生仪表盘',
    UserInfo: '修改信息',
    MpiManagerPatientinfo: '患者信息管理',
    MpiManager: '患者主索引管理',
    MpiManagerRevert: '患者信息恢复',
    MpiManagerMerge: '患者信息合并',
    MpiManagerOverview: '患者地域分布',
    MpiManagerHouse: '健康住宅目的地概览',
    VhrEmployee: '员工资料',
    VhrPersonnel: '人事管理',
    VhrSalary: '薪资管理',
    VhrStatistics: '统计管理',
    VhrSystem: '系统管理',
    VhrEmployeeBasic: '基本资料',
    VhrEmployeeAdvanced: '高级资料',
    VhrPersonnelEmployee: '员工资料',
    VhrPersonnelEc: '员工奖惩',
    VhrPersonnelTrain: '员工培训',
    VhrPersonnelSalary: '员工调薪',
    VhrPersonnelMove: '员工调动',
    VhrSalarySob: '工资账套管理',
    VhrSalarySobcfg: '员工账套设置',
    VhrSalaryTable: '工资表管理',
    VhrSalaryMonth: '月末处理',
    VhrSalarySearch: '工资表查询',
    VhrStatisticsAll: '综合信息统计',
    VhrStatisticsScore: '员工积分统计',
    VhrStatisticsPers: '人事信息统计',
    VhrStatisticsRecord: '人事记录统计',
    VhrSystemBasic: '基础信息设置',
    VhrSystemCfg: '系统管理',
    VhrSystemLog: '操作日志管理',
    VhrSystemHr: '操作员管理',
    VhrSystemData: '备份恢复数据库',
    VhrSystemInit: '初始化数据库'
  },
  navbar: {
    logOut: '退出登录',
    dashboard: '首页',
    github: '项目地址',
    screenfull: '全屏',
    userInfo: '修改信息',
    userSetting: '设置',
    systemSetting: '系统设置',
    theme: '换肤',
    size: '布局大小',
    langSelect: '选择语言',
    search: '搜索菜单'
  },
  login: {
    title: '微服务云平台',
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
    view: '查看',
    create: '创建',
    update: '更新',
    resetPass: '重置密码',
    reset: '重置',
    permission: '权限',
    role: '角色',
    user: '用户',
    refresh: '刷新',
    applys: '发布所有',
    apply: '发布单条',
    logout: '注销',
    loss: '挂失',
    revert: '还原',
    merge: '合并'
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
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  lang: {
    switchSuccess: '切换默认语言成功'
  },
  size: {
    switchSuccess: '切换布局成功'
  }
}
