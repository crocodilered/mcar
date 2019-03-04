<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <h1>Добавление авто</h1>
        <vehicle-properties
          :vehicle="vehicle"
          @create="redirect"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import VehicleModel from '@/libs/models/vehicle'
  import VehicleProperties from '@/components/vehicle/properties'

  export default {
    name: 'VehicleCreate',
    components: { VehicleProperties },

    data () {
      return {
        vehicle: null
      }
    },

    methods: {
      redirect () {
        this.$router.push(`/vehicle/${this.vehicle.id}`)
      }
    },

    created () {
      this.vehicle = new VehicleModel()
      this.vehicle.setRandomPhoto()
    }
  }
</script>
