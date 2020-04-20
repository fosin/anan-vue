const getters = {
  sidebar: state => state.app.sidebar,
  ananLanguage: state => state.app.ananLanguage,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  ananToken: state => state.user.ananToken,
  ananUserInfo: state => state.user.ananUserInfo,
  ananPermissions: state => state.user.ananPermissions,
  ananPermissionTree: state => state.user.ananPermissionTree,
  ananCurrentOrganiz: state => state.user.ananCurrentOrganiz,
  ananCurrentRole: state => state.user.ananCurrentRole,
  ananRouters: state => state.permission.ananRouters,
  ananAddRouters: state => state.permission.ananAddRouters,
  size: state => state.app.size,
  errorLogs: state => state.errorLog.logs
}
export default getters
