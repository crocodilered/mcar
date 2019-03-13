<template>
  <div>

    <!-- FAB BUTTON -->
    <button
      v-if="(mode === MODE_TOTALS || mode === MODE_LIST) && !showForm"
      class="mdc-fab app-fab--absolute"
      aria-label="Добавить запись"
      title="Добавить запись"
      @click="showForm = 1"
    >
      <span class="mdc-fab__icon material-icons">add</span>
    </button>

    <!-- LOADING -->
    <progress-circular
      v-if="(mode === MODE_TOTALS || mode === MODE_LIST) && loading"
    />

    <!-- YEARS CHIPS -->
    <expenses-years
      v-if="mode === MODE_TOTALS && years && years.length > 1"
      :years="years"
      v-model="year"
    />

    <!-- 'EMPTY' MESSAGE -->
    <div
      v-if="mode === MODE_TOTALS && !loading && !years"
      class="message-of-empty"
    />

    <!-- TOTALS -->
    <expenses-totals
      v-if="mode === MODE_TOTALS && year"
      :year="year"
      :vehicle="vehicle"
      @show-complete-list="showList"
    />

    <!-- LIST -->
    <expenses-list
      v-if="mode === MODE_LIST && expenseType"
      :year="year"
      :vehicle="vehicle"
      :expenseType="expenseType"
      @show-general-list="showTotals"
    />

    <!-- FORM -->
    <transition name="fade">
      <overlay
        v-if="showForm"
        title="Новая запись"
        @close="showForm = false"
      >
        <expenses-form :vehicle="vehicle"/>
      </overlay>
    </transition>

  </div>
</template>

<script>
  import { firestore } from '@/config'
  import ProgressCircular from '@/components/common/progress-circular'
  import Overlay from '@/components/common/overlay'

  import ExpensesYears from './expenses/years'
  import ExpensesTotals from './expenses/totals'
  import ExpensesList from './expenses/list'
  import ExpensesForm from './expenses/form'

  export default {
    components: {
      ExpensesTotals,
      ExpensesList,
      ExpensesYears,
      Overlay,
      ProgressCircular,
      ExpensesForm
    },

    name: 'VehicleExpenses',
    props: ['vehicle'],

    data () {
      return {
        MODE_TOTALS: 'totals',
        MODE_LIST: 'list',
        showForm: false,
        mode: 'totals',
        years: undefined,
        year: undefined,
        expenseType: undefined,
        loading: false
      }
    },

    watch: {
      vehicle () {
        this.loadYears()
      }
    },

    computed: {
      vehicleRef () {
        return firestore
          .collection('users').doc(this.$store.state.user.uid)
          .collection('vehicles').doc(this.vehicle.id)
      }
    },

    methods: {
      // Load available years from database.
      async loadYears () {
        const snapshot = await this.vehicleRef
          .collection('expensesAggregatedYearly')
          .get()

        this.years = snapshot.empty
          ? null
          : snapshot.docs
            .map(doc => doc.data().date.toDate().getFullYear())
            .reverse()

        this.year = this.years ? this.years[0] : null
      },

      showTotals () {
        this.mode = this.MODE_TOTALS
      },

      showList (expenseType) {
        this.expenseType = expenseType
        this.mode = this.MODE_LIST
      }
    },

    async created () {
      this.loading = true
      await this.loadYears()
      this.loading = false
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/variables.scss";
  @import "@material/fab/mdc-fab";
</style>
