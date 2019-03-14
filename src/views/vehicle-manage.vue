<template>
  <div
    v-if="currentVehicle"
    class="mdc-layout-grid"
  >
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell--main">
        <vehicle-expenses
          v-if="vehicleManageTab === 'expenses'"
          :vehicle="currentVehicle"
          :key="`expenses-${currentVehicle.id}`"
        />
        <vehicle-notes
          v-if="vehicleManageTab === 'notes'"
          :vehicle="currentVehicle"
          :key="`notes-${currentVehicle.id}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import VehicleExpenses from '@/components/vehicle/expenses'
  import VehicleNotes from '@/components/vehicle/notes'

  export default {
    components: {
      VehicleExpenses,
      VehicleNotes
    },

    computed: {
      ...mapState([
        'currentVehicle',
        'vehicleManageTab'
      ])
    },

    async created () {
      this.$store.commit('setVehicleManageTab', 'expenses')
    },

    destroyed () {
      this.$store.commit('setVehicleManageTab', null)
    }
  }
</script>
