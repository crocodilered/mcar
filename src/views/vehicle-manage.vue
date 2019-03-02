<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <vehicle-expense
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
  import VehicleExpense from '@/components/vehicle/vehicle-expense'
  import VehicleNotes from '@/components/vehicle/vehicle-notes'

  export default {
    components: {
      VehicleExpense,
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
