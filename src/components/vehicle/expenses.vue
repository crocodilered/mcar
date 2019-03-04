<template>
  <div>
    <template v-if="mode === MODE_LIST">
      <!-- FAB BUTTON -->
      <button
        class="mdc-fab app-fab--absolute"
        aria-label="Добавить заметку"
        title="Добавить заметку"
        @click="showForm"
      >
        <span class="mdc-fab__icon material-icons">add</span>
      </button>
      <!-- LOADING -->
      <progress-circular v-if="loading"/>
      <!-- LIST YEARLY -->
      <template v-else>
        <expenses-yeary
          v-if="year && vehicle"
          :year="year"
          :vehicle="vehicle"
        />
      </template>
    </template>
    <!-- FORM -->
    <overlay
      v-if="mode === MODE_FORM"
      title="Новая запись"
      @close="showList"
    >
      <expense-form :vehicle="vehicle"/>
    </overlay>
    <!-- ITEM -->
    <overlay
      v-if="mode === MODE_EXPENSE"
      :title="expense.date"
      @close="showList"
    >
      <p v-html="expense.title"/>
    </overlay>
  </div>
</template>

<script>
  import { firestore } from '@/config'
  import ProgressCircular from '@/components/common/progress-circular'
  import Overlay from '@/components/common/overlay'
  import ExpenseForm from './expense-form'
  import ExpensesYeary from './expenses-yearly'

  export default {
    components: {
      ExpensesYeary,
      Overlay,
      ProgressCircular,
      ExpenseForm
    },

    name: 'VehicleExpenses',
    props: ['vehicle'],

    data () {
      return {
        MODE_LIST: 'list',
        MODE_FORM: 'form',
        MODE_EXPENSE: 'expense',
        mode: 'list',
        yearsList: null,
        expensesList: null,
        year: null,
        expense: null,
        form: null,
        loading: false
      }
    },

    watch: {
      vehicle () {
        this.loadExpenses()
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
      /**
       * Load available years from database.
       */
      async loadYears () {
        const snapshot = await this.vehicleRef
          .collection('expensesAggregatedYearly')
          .get()
        this.yearsList = snapshot.empty
          ? null
          : snapshot.docs
            .map(doc => doc.data().date.toDate().getFullYear())
            .reverse()
      },

      /**
       * Load expenses by year
       */
      async loadYearExpenses () {
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

        this.expensesList = (Object.keys(amounts).length > 0) ? { amounts } : null
      },

      showList () {
        this.mode = this.MODE_LIST
      },

      showForm () {
        this.mode = this.MODE_FORM
      },

      showExpense (expense) {
        this.expense = expense
        this.mode = this.MODE_EXPENSE
      }
    },

    async created () {
      this.loading = true
      await this.loadYears()
      if (this.yearsList) {
        this.year = this.yearsList[0]
        await this.loadYearExpenses()
      }
      this.loading = false
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/variables.scss";
  @import "@material/fab/mdc-fab";

  .mdc-list li {
    cursor: pointer;
  }
</style>
