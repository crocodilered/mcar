import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const baseState = {
  user: null,
  vehicles: null,
  currentVehicle: null,
  vehicleManageTab: null
}

const mutations = {
  setUser: (state, user) => {
    state.user = user
  },
  setVehicles: (state, vehicles) => {
    state.vehicles = vehicles
  },
  setCurrentVehicle: (state, vehicle) => {
    state.currentVehicle = vehicle
  },
  setVehicleManageTab: (state, tab) => {
    state.vehicleManageTab = tab
  }
}

const getters = {
  isAuthenticated: (state) => {
    return (state.user !== null && state.user !== undefined)
  }
}

const actions = {
  // Current vehicle
  /**
   * Set current vehicle with vehicle id only.
   */
  selectCurrentVehicle: ({commit, state}, vehicleId) => {
    if (state.vehicles && vehicleId) {
      commit('setCurrentVehicle', state.vehicles[vehicleId])
    }
  }
}

export default new Vuex.Store({
  state: baseState,
  mutations,
  getters,
  actions
})
