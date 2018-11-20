export default {
  route: {
    dashboard: 'Dashboard',
    system: 'System Manage',
    system_permission: 'Permission Manage',
    system_user: 'User Manage',
    system_organiz: 'Organization Manage',
    system_role: 'Role Manage',
    system_swaggerDevDoc: 'Dev Domcument',
    config: 'Config',
    config_application: 'App Config',
    config_parameter: 'Parameter Config',
    config_dictionary: 'Dictionary Config',
    monitor: 'Monitor',
    monitor_eureka: 'Eureka Monitor',
    monitor_admin: 'Admin Monitor',
    monitor_sleuth: 'Sleuth Monitor',
    monitor_cache: 'Cache Manager',
    monitor_elk: 'Log Manager',
    monitor_onlineuser: 'OnlineUser Monitor',
    monitor_database: 'Database Pool',
    monitor_circuitbreaker: 'Circuit Breaker',
    authentication: 'Authentication',
    authentication_client: 'Client Authentication',
    authentication_service: 'Service Authentication',
    userInfo: 'Modify Info',
    mpi_manager_patientinfo: 'Patient Info Manager',
    mpi_manager: 'MPI Manager',
    mpi_manager_revert: 'Patient Info Revert',
    mpi_manager_merge: 'Patient Info Merge',
    mpi_manager_overview: 'Patient Info Overview',
    mpi_manager_house: 'Patient Health House Info'
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
    langSelect: 'Lang Select'
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
