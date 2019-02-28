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
      <mdc-button
        @click="$store.commit('setVehicleManageTab', 'expense')"
        icon="add"
      >
        Добавить
      </mdc-button>
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
  import MdcButton from '@/components/mdc/button'

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
      const ref = firestore
        .collection('users').doc(this.$store.state.user.uid)
        .collection('vehicles').doc(this.vehicle.id)
        .collection('expensesAggregatedYearly')
      const snapshot = await ref.get()
      this.availableYearsList = (snapshot.empty)
        ? []
        : snapshot.docs
          .map(doc => doc.data().date.toDate().getFullYear())
          .reverse()
      this.year = this.availableYearsList.length > 0 ? this.availableYearsList[0] : 0
    },

    /**
     * Load data of given year for chart.
     */
    async loadReport () {
      if (this.year && this.vehicle) {
        const amounts = {}
        const dateFrom = new Date((new Date(this.year, 0)).getTime() - 1)
        const dateTo = new Date(this.year + 1, 0)

        this.loading = true
        const querySnapshot = await firestore
          .collection('users').doc(this.$store.state.user.uid)
          .collection('vehicles').doc(this.vehicle.id)
          .collection('expensesAggregatedMonthly')
          .where('date', '>', dateFrom)
          .where('date', '<', dateTo)
          .get()
        this.loading = false

        querySnapshot.forEach(doc => {
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
    components: { ProgressCircular, MdcButton, Chart },
    name: 'VehicleReport',
    props: ['vehicle'],
    data,
    watch,
    methods,

    async created () {
      if (this.vehicle) {
        await this.loadAvailableYearsList()
        if (this.year) {
          this.loadReport()
        }
      }
    }
  }
</script>
