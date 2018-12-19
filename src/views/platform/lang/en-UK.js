export default {
  cdp_sys_dictionary: {
    searchText: 'Support name, type , code search',
    code: {
      label: 'code',
      placeholder: '字典代码'
    },
    name: {
      label: 'name',
      placeholder: '字典名称'
    },
    type: {
      label: 'type',
      placeholder: '字典类别，区别字典的大分类，取值于表cdp_sys_dictionary.code = 1数据'
    },
    scope: {
      label: 'scope',
      placeholder: '字典作用域，以字典类别为前提，在字典类别基础上再次细化分类字典'
    }
  },
  cdp_sys_dictionary_detail: {
    searchText: 'Support name, value search',
    id: {
      label: 'id',
      placeholder: '字典明细ID'
    },
    name: {
      label: 'name',
      placeholder: '字典明细键，不能重复，字典内明细项唯一代码'
    },
    value: {
      label: 'value',
      placeholder: '字典明细值表示字面意义'
    },
    code: {
      label: 'code',
      placeholder: '取值于字典明细表CdpSysDictionaryDetailEntity.code'
    },
    sort: {
      label: 'sort',
      placeholder: '顺序，用于显示数据时的顺序，数值越小越靠前'
    },
    status: {
      label: 'status',
      placeholder: '使用状态：0=启用，1=禁用，具体取值于字典表cdp_sys_dictionary.code=11'
    },
    scode: {
      label: 'scode',
      placeholder: '标准代码，该字段通常用于对接标准字典'
    },
    scope: {
      label: 'scope',
      placeholder: '作用域，用于字典明细项的作用域'
    },
    used: {
      label: 'used',
      placeholder: '使用标志：0=未使用，1=已使用，已使用的字典就不能再修改name属性'
    },
    createBy: {
      label: 'createBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    updateBy: {
      label: 'updateBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    updateTime: {
      label: 'updateTime',
      placeholder: '更新日期，该值由后台维护，更改数据时前端不需要关心'
    }
  },
  cdp_sys_organization: {
    id: {
      label: 'id',
      placeholder: '机构ID'
    },
    pId: {
      label: 'pId',
      placeholder: '父机构编码，取值于id，表示当前数据所属的父类机构'
    },
    topId: {
      label: 'topId',
      placeholder: '顶级机构编码：一般指用户注册的机构，通常是一个集团组的最高级别机构，取值于id'
    },
    code: {
      label: 'code',
      placeholder: '机构编码，自定义机构编码，下级机构必须以上级机构编码为前缀'
    },
    name: {
      label: 'name',
      placeholder: '机构名称'
    },
    level: {
      label: 'level',
      placeholder: '深度'
    },
    fullname: {
      label: 'fullname',
      placeholder: '机构全名'
    },
    address: {
      label: 'address',
      placeholder: '机构地址'
    },
    telphone: {
      label: 'telphone',
      placeholder: '机构电话'
    },
    status: {
      label: 'status',
      placeholder: '使用状态：0=启用，1=禁用，具体取值于字典表cdp_sys_dictionary.code=11'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: 'createBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    updateTime: {
      label: 'updateTime',
      placeholder: '更新日期，该值由后台维护，更改数据时前端不需要关心'
    },
    updateBy: {
      label: 'updateBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    }
  },
  cdp_sys_organization_auth: {
    id: {
      label: 'id',
      placeholder: '机构授权ID'
    },
    organizId: {
      label: 'organizId',
      placeholder: '机构ID'
    },
    versionId: {
      label: 'versionId',
      placeholder: '版本ID'
    },
    orderId: {
      label: 'orderId',
      placeholder: '订单ID'
    },
    authorizationCode: {
      label: 'authorizationCode',
      placeholder: '授权码'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: 'createBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    validity: {
      label: 'validity',
      placeholder: '有效期：一般按天计算'
    },
    protectDays: {
      label: 'protectDays',
      placeholder: '到期后保护期'
    },
    maxOrganizs: {
      label: 'maxOrganizs',
      placeholder: '最大机构数：0=无限制 n=限制数'
    },
    maxUsers: {
      label: 'maxUsers',
      placeholder: '最大机构数：0=无限制 n=限制数'
    },
    tryout: {
      label: 'tryout',
      placeholder: '是否试用：0=不试用 1=试用'
    },
    tryoutDays: {
      label: 'tryoutDays',
      placeholder: '试用天数'
    }
  },
  cdp_sys_organization_permission: {
    id: {
      label: 'id',
      placeholder: '机构权限ID'
    },
    organizId: {
      label: 'organizId',
      placeholder: '机构ID'
    },
    permissionId: {
      label: 'permissionId',
      placeholder: '权限ID'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建时间'
    },
    createBy: {
      label: 'createBy',
      placeholder: '创建人，该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    }
  },
  cdp_sys_parameter: {
    searchText: 'Support name、value、description search',
    id: {
      label: 'id',
      placeholder: '参数ID'
    },
    name: {
      label: 'name',
      placeholder: '参数键'
    },
    value: {
      label: 'value',
      placeholder: '参数值'
    },
    type: {
      label: 'type',
      placeholder: '参数分类：具体取值于字典表cdp_sys_dictionary.code=10'
    },
    scope: {
      label: 'scope',
      placeholder: '参数作用域'
    },
    defaultValue: {
      label: 'defaultValue',
      placeholder: '默认值'
    },
    description: {
      label: 'description',
      placeholder: '参数描述'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: 'createBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    updateTime: {
      label: 'updateTime',
      placeholder: '更新日期，该值由后台维护，更改数据时前端不需要关心'
    },
    updateBy: {
      label: 'updateBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    applyTime: {
      label: 'applyTime',
      placeholder: '生效日期，该值由后台维护，更改数据时前端不需要关心'
    },
    applyBy: {
      label: 'applyBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    status: {
      label: 'status',
      placeholder: '参数状态：0=正常状态、1=修改状态、2=删除状态'
    }
  },
  cdp_sys_pay: {
    payId: {
      label: 'payId',
      placeholder: '支付ID'
    },
    organizId: {
      label: 'organizId',
      placeholder: '付款机构'
    },
    userId: {
      label: 'userId',
      placeholder: '付款用户'
    },
    orderId: {
      label: 'orderId',
      placeholder: '订单ID'
    },
    invoiceId: {
      label: 'invoiceId',
      placeholder: '发票ID'
    },
    payType: {
      label: 'payType',
      placeholder: '交易类型：0=正交易 1：负交易'
    },
    totalMoney: {
      label: 'totalMoney',
      placeholder: '应收金额'
    },
    payMoney: {
      label: 'payMoney',
      placeholder: '支付金额'
    },
    discountMonery: {
      label: 'discountMonery',
      placeholder: '优惠金额'
    },
    uncollectMoney: {
      label: 'uncollectMoney',
      placeholder: '待收金额'
    },
    payTime: {
      label: 'payTime',
      placeholder: '付款日期'
    },
    payFlag: {
      label: 'payFlag',
      placeholder: '付款标志：0=未付款，1=分期，2=付全款'
    }
  },
  cdp_sys_pay_detail: {
    paydetailId: {
      label: 'paydetailId',
      placeholder: '付款明细ID'
    },
    payId: {
      label: 'payId',
      placeholder: '支付ID'
    },
    payway: {
      label: 'payway',
      placeholder: '付款方式'
    },
    money: {
      label: 'money',
      placeholder: '付款金额'
    }
  },
  cdp_sys_pay_invoice: {
    invoceId: {
      label: 'invoceId',
      placeholder: '发票ID'
    },
    payId: {
      label: 'payId',
      placeholder: '支付ID'
    },
    invoceNo: {
      label: 'invoceNo',
      placeholder: '发票号码'
    },
    invoceTime: {
      label: 'invoceTime',
      placeholder: '出票时间'
    },
    crreateBy: {
      label: 'crreateBy',
      placeholder: '操作人'
    }
  },
  cdp_sys_pay_order: {
    orderId: {
      label: 'orderId',
      placeholder: '订单ID'
    },
    organizId: {
      label: 'organizId',
      placeholder: '订单机构'
    },
    userId: {
      label: 'userId',
      placeholder: '订单用户'
    },
    versionId: {
      label: 'versionId',
      placeholder: '版本ID'
    },
    money: {
      label: 'money',
      placeholder: '版本金额'
    },
    orderTime: {
      label: 'orderTime',
      placeholder: '订单日期'
    },
    status: {
      label: 'status',
      placeholder: '订单状态：0=新建，1=支付，2=取消，3=作废'
    },
    payTime: {
      label: 'payTime',
      placeholder: '支付日期'
    },
    cancleTime: {
      label: 'cancleTime',
      placeholder: '取消日期'
    },
    invalidTime: {
      label: 'invalidTime',
      placeholder: '作废日期'
    }
  },
  cdp_sys_permission: {
    id: {
      label: 'id',
      placeholder: '权限ID'
    },
    code: {
      label: 'code',
      placeholder: '权限编码，不能重复 不能为空'
    },
    pId: {
      label: 'pId',
      placeholder: '父权限ID，取值于id，表示当前数据的父类权限'
    },
    name: {
      label: 'name',
      placeholder: '权限名称'
    },
    url: {
      label: 'url',
      placeholder: '该字段必须和type字段共同使用，详情请看type字段'
    },
    type: {
      label: 'type',
      placeholder: '权限类型：0=按钮、1=组件菜单，对应ur是前端组件l、2=链接菜单，对应url是http(s)链接地址、3=目录菜单，对应是目录菜单，具体取值于字典表cdp_sys_dictionary.code=13，当权限类型是1：组件菜单 3：目录菜单时表示该节点不是一个叶子节点'
    },
    level: {
      label: 'level',
      placeholder: '菜单层级'
    },
    sort: {
      label: 'sort',
      placeholder: '排序，用于显示数据时的顺序，数值越小越靠前'
    },
    status: {
      label: 'status',
      placeholder: '使用状态：0=启用，1=禁用，具体取值于字典表cdp_sys_dictionary.code=11'
    },
    appName: {
      label: 'appName',
      placeholder: '所属应用名称,等同于配置文件中的spring.application.name'
    },
    path: {
      label: 'path',
      placeholder: '后台请求权限地址，权限路径ant风格表达式，用于动态验证HTTP后台请求的权限标识'
    },
    method: {
      label: 'method',
      placeholder: 'http请求方法：GET、POST、DELETE、OPTIONS、PUT、PATCH，具体取值于字典表cdp_sys_dictionary.code=12'
    },
    icon: {
      label: 'icon',
      placeholder: '一般用于前端菜单选项前的图标'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: 'createBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    updateTime: {
      label: 'updateTime',
      placeholder: '更新日期，该值由后台维护，更改数据时前端不需要关心'
    },
    updateBy: {
      label: 'updateBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    }
  },
  cdp_sys_role: {
    searchText: '支持角色名称、标识',
    id: {
      label: 'id',
      placeholder: '角色ID'
    },
    organizId: {
      label: 'organizId',
      placeholder: '机构ID'
    },
    name: {
      label: 'name',
      placeholder: '角色名称'
    },
    value: {
      label: 'value',
      placeholder: '角色标识'
    },
    tips: {
      label: 'tips',
      placeholder: '角色说明'
    },
    status: {
      label: 'status',
      placeholder: '使用状态：0=启用，1=禁用，具体取值于字典表cdp_sys_dictionary.code=11'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建时间'
    },
    createBy: {
      label: 'createBy',
      placeholder: '创建人，该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    updateTime: {
      label: 'updateTime',
      placeholder: '更新时间'
    },
    updateBy: {
      label: 'updateBy',
      placeholder: '更新人，该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    builtIn: {
      label: 'builtIn',
      placeholder: '内置标志：是否是系统内置角色，内置角色不能被用户删除和修改，0=不是 1=是'
    }
  },
  cdp_sys_role_permission: {
    id: {
      label: 'id',
      placeholder: '角色权限ID'
    },
    roleId: {
      label: 'roleId',
      placeholder: '角色ID'
    },
    permissionId: {
      label: 'permissionId',
      placeholder: '权限ID'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建时间'
    },
    createBy: {
      label: 'createBy',
      placeholder: '创建人，该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    }
  },
  cdp_sys_user: {
    searchText: 'Support usercode、username、phone、email search',
    baseInfo: 'Basic Info',
    modifyPassword: 'Modify Password',
    oldPassword: {
      label: 'Current Password',
      placeholder: '请输入用户当前密码'
    },
    confirmPassword1: {
      label: 'New Password',
      placeholder: '请输入用户新密码'
    },
    confirmPassword2: {
      label: 'Confirm New Password',
      placeholder: '请再次输入用户新密码'
    },
    id: {
      label: 'id',
      placeholder: '用户ID'
    },
    organizId: {
      label: 'organizId',
      placeholder: '机构ID'
    },
    usercode: {
      label: 'usercode',
      placeholder: '用户工号'
    },
    username: {
      label: 'username',
      placeholder: '用户姓名'
    },
    password: {
      label: 'password',
      placeholder: '传入原始密码，后台会对原始密码进行加密后再存储'
    },
    birthday: {
      label: 'birthday',
      placeholder: '生日'
    },
    sex: {
      label: 'sex',
      placeholder: '使用状态：具体取值于字典表cdp_sys_dictionary.code=15'
    },
    email: {
      label: 'email',
      placeholder: '电子邮箱'
    },
    phone: {
      label: 'phone',
      placeholder: '手机号码'
    },
    status: {
      label: 'status',
      placeholder: '使用状态：0=启用，1=禁用，具体取值于字典表cdp_sys_dictionary.code=11'
    },
    avatar: {
      label: 'avatar',
      placeholder: '头像'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: 'createBy',
      placeholder: '创建人，该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    updateTime: {
      label: 'updateTime',
      placeholder: '更新日期，该值由后台维护，更改数据时前端不需要关心'
    },
    updateBy: {
      label: 'updateBy',
      placeholder: '更新人，该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    expireTime: {
      label: 'expireTime',
      placeholder: '过期时间，账户过期后用户被锁定切不能登录系统'
    }
  },
  cdp_sys_user_permission: {
    id: {
      label: 'id',
      placeholder: '用户权限ID'
    },
    organizId: {
      label: 'organizId',
      placeholder: '机构ID'
    },
    userId: {
      label: 'userId',
      placeholder: '用户ID'
    },
    permissionId: {
      label: 'permissionId',
      placeholder: '权限ID'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建日期'
    },
    createBy: {
      label: 'createBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    addMode: {
      label: 'addMode',
      placeholder: '补充方式：0=增加权限、1=删除权限'
    }
  },
  cdp_sys_user_role: {
    id: {
      label: 'id',
      placeholder: '用户角色ID'
    },
    organizId: {
      label: 'organizId',
      placeholder: '机构ID'
    },
    userId: {
      label: 'userId',
      placeholder: '用户ID'
    },
    roleId: {
      label: 'roleId',
      placeholder: '角色ID'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: 'createBy',
      placeholder: '该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    }
  },
  cdp_sys_version: {
    searchText: 'Support name search',
    id: {
      label: 'id',
      placeholder: '版本ID'
    },
    name: {
      label: 'name',
      placeholder: '版本名称'
    },
    type: {
      label: 'type',
      placeholder: '版本类型：0=收费版 1=免费版 2=开发版'
    },
    price: {
      label: 'price',
      placeholder: '版本价格'
    },
    beginTime: {
      label: 'beginTime',
      placeholder: '活动开始日期'
    },
    endTime: {
      label: 'endTime',
      placeholder: '活动结束日期'
    },
    validity: {
      label: 'validity',
      placeholder: '有效期：一般按天计算'
    },
    protectDays: {
      label: 'protectDays',
      placeholder: '到期后保护期'
    },
    maxOrganizs: {
      label: 'maxOrganizs',
      placeholder: '最大机构数：0=无限制 n=限制数'
    },
    maxUsers: {
      label: 'maxUsers',
      placeholder: '最大用户数：0=无限制 n=限制数'
    },
    tryout: {
      label: 'tryout',
      placeholder: '是否试用：0=不试用 1=试用'
    },
    tryoutDays: {
      label: 'tryoutDays',
      placeholder: '试用天数'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建日期'
    },
    status: {
      label: 'status',
      placeholder: '启用状态：0=启用，1=禁用'
    },
    description: {
      label: 'description',
      placeholder: '版本描述'
    }
  },
  cdp_sys_version_permission: {
    id: {
      label: 'id',
      placeholder: '版本权限ID'
    },
    versionId: {
      label: 'versionId',
      placeholder: '版本ID'
    },
    permissionId: {
      label: 'permissionId',
      placeholder: '权限ID'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建时间'
    },
    createBy: {
      label: 'createBy',
      placeholder: '创建人，该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    }
  },
  cdp_sys_version_role: {
    searchText: 'Support name、value search',
    id: {
      label: 'id',
      placeholder: '角色ID'
    },
    versionId: {
      label: 'versionId',
      placeholder: '版本ID'
    },
    name: {
      label: 'name',
      placeholder: '角色名称'
    },
    value: {
      label: 'value',
      placeholder: '角色标识'
    },
    tips: {
      label: 'tips',
      placeholder: '角色说明'
    },
    status: {
      label: 'status',
      placeholder: '使用状态：0=启用，1=禁用，具体取值于字典表cdp_sys_dictionary.code=11'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建时间'
    },
    createBy: {
      label: 'createBy',
      placeholder: '创建人，该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    },
    updateTime: {
      label: 'updateTime',
      placeholder: '更新时间'
    },
    updateBy: {
      label: 'updateBy',
      placeholder: '更新人，该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    }
  },
  cdp_sys_version_role_permission: {
    id: {
      label: 'id',
      placeholder: '角色权限ID'
    },
    roleId: {
      label: 'roleId',
      placeholder: '角色ID'
    },
    permissionId: {
      label: 'permissionId',
      placeholder: '权限ID'
    },
    createTime: {
      label: 'createTime',
      placeholder: '创建时间'
    },
    createBy: {
      label: 'createBy',
      placeholder: '创建人，该值由后台维护，更改数据时前端不需要关心，取值于cdp_sys_user.id'
    }
  },
  oauth_client_details: {
    searchText: '支持标识、密钥查找',
    clientId: {
      label: 'clientId',
      placeholder: ''
    },
    resourceIds: {
      label: 'resourceIds',
      placeholder: ''
    },
    clientSecret: {
      label: 'clientSecret',
      placeholder: ''
    },
    scope: {
      label: 'scope',
      placeholder: ''
    },
    authorizedGrantTypes: {
      label: 'authorizedGrantTypes',
      placeholder: ''
    },
    webServerRedirectUri: {
      label: 'webServerRedirectUri',
      placeholder: ''
    },
    authorities: {
      label: 'authorities',
      placeholder: ''
    },
    accessTokenValidity: {
      label: 'accessTokenValidity',
      placeholder: ''
    },
    refreshTokenValidity: {
      label: 'refreshTokenValidity',
      placeholder: ''
    },
    additionalInformation: {
      label: 'additionalInformation',
      placeholder: ''
    },
    autoapprove: {
      label: 'autoapprove',
      placeholder: ''
    }
  }
}
