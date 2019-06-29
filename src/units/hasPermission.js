import store from '../store'

export function hasPermission (permission) {
  let allPermissionList = store.getters.permissions
  return allPermissionList.find(x => x.url === permission)
}
