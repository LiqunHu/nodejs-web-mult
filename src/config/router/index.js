import empty from './empty'
import admin from './admin'

const routes = [
  { path: '*', component: resolve => require(['@/components/error404'], resolve), meta: { emptyPage: true } },
  { path: '/', component: resolve => require(['@/views/Login'], resolve), meta: { emptyPage: true } },
  { path: '/error', component: resolve => require(['@/components/error'], resolve), meta: { emptyPage: true } },
  { path: '/error404', component: resolve => require(['@/components/error404'], resolve), meta: { emptyPage: true } },
  ...empty,
  ...admin
]

export default routes
