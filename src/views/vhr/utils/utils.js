import { Message } from 'element-ui'

export const isNotNullORBlank = (...args) => {
  for (var i = 0; i < args.length; i++) {
    var argument = args[i]
    if (argument == null || argument === '' || argument === undefined) {
      Message.warning({ message: '数据不能为空!' })
      return false
    }
  }
  return true
}
export const initMenu = (router, store) => {
  if (store.state.routes.length > 0) {
    return
  }
  this.getRequest('gateway/vhr/config/sysmenu').then(resp => {
    if (resp && resp.status === 200) {
      var fmtRoutes = formatRoutes(resp.data)
      router.addRoutes(fmtRoutes)
      store.commit('initMenu', fmtRoutes)
      store.dispatch('connect')
    }
  })
}
export const formatRoutes = (routes) => {
  const fmRoutes = []
  routes.forEach(router => {
    let {
      // eslint-disable-next-line prefer-const
      path,
      // eslint-disable-next-line prefer-const
      component,
      // eslint-disable-next-line prefer-const
      name,
      // eslint-disable-next-line prefer-const
      meta,
      // eslint-disable-next-line prefer-const
      iconCls,
      children
    } = router
    if (children && children instanceof Array) {
      children = formatRoutes(children)
    }
    const fmRouter = {
      path: path,
      component(resolve) {
        if (component.startsWith('Home')) {
          require(['../' + component + '.vue'], resolve)
        } else if (component.startsWith('Emp')) {
          require(['../emp/' + component + '.vue'], resolve)
        } else if (component.startsWith('Per')) {
          require(['../personnel/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sal')) {
          require(['../salary/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sta')) {
          require(['../statistics/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sys')) {
          require(['../system/' + component + '.vue'], resolve)
        }
      },
      name: name,
      iconCls: iconCls,
      meta: meta,
      children: children
    }
    fmRoutes.push(fmRouter)
  })
  return fmRoutes
}
