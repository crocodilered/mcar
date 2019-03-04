<template>
  <div class="tab">
    <chart
      v-if="!loading && report"
      :report="report"
    />
    <div
      v-if="!loading && !report"
      style="margin-top: 20%; text-align: center;"
    >
      <p style="margin-bottom: 2em;"><big>Данных пока нет</big>,<br> но вы можете добавить первую запись.</p>
      <mdc-submit
        @click="$store.commit('setVehicleManageTab', 'expense')"
        icon="add"
      >
        Добавить
      </mdc-submit>
    </div>

    <div v-if="loading">
      <progress-circular/>
    </div>
  </div>
</template>

<script>
  import { firestore } from '@/config'
  import Chart from '@/components/common/chart'
  import ProgressCircular from '@/components/common/progress-circular'
  import MdcSubmit from '@/components/mdc/submit'

  const data = function () {
    return {
      loading: true,
      report: null,
      year: null,
      availableYearsList: null
    }
  }

  const watch = {
    vehicle () {
      this.loadReport()
    },

    year () {
      this.loadReport()
    }
  }

  const methods = {
    /**
     * Load available years from database.
     */
    async loadAvailableYearsList () {
      const snapshot = await this.vehicleRef
        .collection('expensesAggregatedYearly')
        .get()
      this.availableYearsList = snapshot.empty
        ? null
        : snapshot.docs
          .map(doc => doc.data().date.toDate().getFullYear())
          .reverse()
    },

    /**
     * Load data of given year for chart.
     */
    async loadReport () {
      if (this.year && this.vehicle) {
        const amounts = {}
        const dateFrom = new Date((new Date(this.year, 0)).getTime() - 1)
        const dateTo = new Date(this.year + 1, 0)

        const snapshot = await this.vehicleRef
          .collection('expensesAggregatedMonthly')
          .where('date', '>', dateFrom)
          .where('date', '<', dateTo)
          .get()

        snapshot.forEach(doc => {
          const data = doc.data()
          for (let key in data) {
            if (key !== 'date') {
              if (!amounts[key]) amounts[key] = 0
              amounts[key] += data[key].amount
            }
          }
        })

        this.report = (Object.keys(amounts).length > 0) ? { amounts } : null
      }
    }
  }

  export default {
    components: { ProgressCircular, MdcSubmit, Chart },
    name: 'VehicleReport',
    props: ['vehicle'],
    data,
    watch,
    methods,

    computed: {
      vehicleRef () {
        return firestore
          .collection('users').doc(this.$store.state.user.uid)
          .collection('vehicles').doc(this.vehicle.id)
      }
    },

    async created () {
      // here loading flag is true
      if (this.vehicle) {
        await this.loadAvailableYearsList()
        if (this.availableYearsList) {
          this.year = this.availableYearsList[0]
          await this.loadReport()
        }
        this.loading = false
      }
    }
  }
</script>
