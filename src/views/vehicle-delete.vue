<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <template v-if="currentVehicle && !vehicleDeleted">
          <h1>Удаление авто</h1>
          <p>Вы собираетесь удалить всю информацию об автомобиле <b><nobr>{{ currentVehicle.title }}</nobr></b>.</p>
          <p>Это необратимая операция и данные нельзя будет восстановить. Если вы не передумали, подтвердите удаление, указав год выпуска авто ({{ currentVehicle.makeYear }}) и нажав кнопку «Удалить».</p>
          <form @submit.prevent="deleteVehicle">
            <mdc-textfield
              label="Год выпуска авто"
              type="number"
              v-model="makeYear"
              :error-text="error"
              required
            />
            <mdc-button :loading="loading">
              Удалить
            </mdc-button>
          </form>
        </template>
        <template v-if="vehicleDeleted">
          <p>Данные об автомобиле удалены.</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  // import router from '@/router'
  import { mapState } from 'vuex'
  import { storage, firestore } from '@/config'
  import MdcTextfield from '@/components/mdc/textfield'
  import MdcButton from '@/components/mdc/button'

  const data = function () {
    return {
      makeYear: null,
      error: 'эыва',
      vehicleDeleted: false,
      loading: false
    }
  }

  const computed = {
    ...mapState(['user', 'currentVehicle'])
  }

  const methods = {
    deleteVehicle () {
      if (this.currentVehicle.makeYear === parseInt(this.makeYear)) {
        this.loading = true
        const promises = []
        let p

        // Delete photo
        if (this.currentVehicle.photoPath) {
          promises.push(storage.ref().child(this.currentVehicle.photoPath).delete())
        }

        // Delete doc
        p = firestore
          .collection('users').doc(this.user.uid)
          .collection('vehicles').doc(this.currentVehicle.id).delete()
        promises.push(p)

        // Delete expenses sub-collection
        const expensesCollection = firestore
          .collection('users').doc(this.user.uid)
          .collection('vehicles').doc(this.currentVehicle.id)
          .collection('expenses')
        expensesCollection.get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              promises.push(expensesCollection.doc(doc.id).delete())
            })
          })

        Promise.all(promises).then(() => {
          this.loading = false
          this.vehicleDeleted = true

          // Update local vehilcles cache
          // delete this.vehicles[this.currentVehicle.id]
          this.$store.dispatch('loadVehicles', this.vehicles)
          this.$store.dispatch('clearCurrentVehicle')
        })
      } else {
        // Do something to say the given makeYear is wrong
        this.error = 'Указан неверный год.'
      }
    }
  }

  export default {
    components: { MdcButton, MdcTextfield },
    name: 'VehicleDelete',
    computed,
    methods,
    data
  }
</script>
