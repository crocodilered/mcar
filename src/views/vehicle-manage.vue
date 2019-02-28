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
          NOTES
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import VehicleExpense from '@/components/vehicle/vehicle-expense'
  import VehicleReport from '@/components/vehicle/vehicle-report'

  const computed = {
    ...mapState([
      'currentVehicle',
      'vehicleManageTab'
    ])
  }

  export default {
    components: { VehicleExpense, VehicleReport },
    computed,

    async created () {
      this.$store.commit('setVehicleManageTab', 'expense')
    },

    destroyed () {
      this.$store.commit('setVehicleManageTab', null)
    }
  }
</script>

<style lang="scss">
  .tab {
    margin-top: 2em;
  }
</style>
