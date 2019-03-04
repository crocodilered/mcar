<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <template v-if="currentVehicle && !vehicleDeleted">
          <h1>Удаление авто</h1>
          <p>Вы собираетесь удалить всю информацию об автомобиле <nobr>{{ currentVehicle.title }}</nobr>.</p>
          <p>Это необратимая операция и данные нельзя будет восстановить. Если вы не передумали, подтвердите удаление, указав год выпуска авто (<b>{{ currentVehicle.makeYear }}</b>) и нажав кнопку «Удалить».</p>
          <form @submit.prevent="deleteVehicle">
            <mdc-textfield
              label="Год выпуска авто"
              type="number"
              v-model="makeYear"
              :error-text="error"
              required
            />
            <mdc-submit :loading="loading">
              Удалить
            </mdc-submit>
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
  import MdcSubmit from '@/components/mdc/submit'

  const data = function () {
    return {
      makeYear: null,
      error: null,
      vehicleDeleted: false,
      loading: false
    }
  }

  const computed = {
    ...mapState(['user', 'currentVehicle']),

    vehicleRef () {
      return firestore
        .collection('users').doc(this.user.uid)
        .collection('vehicles').doc(this.currentVehicle.id)
    }
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

        // Delete vehicle doc
        promises.push(this.vehicleRef.delete())

        // Delete vehicle sub-collections
        let deleteVehicleSubCollection = function (collectionName) {
          let collection = this.vehicleRef.collection(collectionName)
          collection.get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                promises.push(collection.doc(doc.id).delete())
              })
            })
        }

        deleteVehicleSubCollection('expenses')
        deleteVehicleSubCollection('expensesAggregatedMonthly')
        deleteVehicleSubCollection('expensesAggregatedYearly')
        deleteVehicleSubCollection('notes')

        Promise.all(promises).then(() => {
          this.loading = false
          this.vehicleDeleted = true

          // Update local vehilcles data
          this.$store.dispatch('clearCurrentVehicle')
        })
      } else {
        // Do something to say the given makeYear is wrong
        this.error = 'Указан неверный год.'
      }
    }
  }

  export default {
    components: { MdcSubmit, MdcTextfield },
    name: 'VehicleDelete',
    computed,
    methods,
    data
  }
</script>
