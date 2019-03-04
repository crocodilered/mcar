<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <vehicle-expenses
            v-if="vehicleManageTab === 'expenses'"
          :vehicle="currentVehicle"
        />
        <vehicle-notes
          v-if="vehicleManageTab === 'notes'"
          :vehicle="currentVehicle"
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
