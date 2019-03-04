// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './app'
import router from './router'
import store from './store'
import { auth, firestore } from './config'
import VehicleModel from '@/libs/models/vehicle'

Vue.config.productionTip = false

auth.onAuthStateChanged(async function (user) {
  if (user) {
    store.commit('setUser', user)
    const snapshot = await firestore
      .collection('users').doc(user.uid)
      .collection('vehicles')
      .get()
    if (!snapshot.empty) {
      const vehicles = {}
      snapshot.forEach(vehicle => {
        const vehicleModel = new VehicleModel(vehicle.id)
        vehicleModel.json = vehicle.data()
        vehicles[vehicle.id] = vehicleModel
      })
      store.commit('setVehicles', vehicles)
    }
  } else {
    store.commit('setUser', null)
    store.commit('setVehicles', null)
  }
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })
})
