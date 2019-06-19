export default [
  {
    path: '/empty',
    name: 'empty',
    meta: {
      login: true
    }
  },
  { path: '/empty/home', name: 'emptyHome', component: resolve => require(['@/views/Home'], resolve)},
  { path: '/empty/test', name: 'test', component: resolve => require(['@/views/Test'], resolve) }
]
