export default [
  {
    path: '/admin',
    name: 'admin',
    meta: { login: true }
  },
  {
    path: '/admin/auth/SystemApiControl',
    name: 'SystemApiControl',
    component: resolve => require(['@/views/admin/auth/SystemApiControl'], resolve)
  },
  {
    path: '/admin/auth/GroupControl',
    name: 'GroupControl',
    component: resolve => require(['@/views/admin/auth/GroupControl'], resolve)
  },
  {
    path: '/admin/auth/OperatorControl',
    name: 'OperatorControl',
    component: resolve => require(['@/views/admin/auth/OperatorControl'], resolve)
  },
  {
    path: '/admin/auth/ResetPassword',
    name: 'ResetPassword',
    component: resolve => require(['@/views/admin/auth/ResetPassword'], resolve)
  },
  {
    path: '/admin/user/UserProfile',
    name: 'UserProfile',
    component: resolve => require(['@/views/admin/user/UserProfile'], resolve)
  },
  {
    path: '/admin/device/DeviceControl',
    name: 'DeviceControl',
    component: resolve => require(['@/views/admin/device/DeviceControl'], resolve)
  }
]
