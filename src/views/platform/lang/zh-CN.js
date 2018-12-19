export default {
  cdp_sys_dictionary: {
    searchText: '支持名称、类别及代码查找',
    code: {
      label: '字典代码',
      placeholder: '字典代码'
    },
    name: {
      label: '字典名称',
      placeholder: '字典名称'
    },
    type: {
      label: '字典类别',
      placeholder: '字典类别，区别字典的大分类，取值于表cdp_sys_dictionary.code = 1数据'
    },
    scope: {
      label: '字典作用域',
      placeholder: '字典作用域，以字典类别为前提，在字典类别基础上再次细化分类字典'
    }
  },
  cdp_sys_dictionary_detail: {
    searchText: '支持字典明细项代码、字典明细项值查找',
    id: {
      label: '字典明细ID',
      placeholder: '字典明细ID'
    },
    name: {
      label: '字典明细键',
      placeholder: '字典明细键，不能重复，字典内明细项唯一代码'
    },
    value: {
      label: '字典明细值',
      placeholder: '字典明细值表示字面意义'
    },
    code: {
      label: '字典代码',
      placeholder: '取值于字典表的字典代码'
    },
    sort: {
      label: '顺序',
      placeholder: '顺序，用于显示数据时的顺序，数值越小越靠前'
    },
    status: {
      label: '状态',
      placeholder: '状态：0=启用，1=禁用，具体取值于字典表的字典代码=11'
    },
    scode: {
      label: '标准代码',
      placeholder: '标准代码，该字段通常用于对接标准字典'
    },
    scope: {
      label: '作用域，用于字典明细项的作用域',
      placeholder: '作用域，用于字典明细项的作用域'
    },
    used: {
      label: '使用标志',
      placeholder: '使用标志：0=未使用，1=已使用，已使用的字典就不能再修改name属性'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    createTime: {
      label: '创建日期',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    updateBy: {
      label: '更新人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    updateTime: {
      label: '更新日期',
      placeholder: '更新日期，该值由后台维护，更改数据时前端不需要关心'
    }
  },
  cdp_sys_organization: {
    id: {
      label: '机构ID',
      placeholder: '机构ID'
    },
    pId: {
      label: '父机构编码',
      placeholder: '父机构编码，取值于id，表示当前数据所属的父类机构'
    },
    topId: {
      label: '顶级机构编码',
      placeholder: '顶级机构编码：一般指用户注册的机构，通常是一个集团组的最高级别机构，取值于id'
    },
    code: {
      label: '机构编码',
      placeholder: '机构编码，自定义机构编码，下级机构必须以上级机构编码为前缀'
    },
    name: {
      label: '机构名称',
      placeholder: '机构名称'
    },
    level: {
      label: '深度',
      placeholder: '深度'
    },
    fullname: {
      label: '机构全名',
      placeholder: '机构全名'
    },
    address: {
      label: '机构地址',
      placeholder: '机构地址'
    },
    telphone: {
      label: '机构电话',
      placeholder: '机构电话'
    },
    status: {
      label: '状态',
      placeholder: '状态：0=启用，1=禁用，具体取值于字典表的字典代码=11的字典'
    },
    createTime: {
      label: '创建日期',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    updateTime: {
      label: '更新日期',
      placeholder: '更新日期，该值由后台维护，更改数据时前端不需要关心'
    },
    updateBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    }
  },
  cdp_sys_organization_auth: {
    id: {
      label: '机构授权ID',
      placeholder: '机构授权ID'
    },
    organizId: {
      label: '机构ID',
      placeholder: '机构ID'
    },
    versionId: {
      label: '版本ID',
      placeholder: '版本ID'
    },
    orderId: {
      label: '订单ID',
      placeholder: '订单ID'
    },
    authorizationCode: {
      label: '授权码',
      placeholder: '授权码'
    },
    createTime: {
      label: '创建日期',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    validity: {
      label: '有效期',
      placeholder: '有效期：一般按天计算'
    },
    protectDays: {
      label: '保护期',
      placeholder: '到期后保护期'
    },
    maxOrganizs: {
      label: '最大机构数',
      placeholder: '最大机构数：0=无限制 n=限制数'
    },
    maxUsers: {
      label: '最大机构数',
      placeholder: '最大机构数：0=无限制 n=限制数'
    },
    tryout: {
      label: '是否试用',
      placeholder: '是否试用：0=不试用 1=试用'
    },
    tryoutDays: {
      label: '试用天数',
      placeholder: '试用天数'
    }
  },
  cdp_sys_organization_permission: {
    id: {
      label: '机构权限ID',
      placeholder: '机构权限ID'
    },
    organizId: {
      label: '机构ID',
      placeholder: '机构ID'
    },
    permissionId: {
      label: '权限ID',
      placeholder: '权限ID'
    },
    createTime: {
      label: '创建时间',
      placeholder: '创建时间'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    }
  },
  cdp_sys_parameter: {
    searchText: '支持参数键、参数值、说明查找',
    id: {
      label: '参数ID',
      placeholder: '参数ID'
    },
    name: {
      label: '参数键',
      placeholder: '参数键'
    },
    value: {
      label: '参数值',
      placeholder: '参数值'
    },
    type: {
      label: '参数分类',
      placeholder: '参数分类：具体取值于字典表的字典代码=10'
    },
    scope: {
      label: '作用域',
      placeholder: '参数作用域'
    },
    defaultValue: {
      label: '默认值',
      placeholder: '默认值'
    },
    description: {
      label: '参数描述',
      placeholder: '参数描述'
    },
    createTime: {
      label: '创建日期',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    updateTime: {
      label: '更新日期',
      placeholder: '更新日期，该值由后台维护，更改数据时前端不需要关心'
    },
    updateBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    applyTime: {
      label: '生效日期',
      placeholder: '生效日期，该值由后台维护，更改数据时前端不需要关心'
    },
    applyBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    status: {
      label: '参数状态',
      placeholder: '参数状态：0=正常状态、1=修改状态、2=删除状态'
    }
  },
  cdp_sys_pay: {
    payId: {
      label: '支付ID',
      placeholder: '支付ID'
    },
    organizId: {
      label: '付款机构',
      placeholder: '付款机构'
    },
    userId: {
      label: '付款用户',
      placeholder: '付款用户'
    },
    orderId: {
      label: '订单ID',
      placeholder: '订单ID'
    },
    invoiceId: {
      label: '发票ID',
      placeholder: '发票ID'
    },
    payType: {
      label: '交易类型',
      placeholder: '交易类型：0=正交易 1：负交易'
    },
    totalMoney: {
      label: '应收金额',
      placeholder: '应收金额'
    },
    payMoney: {
      label: '支付金额',
      placeholder: '支付金额'
    },
    discountMonery: {
      label: '优惠金额',
      placeholder: '优惠金额'
    },
    uncollectMoney: {
      label: '待收金额',
      placeholder: '待收金额'
    },
    payTime: {
      label: '付款日期',
      placeholder: '付款日期'
    },
    payFlag: {
      label: '付款标志',
      placeholder: '付款标志：0=未付款，1=分期，2=付全款'
    }
  },
  cdp_sys_pay_detail: {
    paydetailId: {
      label: '付款明细ID',
      placeholder: '付款明细ID'
    },
    payId: {
      label: '支付ID',
      placeholder: '支付ID'
    },
    payway: {
      label: '付款方式',
      placeholder: '付款方式'
    },
    money: {
      label: '付款金额',
      placeholder: '付款金额'
    }
  },
  cdp_sys_pay_invoice: {
    invoceId: {
      label: '发票ID',
      placeholder: '发票ID'
    },
    payId: {
      label: '支付ID',
      placeholder: '支付ID'
    },
    invoceNo: {
      label: '发票号码',
      placeholder: '发票号码'
    },
    invoceTime: {
      label: '出票时间',
      placeholder: '出票时间'
    },
    crreateBy: {
      label: '操作人',
      placeholder: '操作人'
    }
  },
  cdp_sys_pay_order: {
    orderId: {
      label: '订单ID',
      placeholder: '订单ID'
    },
    organizId: {
      label: '订单机构',
      placeholder: '订单机构'
    },
    userId: {
      label: '订单用户',
      placeholder: '订单用户'
    },
    versionId: {
      label: '版本ID',
      placeholder: '版本ID'
    },
    money: {
      label: '版本金额',
      placeholder: '版本金额'
    },
    orderTime: {
      label: '订单日期',
      placeholder: '订单日期'
    },
    status: {
      label: '订单状态',
      placeholder: '订单状态：0=新建，1=支付，2=取消，3=作废'
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
      label: '作废日期',
      placeholder: '作废日期'
    }
  },
  cdp_sys_permission: {
    id: {
      label: '权限ID',
      placeholder: '权限ID'
    },
    code: {
      label: '权限编码',
      placeholder: '权限编码，不能重复 不能为空'
    },
    pId: {
      label: '父权限ID',
      placeholder: '父权限ID，取值于id，表示当前数据的父类权限'
    },
    name: {
      label: '权限名称',
      placeholder: '权限名称'
    },
    url: {
      label: '资源地址',
      placeholder: '资源地址：该字段必须和type字段共同使用，详情请看type字段'
    },
    type: {
      label: '权限类型',
      placeholder: '权限类型：0=按钮、1=组件菜单，对应ur是前端组件l、2=链接菜单，对应url是http(s)链接地址、3=目录菜单，对应是目录菜单，具体取值于字典表的字典代码=13，当权限类型是1：组件菜单 3：目录菜单时表示该节点不是一个叶子节点'
    },
    level: {
      label: '菜单层级',
      placeholder: '菜单层级'
    },
    sort: {
      label: '排序',
      placeholder: '排序，用于显示数据时的顺序，数值越小越靠前'
    },
    status: {
      label: '状态',
      placeholder: '状态：0=启用，1=禁用，具体取值于字典表的字典代码=11的字典'
    },
    appName: {
      label: '所属应用名称',
      placeholder: '所属应用名称,等同于配置文件中的spring.application.name'
    },
    path: {
      label: '权限地址',
      placeholder: '后台请求权限地址，权限路径ant风格表达式，用于动态验证HTTP后台请求的权限标识'
    },
    method: {
      label: '请求方法',
      placeholder: 'http请求方法：GET、POST、DELETE、OPTIONS、PUT、PATCH，具体取值于字典表的字典代码=12'
    },
    icon: {
      label: '图标',
      placeholder: '图标：一般用于前端菜单选项前的ICON图标'
    },
    createTime: {
      label: '创建日期',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    updateTime: {
      label: '更新日期',
      placeholder: '更新日期，该值由后台维护，更改数据时前端不需要关心'
    },
    updateBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    }
  },
  cdp_sys_role: {
    searchText: '支持角色名称、标识',
    id: {
      label: '角色ID',
      placeholder: '角色ID'
    },
    organizId: {
      label: '机构ID',
      placeholder: '机构ID'
    },
    name: {
      label: '角色名称',
      placeholder: '角色名称'
    },
    value: {
      label: '角色标识',
      placeholder: '角色标识'
    },
    tips: {
      label: '角色说明',
      placeholder: '角色说明'
    },
    status: {
      label: '状态',
      placeholder: '状态：0=启用，1=禁用，具体取值于字典表的字典代码=11的字典'
    },
    createTime: {
      label: '创建时间',
      placeholder: '创建时间'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    updateTime: {
      label: '更新时间',
      placeholder: '更新时间'
    },
    updateBy: {
      label: '更新人',
      placeholder: '更新人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    builtIn: {
      label: '内置标志',
      placeholder: '内置标志：是否是系统内置角色，内置角色不能被用户删除和修改，0=不是 1=是'
    }
  },
  cdp_sys_role_permission: {
    id: {
      label: '角色权限ID',
      placeholder: '角色权限ID'
    },
    roleId: {
      label: '角色ID',
      placeholder: '角色ID'
    },
    permissionId: {
      label: '权限ID',
      placeholder: '权限ID'
    },
    createTime: {
      label: '创建时间',
      placeholder: '创建时间'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    }
  },
  cdp_sys_user: {
    searchText: '支持用户工号、名称、手机号、邮箱查找',
    baseInfo: '基本信息',
    modifyPassword: '修改密码',
    oldPassword: {
      label: '当前密码',
      placeholder: '请输入用户当前密码'
    },
    confirmPassword1: {
      label: '新密码',
      placeholder: '请输入用户新密码'
    },
    confirmPassword2: {
      label: '确认新密码',
      placeholder: '请再次输入用户新密码'
    },
    id: {
      label: '用户ID',
      placeholder: '用户ID'
    },
    organizId: {
      label: '机构ID',
      placeholder: '机构ID'
    },
    usercode: {
      label: '用户工号',
      placeholder: '用户工号'
    },
    username: {
      label: '用户姓名',
      placeholder: '用户姓名'
    },
    password: {
      label: '用户密码',
      placeholder: '用户密码：传入原始密码，后台会对原始密码进行加密后再存储'
    },
    birthday: {
      label: '生日',
      placeholder: '生日'
    },
    sex: {
      label: '性别',
      placeholder: '性别：具体取值于字典表的字典代码=15'
    },
    email: {
      label: '电子邮箱',
      placeholder: '电子邮箱'
    },
    phone: {
      label: '手机号码',
      placeholder: '手机号码'
    },
    status: {
      label: '状态',
      placeholder: '状态：0=启用，1=禁用，具体取值于字典表的字典代码=11的字典'
    },
    avatar: {
      label: '头像',
      placeholder: '头像'
    },
    createTime: {
      label: '创建日期',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    updateTime: {
      label: '更新日期',
      placeholder: '更新日期，该值由后台维护，更改数据时前端不需要关心'
    },
    updateBy: {
      label: '更新人',
      placeholder: '更新人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    expireTime: {
      label: '过期时间',
      placeholder: '过期时间，账户过期后用户被锁定切不能登录系统'
    }
  },
  cdp_sys_user_permission: {
    id: {
      label: '用户权限ID',
      placeholder: '用户权限ID'
    },
    organizId: {
      label: '机构ID',
      placeholder: '机构ID'
    },
    userId: {
      label: '用户ID',
      placeholder: '用户ID'
    },
    permissionId: {
      label: '权限ID',
      placeholder: '权限ID'
    },
    createTime: {
      label: '创建日期',
      placeholder: '创建日期'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    addMode: {
      label: '补充方式',
      placeholder: '补充方式：0=增加权限、1=删除权限'
    }
  },
  cdp_sys_user_role: {
    id: {
      label: '用户角色ID',
      placeholder: '用户角色ID'
    },
    organizId: {
      label: '机构ID',
      placeholder: '机构ID'
    },
    userId: {
      label: '用户ID',
      placeholder: '用户ID'
    },
    roleId: {
      label: '角色ID',
      placeholder: '角色ID'
    },
    createTime: {
      label: '创建日期',
      placeholder: '创建日期，该值由后台维护，更改数据时前端不需要关心'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    }
  },
  cdp_sys_version: {
    searchText: '支持版本名称查找',
    id: {
      label: '版本ID',
      placeholder: '版本ID'
    },
    name: {
      label: '版本名称',
      placeholder: '版本名称'
    },
    type: {
      label: '版本类型',
      placeholder: '版本类型：0=收费版 1=免费版 2=开发版'
    },
    price: {
      label: '版本价格',
      placeholder: '版本价格'
    },
    beginTime: {
      label: '活动开始日期',
      placeholder: '活动开始日期'
    },
    endTime: {
      label: '活动结束日期',
      placeholder: '活动结束日期'
    },
    validity: {
      label: '有效期',
      placeholder: '有效期：一般按天计算'
    },
    protectDays: {
      label: '保护期',
      placeholder: '到期后保护期'
    },
    maxOrganizs: {
      label: '最大机构数',
      placeholder: '最大机构数：0=无限制 n=限制数'
    },
    maxUsers: {
      label: '最大用户数',
      placeholder: '最大用户数：0=无限制 n=限制数'
    },
    tryout: {
      label: '是否试用',
      placeholder: '是否试用：0=不试用 1=试用'
    },
    tryoutDays: {
      label: '试用天数',
      placeholder: '试用天数'
    },
    createTime: {
      label: '创建日期',
      placeholder: '创建日期'
    },
    status: {
      label: '启用状态',
      placeholder: '启用状态：0=启用，1=禁用'
    },
    description: {
      label: '版本描述',
      placeholder: '版本描述'
    }
  },
  cdp_sys_version_permission: {
    id: {
      label: '版本权限ID',
      placeholder: '版本权限ID'
    },
    versionId: {
      label: '版本ID',
      placeholder: '版本ID'
    },
    permissionId: {
      label: '权限ID',
      placeholder: '权限ID'
    },
    createTime: {
      label: '创建时间',
      placeholder: '创建时间'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    }
  },
  cdp_sys_version_role: {
    searchText: '支持版本角色名称、角色标识查找',
    id: {
      label: '角色ID',
      placeholder: '角色ID'
    },
    versionId: {
      label: '版本ID',
      placeholder: '版本ID'
    },
    name: {
      label: '角色名称',
      placeholder: '角色名称'
    },
    value: {
      label: '角色标识',
      placeholder: '角色标识'
    },
    tips: {
      label: '角色说明',
      placeholder: '角色说明'
    },
    status: {
      label: '状态',
      placeholder: '状态：0=启用，1=禁用，具体取值于字典表的字典代码=11的字典'
    },
    createTime: {
      label: '创建时间',
      placeholder: '创建时间'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    },
    updateTime: {
      label: '更新时间',
      placeholder: '更新时间'
    },
    updateBy: {
      label: '更新人',
      placeholder: '更新人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    }
  },
  cdp_sys_version_role_permission: {
    id: {
      label: '角色权限ID',
      placeholder: '角色权限ID'
    },
    roleId: {
      label: '角色ID',
      placeholder: '角色ID'
    },
    permissionId: {
      label: '权限ID',
      placeholder: '权限ID'
    },
    createTime: {
      label: '创建时间',
      placeholder: '创建时间'
    },
    createBy: {
      label: '创建人',
      placeholder: '创建人：该值由后台维护，更改数据时前端不需要关心，取值于系统用户表的ID'
    }
  },
  oauth_client_details: {
    searchText: '支持标识、密钥查找',
    clientId: {
      label: '客户端编号',
      placeholder: '客户端编号'
    },
    resourceIds: {
      label: '资源信息',
      placeholder: '资源信息'
    },
    clientSecret: {
      label: '客户端密钥',
      placeholder: '客户端密钥'
    },
    scope: {
      label: '作用域',
      placeholder: '作用域'
    },
    authorizedGrantTypes: {
      label: '授权类型',
      placeholder: '授权类型'
    },
    webServerRedirectUri: {
      label: '重定向地址',
      placeholder: '重定向地址'
    },
    authorities: {
      label: '授权明细',
      placeholder: '授权明细'
    },
    accessTokenValidity: {
      label: '令牌效期',
      placeholder: '令牌效期：单位是秒'
    },
    refreshTokenValidity: {
      label: '刷新令牌期效',
      placeholder: '刷新令牌期效，单位是秒'
    },
    additionalInformation: {
      label: '附加信息',
      placeholder: '附加信息'
    },
    autoapprove: {
      label: '自动授权',
      placeholder: '自动授权：0=不自动 1=自动'
    }
  }
}
