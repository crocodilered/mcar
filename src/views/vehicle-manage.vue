<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <div
          v-if="vehicleManageTab === 'report'"
          class="tab"
        >
          <vehicle-report
            :vehicle="currentVehicle"
          />
        </div>
        <div
          v-if="vehicleManageTab === 'expense'"
          class="tab"
        >
          <vehicle-expense :vehicle="currentVehicle"/>
        </div>
        <div
          v-if="vehicleManageTab === 'notes'"
          class="tab"
        >
          <vehicle-notes
            :vehicle="currentVehicle"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import VehicleExpense from '@/components/vehicle/vehicle-expense'
  import VehicleReport from '@/components/vehicle/vehicle-report'
  import VehicleNotes from '@/components/vehicle/vehicle-notes'

  export default {
    components: {
      VehicleExpense,
      VehicleReport,
      VehicleNotes
    },
    
    computed: {
      ...mapState([
        'currentVehicle',
        'vehicleManageTab'
      ])
    },

    async created () {
      this.$store.commit('setVehicleManageTab', 'notes')
    },

    destroyed () {
      this.$store.commit('setVehicleManageTab', null)
    }
  }
</script>
