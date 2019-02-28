import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const baseState = {
  user: null,
  vehicles: null,
  navigationVehicles: null,
  currentVehicle: null,
  vehicleManageTab: null
}

const mutations = {
  setUser: (state, payload) => {
    state.user = payload
  },
  setVehicles: (state, payload) => {
    state.vehicles = payload
  },
  setNavigationVehicles: (state, payload) => {
    state.navigationVehicles = payload
  },
  setCurrentVehicle: (state, payload) => {
    state.currentVehicle = payload
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
  loadVehicles: ({commit, state, dispatch}, vehicles) => {
    commit('setVehicles', vehicles)
    if (vehicles) {
      const navigationVehicles = {}
      for (let i in vehicles) {
        navigationVehicles[i] = {
          title: vehicles[i].title.slice(),
          photoUrl: vehicles[i].photoUrl
        }
      }
      commit('setNavigationVehicles', navigationVehicles)
      if (state.currentVehicle) {
        dispatch('selectCurrentVehicle', state.currentVehicle.id)
      }
    } else {
      commit('setNavigationVehicles', null)
    }
  },

  // Current vehicle
  selectCurrentVehicle: ({commit, state}, vehicleId) => {
    if (state.vehicles && vehicleId) {
      commit('setCurrentVehicle', state.vehicles[vehicleId])
    }
  },

  clearCurrentVehicle: ({commit}) => {
    commit('setCurrentVehicle', null)
  },

  // User
  userSignIn: ({commit}, payload) => {
    commit('setUser', payload.user)
  },

  userLogout: ({commit}) => {
    commit('setUser', null)
    commit('setCurrentVehicle', null)
    commit('setNavigationVehicles', null)
    commit('setVehicles', null)
  }
}

export default new Vuex.Store({
  state: baseState,
  mutations,
  getters,
  actions
})
