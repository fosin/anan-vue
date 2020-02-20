export default {
  route: {
    Dashboard: 'Dashboard',
    System: 'System Manage',
    SystemUser: 'User Manage',
    SystemOrganiz: 'Organization Manage',
    SystemRole: 'Role Manage',
    Development: 'Development Manager',
    DevelopmentPermission: 'Permission Manage',
    DevelopmentSwaggerDoc: 'Dev Domcument',
    DevelopmentVersion: 'Version Manage',
    DevelopmentVersionRole: 'Version Role Manage',
    DevelopmentAuthClient: 'Client Authentication',
    Config: 'Config',
    ConfigNacos: 'Nacos Config',
    ConfigParameter: 'Parameter Config',
    ConfigDictionary: 'Dictionary Config',
    Monitor: 'Monitor',
    MonitorEureka: 'Eureka',
    MonitorAdmin: 'SpringBootAdmin',
    MonitorZipkin: 'Zipkin',
    MonitorRedisAdmin: 'PhpRedisAdmin',
    MonitorElasticHD: 'ElasticHD',
    MonitorPromethus: 'Promethus',
    MonitorKibana: 'Kibana',
    MonitorOnlineuser: 'OnlineUser Monitor',
    MonitorDruid: 'Druid',
    MonitorCircuitbreaker: 'Circuit Breaker',
    MonitorGrafana: 'Grafana Monitor',
    MonitorRabbitmq: 'RabbitMQ Monitor',
    MonitorKubernetes: 'Kubernetes Dashboard',
    MonitorKubeboard: 'KubeBoard',
    UserInfo: 'Modify Info',
    MpiManagerPatientinfo: 'Patient Info Manager',
    MpiManager: 'MPI Manager',
    MpiManagerRevert: 'Patient Info Revert',
    MpiManagerMerge: 'Patient Info Merge',
    MpiManagerOverview: 'Patient Info Overview',
    MpiManagerHouse: 'Patient Health House Info',
    VhrEmployee: 'Employee Data',
    VhrPersonnel: 'Personnel Manager',
    VhrSalary: 'Salary Manager',
    VhrStatistics: 'Statistics Manager',
    VhrSystem: 'System Manager',
    VhrEmployeeBasic: 'Basic Data',
    VhrEmployeeAdvanced: 'Advanced Data',
    VhrPersonnelEmployee: 'Personnel Data',
    VhrPersonnelEc: 'Personnel Ec',
    VhrPersonnelTrain: 'Personnel Train',
    VhrPersonnelSalary: 'Personnel Salary',
    VhrPersonnelMove: 'Personnel Move',
    VhrSalarySob: 'Salary Sob Manager',
    VhrSalarySobcfg: 'Salary Account Cfg',
    VhrSalaryTable: 'SalaryTable Manager',
    VhrSalaryMonth: 'Salary Month',
    VhrSalarySearch: 'Salary Search',
    VhrStatisticsAll: 'Statistics All',
    VhrStatisticsScore: 'Statistics Score',
    VhrStatisticsPers: 'Statistics Pers',
    VhrStatisticsRecord: 'Statistics Record',
    VhrSystemBasic: 'System Setting',
    VhrSystemCfg: 'System Cfg',
    VhrSystemLog: 'Log Manager',
    VhrSystemHr: 'Operater Manager',
    VhrSystemData: 'Backup Data',
    VhrSystemInit: 'System Init'
  },
  navbar: {
    logOut: 'Logout',
    dashboard: 'Dashboard',
    github: 'Github',
    userInfo: 'Modify Info',
    userSetting: 'Setting',
    systemSetting: 'System Setting',
    screenfull: 'Screenfull',
    theme: 'Theme',
    size: 'Global Size',
    langSelect: 'Lang Select',
    search: 'Search Menu'
  },
  login: {
    title: 'Cloud Dev Platform',
    logIn: 'Login',
    rememberMe: 'Remember Me',
    username: {
      lable: 'Username',
      placeholder: 'Please input username'
    },
    password: {
      lable: 'Password',
      placeholder: 'Please input password'
    },
    role: {
      lable: 'Role',
      placeholder: 'Please select a role'
    }
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    roles: 'Your roles',
    switchRoles: 'Switch roles'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  components: {
    documentation: 'Documentation',
    tinymceTips: 'Rich text editor is a core part of management system, but at the same time is a place with lots of problems. In the process of selecting rich texts, I also walked a lot of detours. The common rich text editors in the market are basically used, and the finally chose Tinymce. See documentation for more detailed rich text editor comparisons and introductions.',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Imp',
    type: 'Type',
    remark: 'Remark',
    search: 'Search',
    add: 'Add',
    export: 'Export',
    reviewer: 'reviewer',
    id: 'ID',
    date: 'Date',
    author: 'Author',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    view: 'View',
    create: 'Create',
    update: 'Update',
    resetPass: 'ResetPass',
    reset: 'Reset',
    permission: 'Permission',
    role: 'Role',
    user: 'User',
    refresh: 'Refresh',
    applys: 'Apply All',
    apply: 'Apply Single',
    logout: 'Logout',
    loss: 'Report Loss',
    revert: 'Revert',
    merge: 'Merge'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export selected items',
    placeholder: 'Please enter the file name(default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name(default file)'
  },
  theme: {
    change: 'Theme change',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  lang: {
    switchSuccess: 'Switch Language Success'
  },
  size: {
    switchSuccess: 'Switch Size Success'
  }
}
