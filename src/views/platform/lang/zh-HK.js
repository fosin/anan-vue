export default{
  cdp_sys_dictionary: {
    searchText: '支持名稱、類別及標識查找',
    code: {
      label: '字典程式碼',
      placeholder: '字典程式碼'
    },
    name: {
      label: '字典名稱',
      placeholder: '字典名稱'
    },
    type: {
      label: '字典類別',
      placeholder: '字典類別,區別字典的大分類,取值於字典錶 = 1數據'
    },
    scope: {
      label: '字典作用域',
      placeholder: '字典作用域,以字典類別為前提,在字典類別基礎上再次細化分類字典'
    }
  },
  cdp_sys_dictionary_detail: {
    searchText: '支持字典明細項程式碼、字典明細項值查找',
    id: {
      label: '字典明細編號',
      placeholder: '字典明細編號'
    },
    name: {
      label: '字典明細鍵',
      placeholder: '字典明細鍵,不能重複,字典內明細項唯一程式碼'
    },
    value: {
      label: '字典明細值',
      placeholder: '字典明細值表示字面意義'
    },
    code: {
      label: '字典程式碼',
      placeholder: '取值於字典錶的字典程式碼'
    },
    sort: {
      label: '順序',
      placeholder: '順序,用於顯示數據時的順序,數值越小越靠前'
    },
    status: {
      label: '狀態',
      placeholder: '狀態：0=啟用,1=禁用,具體取值於字典錶的字典程式碼=11'
    },
    scode: {
      label: '標準程式碼',
      placeholder: '標準程式碼,該欄位通常用於對接標準字典'
    },
    scope: {
      label: '作用域,用於字典明細項的作用域',
      placeholder: '作用域,用於字典明細項的作用域'
    },
    used: {
      label: '使用標誌',
      placeholder: '使用標誌：0=未使用,1=已使用,已使用的字典就不能再修改name内容'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    createTime: {
      label: '創建日期',
      placeholder: '創建日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    updateBy: {
      label: '更新人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    updateTime: {
      label: '更新日期',
      placeholder: '更新日期,該值由後臺維護,更改數據時前端不需要關心'
    }
  },
  cdp_sys_organization: {
    id: {
      label: '機构編號',
      placeholder: '機构編號'
    },
    pId: {
      label: '父機构編碼',
      placeholder: '父機构編碼,取值於id,表示當前數據所屬的父類機构'
    },
    topId: {
      label: '頂級機构編碼',
      placeholder: '頂級機构編碼：一般指用戶註冊的機构,通常是一個集團組的最高級別機构,取值於id'
    },
    code: {
      label: '機构編碼',
      placeholder: '機构編碼,自定義機构編碼,下級機构必須以上級機构編碼為首碼'
    },
    name: {
      label: '機構名稱',
      placeholder: '機構名稱'
    },
    level: {
      label: '深度',
      placeholder: '深度'
    },
    fullname: {
      label: '機构全名',
      placeholder: '機构全名'
    },
    address: {
      label: '機构地址',
      placeholder: '機构地址'
    },
    telphone: {
      label: '機构電話',
      placeholder: '機构電話'
    },
    status: {
      label: '狀態',
      placeholder: '狀態：0=啟用,1=禁用,具體取值於字典錶的字典程式碼=11的字典'
    },
    createTime: {
      label: '創建日期',
      placeholder: '創建日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    updateTime: {
      label: '更新日期',
      placeholder: '更新日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    updateBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    }
  },
  cdp_sys_organization_auth: {
    id: {
      label: '機构授權編號',
      placeholder: '機构授權編號'
    },
    organizId: {
      label: '機构編號',
      placeholder: '機构編號'
    },
    versionId: {
      label: '版本編號',
      placeholder: '版本編號'
    },
    orderId: {
      label: '訂單編號',
      placeholder: '訂單編號'
    },
    authorizationCode: {
      label: '授權碼',
      placeholder: '授權碼'
    },
    createTime: {
      label: '創建日期',
      placeholder: '創建日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    validity: {
      label: '有效期',
      placeholder: '有效期：一般按天計算'
    },
    protectDays: {
      label: '保護期',
      placeholder: '到期後保護期'
    },
    maxOrganizs: {
      label: '最大機构數',
      placeholder: '最大機构數：0=無限制n=限制數'
    },
    maxUsers: {
      label: '最大機构數',
      placeholder: '最大機构數：0=無限制n=限制數'
    },
    tryout: {
      label: '是否試用',
      placeholder: '是否試用：0=不試用1=試用'
    },
    tryoutDays: {
      label: '試用天數',
      placeholder: '試用天數'
    }
  },
  cdp_sys_organization_permission: {
    id: {
      label: '機构許可權編號',
      placeholder: '機构許可權編號'
    },
    organizId: {
      label: '機构編號',
      placeholder: '機构編號'
    },
    permissionId: {
      label: '許可權編號',
      placeholder: '許可權編號'
    },
    createTime: {
      label: '創建時間',
      placeholder: '創建時間'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    }
  },
  cdp_sys_parameter: {
    searchText: '支持參數鍵、參數值、說明查找',
    id: {
      label: '參數編號',
      placeholder: '參數編號'
    },
    name: {
      label: '參數鍵',
      placeholder: '參數鍵'
    },
    value: {
      label: '參數值',
      placeholder: '參數值'
    },
    type: {
      label: '參數分類',
      placeholder: '參數分類：具體取值於字典錶的字典程式碼=10'
    },
    scope: {
      label: '作用域',
      placeholder: '參數作用域'
    },
    defaultValue: {
      label: '預設值',
      placeholder: '預設值'
    },
    description: {
      label: '參數描述',
      placeholder: '參數描述'
    },
    createTime: {
      label: '創建日期',
      placeholder: '創建日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    updateTime: {
      label: '更新日期',
      placeholder: '更新日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    updateBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    applyTime: {
      label: '生效日期',
      placeholder: '生效日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    applyBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    status: {
      label: '參數狀態',
      placeholder: '參數狀態：0=正常狀態、1=修改狀態、2=删除狀態'
    }
  },
  cdp_sys_pay: {
    payId: {
      label: '支付編號',
      placeholder: '支付編號'
    },
    organizId: {
      label: '付款機构',
      placeholder: '付款機构'
    },
    userId: {
      label: '付款用戶',
      placeholder: '付款用戶'
    },
    orderId: {
      label: '訂單編號',
      placeholder: '訂單編號'
    },
    invoiceId: {
      label: '發票編號',
      placeholder: '發票編號'
    },
    payType: {
      label: '交易類型',
      placeholder: '交易類型：0=正交易1：負交易'
    },
    totalMoney: {
      label: '應收金額',
      placeholder: '應收金額'
    },
    payMoney: {
      label: '支付金額',
      placeholder: '支付金額'
    },
    discountMonery: {
      label: '優惠金額',
      placeholder: '優惠金額'
    },
    uncollectMoney: {
      label: '待收金額',
      placeholder: '待收金額'
    },
    payTime: {
      label: '付款日期',
      placeholder: '付款日期'
    },
    payFlag: {
      label: '付款標誌',
      placeholder: '付款標誌：0=未付款,1=分期,2=付全款'
    }
  },
  cdp_sys_pay_detail: {
    paydetailId: {
      label: '付款明細編號',
      placeholder: '付款明細編號'
    },
    payId: {
      label: '支付編號',
      placeholder: '支付編號'
    },
    payway: {
      label: '付款方式',
      placeholder: '付款方式'
    },
    money: {
      label: '付款金額',
      placeholder: '付款金額'
    }
  },
  cdp_sys_pay_invoice: {
    invoceId: {
      label: '發票編號',
      placeholder: '發票編號'
    },
    payId: {
      label: '支付編號',
      placeholder: '支付編號'
    },
    invoceNo: {
      label: '發票號碼',
      placeholder: '發票號碼'
    },
    invoceTime: {
      label: '出票時間',
      placeholder: '出票時間'
    },
    crreateBy: {
      label: '操作人',
      placeholder: '操作人'
    }
  },
  cdp_sys_pay_order: {
    orderId: {
      label: '訂單編號',
      placeholder: '訂單編號'
    },
    organizId: {
      label: '訂單機构',
      placeholder: '訂單機构'
    },
    userId: {
      label: '訂單用戶',
      placeholder: '訂單用戶'
    },
    versionId: {
      label: '版本編號',
      placeholder: '版本編號'
    },
    money: {
      label: '版本金額',
      placeholder: '版本金額'
    },
    orderTime: {
      label: '訂單日期',
      placeholder: '訂單日期'
    },
    status: {
      label: '訂單狀態',
      placeholder: '訂單狀態：0=新建,1=支付,2=取消,3=作廢'
    },
    payTime: {
      label: '支付日期',
      placeholder: '支付日期'
    },
    cancleTime: {
      label: '取消日期',
      placeholder: '取消日期'
    },
    invalidTime: {
      label: '作廢日期',
      placeholder: '作廢日期'
    }
  },
  cdp_sys_permission: {
    id: {
      label: '許可權編號',
      placeholder: '許可權編號'
    },
    code: {
      label: '許可權編碼',
      placeholder: '許可權編碼,不能重複不能為空'
    },
    pId: {
      label: '父權限編號',
      placeholder: '父權限編號,取值於id,表示當前數據的父類許可權'
    },
    name: {
      label: '許可權名稱',
      placeholder: '許可權名稱'
    },
    url: {
      label: '資源地址',
      placeholder: '資源地址：該欄位必須和type欄位共同使用,詳情請看type欄位'
    },
    type: {
      label: '許可權類型',
      placeholder: '許可權類型：0=按鈕、1=組件選單,對應ur是前端組件l、2=連結選單,對應url是http（s）連結位址、3=目錄選單,對應是目錄選單,具體取值於字典錶的字典程式碼=13,當許可權類型是1：組件選單3：目錄選單時表示該節點不是一個葉子節點'
    },
    level: {
      label: '選單層級',
      placeholder: '選單層級'
    },
    sort: {
      label: '排序',
      placeholder: '排序,用於顯示數據時的順序,數值越小越靠前'
    },
    status: {
      label: '狀態',
      placeholder: '狀態：0=啟用,1=禁用,具體取值於字典錶的字典程式碼=11的字典'
    },
    appName: {
      label: '所屬應用名稱',
      placeholder: '所屬應用名稱,等同於設定檔中的spring.application.name'
    },
    path: {
      label: '許可權地址',
      placeholder: '後臺請求許可權地址,許可權路徑ant風格運算式,用於動態驗證HTTP後臺請求的許可權標識'
    },
    method: {
      label: '請求方法',
      placeholder: 'http請求方法：GET、POST、DELETE、OPTIONS、PUT、PATCH,具體取值於字典錶的字典程式碼=12'
    },
    icon: {
      label: '圖標',
      placeholder: '圖標：一般用於前端選單選項前的ICON圖標'
    },
    createTime: {
      label: '創建日期',
      placeholder: '創建日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    updateTime: {
      label: '更新日期',
      placeholder: '更新日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    updateBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    }
  },
  cdp_sys_role: {
    searchText: '支持角色名稱、角色標識',
    id: {
      label: '角色編號',
      placeholder: '角色編號'
    },
    organizId: {
      label: '機构編號',
      placeholder: '機构編號'
    },
    name: {
      label: '角色名稱',
      placeholder: '角色名稱'
    },
    value: {
      label: '角色標識',
      placeholder: '角色標識'
    },
    tips: {
      label: '角色說明',
      placeholder: '角色說明'
    },
    status: {
      label: '狀態',
      placeholder: '狀態：0=啟用,1=禁用,具體取值於字典錶的字典程式碼=11的字典'
    },
    createTime: {
      label: '創建時間',
      placeholder: '創建時間'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    updateTime: {
      label: '更新時間',
      placeholder: '更新時間'
    },
    updateBy: {
      label: '更新人',
      placeholder: '更新人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    builtIn: {
      label: '內寘標誌',
      placeholder: '內寘標誌：是否是系統內寘角色,內寘角色不能被用戶删除和修改,0=不是1=是'
    }
  },
  cdp_sys_role_permission: {
    id: {
      label: '角色許可權編號',
      placeholder: '角色許可權編號'
    },
    roleId: {
      label: '角色編號',
      placeholder: '角色編號'
    },
    permissionId: {
      label: '許可權編號',
      placeholder: '許可權編號'
    },
    createTime: {
      label: '創建時間',
      placeholder: '創建時間'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    }
  },
  cdp_sys_user: {
    searchText: '支持用戶工號、名稱、手機號、郵箱查找',
    baseInfo: '基本資訊',
    modifyPassword: '修改密碼',
    oldPassword: {
      label: '當前密碼',
      placeholder: '請輸入用戶當前密碼'
    },
    confirmPassword1: {
      label: '新密碼',
      placeholder: '請輸入用戶新密碼'
    },
    confirmPassword2: {
      label: '確認新密碼',
      placeholder: '請再次輸入用戶新密碼'
    },
    id: {
      label: '用戶編號',
      placeholder: '用戶編號'
    },
    organizId: {
      label: '機构編號',
      placeholder: '機构編號'
    },
    usercode: {
      label: '用戶工號',
      placeholder: '用戶工號'
    },
    username: {
      label: '用戶姓名',
      placeholder: '用戶姓名'
    },
    password: {
      label: '用戶密碼',
      placeholder: '用戶密碼：傳入原始密碼,後臺會對原始密碼進行加密後再存儲'
    },
    birthday: {
      label: '生日',
      placeholder: '生日'
    },
    sex: {
      label: '性別',
      placeholder: '性別：具體取值於字典錶的字典程式碼=15'
    },
    email: {
      label: '電子郵箱',
      placeholder: '電子郵箱'
    },
    phone: {
      label: '手機號碼',
      placeholder: '手機號碼'
    },
    status: {
      label: '狀態',
      placeholder: '狀態：0=啟用,1=禁用,具體取值於字典錶的字典程式碼=11的字典'
    },
    avatar: {
      label: '頭像',
      placeholder: '頭像'
    },
    createTime: {
      label: '創建日期',
      placeholder: '創建日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    updateTime: {
      label: '更新日期',
      placeholder: '更新日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    updateBy: {
      label: '更新人',
      placeholder: '更新人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    expireTime: {
      label: '過期時間',
      placeholder: '過期時間,帳戶過期後用戶被鎖定切不能登入系統'
    }
  },
  cdp_sys_user_permission: {
    id: {
      label: '用戶許可權編號',
      placeholder: '用戶許可權編號'
    },
    organizId: {
      label: '機构編號',
      placeholder: '機构編號'
    },
    userId: {
      label: '用戶編號',
      placeholder: '用戶編號'
    },
    permissionId: {
      label: '許可權編號',
      placeholder: '許可權編號'
    },
    createTime: {
      label: '創建日期',
      placeholder: '創建日期'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    addMode: {
      label: '補充管道',
      placeholder: '補充管道：0=新增許可權、1=删除許可權'
    }
  },
  cdp_sys_user_role: {
    id: {
      label: '用戶角色編號',
      placeholder: '用戶角色編號'
    },
    organizId: {
      label: '機构編號',
      placeholder: '機构編號'
    },
    userId: {
      label: '用戶編號',
      placeholder: '用戶編號'
    },
    roleId: {
      label: '角色編號',
      placeholder: '角色編號'
    },
    createTime: {
      label: '創建日期',
      placeholder: '創建日期,該值由後臺維護,更改數據時前端不需要關心'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    }
  },
  cdp_sys_version: {
    searchText: '支持版本名稱查找',
    id: {
      label: '版本編號',
      placeholder: '版本編號'
    },
    name: {
      label: '版本名稱',
      placeholder: '版本名稱'
    },
    type: {
      label: '版本類型',
      placeholder: '版本類型：0=收費版1=免費版2=開發版'
    },
    price: {
      label: '版本價格',
      placeholder: '版本價格'
    },
    beginTime: {
      label: '活動開始日期',
      placeholder: '活動開始日期'
    },
    endTime: {
      label: '活動結束日期',
      placeholder: '活動結束日期'
    },
    validity: {
      label: '有效期',
      placeholder: '有效期：一般按天計算'
    },
    protectDays: {
      label: '保護期',
      placeholder: '到期後保護期'
    },
    maxOrganizs: {
      label: '最大機构數',
      placeholder: '最大機构數：0=無限制n=限制數'
    },
    maxUsers: {
      label: '最大用戶數',
      placeholder: '最大用戶數：0=無限制n=限制數'
    },
    tryout: {
      label: '是否試用',
      placeholder: '是否試用：0=不試用1=試用'
    },
    tryoutDays: {
      label: '試用天數',
      placeholder: '試用天數'
    },
    createTime: {
      label: '創建日期',
      placeholder: '創建日期'
    },
    status: {
      label: '啟用狀態',
      placeholder: '啟用狀態：0=啟用,1=禁用'
    },
    description: {
      label: '版本描述',
      placeholder: '版本描述'
    }
  },
  cdp_sys_version_permission: {
    id: {
      label: '版本許可權編號',
      placeholder: '版本許可權編號'
    },
    versionId: {
      label: '版本編號',
      placeholder: '版本編號'
    },
    permissionId: {
      label: '許可權編號',
      placeholder: '許可權編號'
    },
    createTime: {
      label: '創建時間',
      placeholder: '創建時間'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    }
  },
  cdp_sys_version_role: {
    searchText: '支持版本角色名稱、角色標識',
    id: {
      label: '角色編號',
      placeholder: '角色編號'
    },
    versionId: {
      label: '版本編號',
      placeholder: '版本編號'
    },
    name: {
      label: '角色名稱',
      placeholder: '角色名稱'
    },
    value: {
      label: '角色標識',
      placeholder: '角色標識'
    },
    tips: {
      label: '角色說明',
      placeholder: '角色說明'
    },
    status: {
      label: '狀態',
      placeholder: '狀態：0=啟用,1=禁用,具體取值於字典錶的字典程式碼=11的字典'
    },
    createTime: {
      label: '創建時間',
      placeholder: '創建時間'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    },
    updateTime: {
      label: '更新時間',
      placeholder: '更新時間'
    },
    updateBy: {
      label: '更新人',
      placeholder: '更新人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    }
  },
  cdp_sys_version_role_permission: {
    id: {
      label: '角色許可權編號',
      placeholder: '角色許可權編號'
    },
    roleId: {
      label: '角色編號',
      placeholder: '角色編號'
    },
    permissionId: {
      label: '許可權編號',
      placeholder: '許可權編號'
    },
    createTime: {
      label: '創建時間',
      placeholder: '創建時間'
    },
    createBy: {
      label: '創建人',
      placeholder: '創建人：該值由後臺維護,更改數據時前端不需要關心,取值於系統用戶錶的編號'
    }
  },
  oauth_client_details: {
    searchText: '支持標識、金鑰查找',
    clientId: {
      label: '用戶端編號',
      placeholder: '用戶端編號'
    },
    resourceIds: {
      label: '資源資訊',
      placeholder: '資源資訊'
    },
    clientSecret: {
      label: '用戶端金鑰',
      placeholder: '用戶端金鑰'
    },
    scope: {
      label: '作用域',
      placeholder: '作用域'
    },
    authorizedGrantTypes: {
      label: '授權類型',
      placeholder: '授權類型'
    },
    webServerRedirectUri: {
      label: '重定向地址',
      placeholder: '重定向地址'
    },
    authorities: {
      label: '授權明細',
      placeholder: '授權明細'
    },
    accessTokenValidity: {
      label: '權杖效期',
      placeholder: '權杖效期：組織是秒'
    },
    refreshTokenValidity: {
      label: '重繪權杖期效',
      placeholder: '重繪權杖期效,組織是秒'
    },
    additionalInformation: {
      label: '附加資訊',
      placeholder: '附加資訊'
    },
    autoapprove: {
      label: '自動授權',
      placeholder: '自動授權：0=不自動1=自動'
    }
  }
}
