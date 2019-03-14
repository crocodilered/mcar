<template>
  <form @submit.prevent="deleteVehicle">
    <div style="margin: 2rem 0">
      <p>Вы собираетесь удалить всю информацию об автомобиле <nobr><big>{{ value.title }}</big></nobr>.</p>
      <p>Это необратимая операция и данные нельзя будет восстановить. Если вы не передумали, подтвердите удаление, указав год выпуска авто (<b>{{ value.makeYear }}</b>) и нажав кнопку «Удалить».</p>
    </div>
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

<script>
  import { mapState } from 'vuex'
  import { storage, firestore } from '@/config'
  import MdcTextfield from '@/components/mdc/textfield'
  import MdcSubmit from '@/components/mdc/submit'

  export default {
    components: { MdcSubmit, MdcTextfield },
    name: 'VehicleDelete',
    props: ['value'],
    
    data () {
      return {
        makeYear: null,
        error: null,
        loading: false
      }
    },

    computed: {
      ...mapState([
        'user',
        'vehicles'
      ]),

      vehicleRef () {
        return firestore
          .collection('users').doc(this.user.uid)
          .collection('vehicles').doc(this.value.id)
      }
    },
    
    watch: {
      makeYear () {
        this.error = null
      }
    },

    methods: {
      async deleteVehicle () {
        if (parseInt(this.value.makeYear) === parseInt(this.makeYear)) {
          this.loading = true
          const promises = []

          // Delete photo
          if (this.value.photoPath) {
            promises.push(storage.ref().child(this.value.photoPath).delete())
          }

          // Delete vehicle doc
          promises.push(this.vehicleRef.delete())

          // Delete vehicle sub-collections
          let deleteSubcollection = (collectionName) => {
            let collection = this.vehicleRef.collection(collectionName)
            collection.get()
              .then(snapshot => {
                snapshot.forEach(doc => {
                  promises.push(collection.doc(doc.id).delete())
                })
              })
          }

          deleteSubcollection('expenses')
          deleteSubcollection('expensesAggregatedMonthly')
          deleteSubcollection('expensesAggregatedYearly')
          deleteSubcollection('notes')

          // Delete all
          await Promise.all(promises)

          // Update local vehilcles data
          delete this.vehicles[this.value.id]
          this.$store.commit('setVehicles', this.vehicles)

          this.loading = false
          this.$emit('input', null)
        } else {
          // Do something to say the given makeYear is wrong
          this.error = 'Указан неверный год.'
        }
      }
    }
  }
</script>
