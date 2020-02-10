export default {
  route: {
    Dashboard: '首頁',
    System: '系統管理',
    SystemUser: '用戶管理',
    SystemOrganiz: '機构管理',
    SystemRole: '角色管理',
    Development: '開發管理',
    DevelopmentPermission: '許可權管理',
    DevelopmentSwaggerDoc: '開發檔案',
    DevelopmentVersion: '版本管理',
    DevelopmentVersionRole: '版本角色管理',
    DevelopmentAuthClient: '用戶端授權管理',
    Config: '配置管理',
    ConfigNacos: 'Nacos配置管理',
    ConfigParameter: '通用參數管理',
    ConfigDictionary: '通用字典管理',
    Monitor: '監控管理',
    MonitorEureka: 'Eureka服務注册中心',
    MonitorAdmin: 'SBA服務名額監控',
    MonitorZipkin: 'Zipkin連結監控',
    MonitorRedis: 'Redis緩存監控',
    MonitorKibana: 'Kibana日誌監控',
    MonitorOnlineuser: '線上用戶監控',
    MonitorDruid: 'Druid資料庫連接池監控',
    MonitorCircuitbreaker: '斷路器監控',
    MonitorDocker: 'Docker容器監控',
    MonitorRabbitmq: 'RabbitMQ管理監控',
    MonitorKubernetes: 'K8S原生儀錶盤',
    MonitorKubeboard: 'KubeBoard管理监控',
    UserInfo: '修改資訊',
    MpiManagerPatientinfo: '患者資訊管理',
    MpiManager: '患者主索引管理',
    MpiManagerRevert: '患者資訊恢復',
    MpiManagerMerge: '患者資訊合併',
    MpiManagerOverview: '患者地域分佈',
    MpiManagerHouse: '健康住宅目的地概覽',
    VhrEmployee: '員工資料',
    VhrPersonnel: '人事管理',
    VhrSalary: '薪資管理',
    VhrStatistics: '統計管理',
    VhrSystem: '系統管理',
    VhrEmployeeBasic: '基本資料',
    VhrEmployeeAdvanced: '高級資料',
    VhrPersonnelEmployee: '員工資料',
    VhrPersonnelEc: '員工獎懲',
    VhrPersonnelTrain: '員工培訓',
    VhrPersonnelSalary: '員工調薪',
    VhrPersonnelMove: '員工調動',
    VhrSalarySob: '薪水賬套管理',
    VhrSalarySobcfg: '員工賬套設定',
    VhrSalaryTable: '工資表管理',
    VhrSalaryMonth: '月末處理',
    VhrSalarySearch: '工資表査詢',
    VhrStatisticsAll: '綜合資訊統計',
    VhrStatisticsScore: '員工積分統計',
    VhrStatisticsPers: '人事資訊統計',
    VhrStatisticsRecord: '人事記錄統計',
    VhrSystemBasic: '基礎資訊設定',
    VhrSystemCfg: '系統管理',
    VhrSystemLog: '操作日誌管理',
    VhrSystemHr: '操作員管理',
    VhrSystemData: '備份恢復資料庫',
    VhrSystemInit: '初始化資料庫'
  },
  navbar: {
    logOut: '登出',
    dashboard: '首頁',
    github: '項目地址',
    screenfull: '全屏',
    userInfo: '修改資訊',
    userSetting: '設定',
    systemSetting: '系統設置',
    theme: '換膚',
    size: '佈局大小',
    langSelect: '選擇語言',
    search: '檢索選單'
  },
  login: {
    title: '微服務雲平臺',
    logIn: '登入',
    rememberMe: '記住我',
    username: {
      lable: '帳號',
      placeholder: '請輸入帳戶'
    },
    password: {
      lable: '密碼',
      placeholder: '密碼不能為空'
    },
    role: {
      lable: '角色',
      placeholder: '請選擇一個角色'
    }
  },
  documentation: {
    documentation: '檔案',
    github: 'Github地址'
  },
  permission: {
    roles: '你的許可權',
    switchRoles: '切換許可權'
  },
  guide: {
    description: '引導頁對於一些第一次進入項目的人很有用,你可以簡單介紹下項目的功能。本Demo是基於',
    button: '打開引導'
  },
  components: {
    documentation: '檔案',
    tinymceTips: '富文字是管理後臺一個覈心的功能,但同時又是一個有很多坑的地方。在選擇富文字的過程中我也走了不少的彎路,市面上常見的富文字都基本用過了,最終權衡了一下選擇了Tinymce。更詳細的富文字比較和介紹見',
    dropzoneTips: '由於我司業務有特殊需求,而且要傳七牛所以沒用協力廠商,選擇了自己封裝。程式碼非常的簡單,具體程式碼你可以在這裡看到@/components/Dropzone',
    stickyTips: '當頁面滾動到預設的位置會吸附在頂部',
    backToTopTips1: '頁面滾動到指定位置會在右下角出現返回頂部按鈕',
    backToTopTips2: '可自定義按鈕的樣式、show/hide、出現的高度、返回的位置如需文字提示,可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由於我在使用時它只有vue@1版本,而且和mockjs不相容,所以自己改造了一下,如果大家要使用的話,優先還是使用官方版本。'
  },
  table: {
    dynamicTips1: '固定表頭,按照表頭順序排序',
    dynamicTips2: '不固定表頭,按照點擊順序排序',
    dragTips1: '默認順序',
    dragTips2: '拖拽後順序',
    title: '標題',
    importance: '重要性',
    type: '類型',
    remark: '點評',
    search: '蒐索',
    add: '新增',
    export: '匯出',
    reviewer: '稽核人',
    id: '序號',
    date: '時間',
    author: '作者',
    readings: '閱讀數',
    status: '狀態',
    actions: '操作',
    edit: '編輯',
    publish: '發佈',
    draft: '草稿',
    delete: '删除',
    cancel: '取消',
    confirm: '確定',
    view: '查看',
    create: '創建',
    update: '更新',
    resetPass: '重置密碼',
    reset: '重置',
    permission: '許可權',
    role: '角色',
    user: '用戶',
    refresh: '重繪',
    applys: '發佈所有',
    apply: '發佈單條',
    logout: '註銷',
    loss: '掛失',
    revert: '還原',
    merge: '合併'
  },
  errorLog: {
    tips: '請點擊右上角bug小圖標',
    description: '現在的管理後臺基本都是spa的形式了,它增强了用戶體驗,但同時也會新增頁面出問題的可能性,可能一個小小的疏忽就導致整個頁面的鎖死。好在Vue官網提供了一個方法來捕獲處理异常,你可以在其中進行錯誤處理或者异常上報。',
    documentation: '檔案介紹'
  },
  excel: {
    export: '匯出',
    selectedExport: '匯出已選擇項',
    placeholder: '請輸入檔名（默認excel-list）'
  },
  zip: {
    export: '匯出',
    placeholder: '請輸入檔名（默認'
  },
  theme: {
    change: '換膚',
    documentation: '換膚檔案',
    tips: 'Tips:它區別於navbar上的theme-pick,是兩種不同的換膚方法,各自有不同的應用場景,具體請參攷檔案。'
  },
  tagsView: {
    refresh: '重繪',
    close: '關閉',
    closeOthers: '關閉其它',
    closeAll: '關閉所有'
  },
  lang: {
    switchSuccess: '切換默認語言成功'
  },
  size: {
    switchSuccess: '切換佈局成功'
  }
}
