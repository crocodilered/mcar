<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <h1>Редактировать авто</h1>
        <vehicle-properties
          :vehicle="vehicle"
          @create="redirect"
          @update="redirect"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import VehicleProperties from '@/components/vehicle/properties'

  const data = function () {
    return {
      vehicle: null
    }
  }

  const methods = {
    redirect () {
      this.$router.push(`/vehicle/${this.vehicle.id}`)
    }
  }

  export default {
    name: 'VehicleCreate',
    components: { VehicleProperties },
    data,
    methods,
    created () {
      this.vehicle = this.$store.state.currentVehicle
    }
  }
</script>
