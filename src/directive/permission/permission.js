import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissions = store.getters && store.getters.permissions
    if (value && typeof (value) === 'string') {
      const hasPermission = permissions[value] || false
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need permission! Like v-permission="'1'"`)
    }
  }
}
