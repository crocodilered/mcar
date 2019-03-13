import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const routerOptions = [
  { path: '/', component: 'landing' },
  { path: '/register', component: 'auth-register' },
  { path: '/login', component: 'auth-login' },
  { path: '/reset-password', component: 'auth-reset-password' },
  { path: '/profile', component: 'profile', meta: { authRequired: true } },
  { path: '/vehicle', component: 'vehicle-list', meta: { authRequired: true } },
  { path: '/vehicle/create', component: 'vehicle-create', meta: { authRequired: true } },
  { path: '/vehicle/:vehicleId', component: 'vehicle-manage', meta: { authRequired: true } },
  { path: '/vehicle/:vehicleId/update', component: 'vehicle-update', meta: { authRequired: true } },
  { path: '/vehicle/:vehicleId/delete', component: 'vehicle-delete', meta: { authRequired: true } },
  { path: '*', component: 'error-404' }
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/views/${route.component}.vue`)
  }
})

const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some(record => record.meta.authRequired)
  const isAuthenticated = store.getters.isAuthenticated

  if (to.params.vehicleId) {
    store.dispatch('selectCurrentVehicle', to.params.vehicleId)
  } else {
    store.commit('setCurrentVehicle', null)
  }

  if (authRequired && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
