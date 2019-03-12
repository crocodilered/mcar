<template>
  <div>
    <template v-if="mode === MODE_GENERAL_LIST || mode === MODE_COMPLETE_LIST">
      <!-- FAB BUTTON -->
      <button
        class="mdc-fab app-fab--absolute"
        aria-label="Добавить запись"
        title="Добавить запись"
        @click="showForm"
      >
        <span class="mdc-fab__icon material-icons">add</span>
      </button>
      <!-- LOADING -->
      <progress-circular v-if="loading"/>

      <template v-else>
        <!-- LIST GENERAL -->
        <transition name="fade">
          <div v-if="mode === MODE_GENERAL_LIST">
            <years-chips
              v-if="years.length > 1"
              :years="years"
              v-model="year"
            />
            <totals-list
              :year="year"
              :vehicle="vehicle"
              @show-complete-list="showCompleteList"
            />
          </div>
        </transition>
        <!-- LIST COMPLETE -->
        <transition name="fade">
          <full-list
            v-if="mode === MODE_COMPLETE_LIST"
            :year="year"
            :vehicle="vehicle"
            :expenseType="expenseType"
            @show-general-list="showGeneralList"
          />
        </transition>
      </template>
    </template>
    <!-- FORM -->
    <transition name="fade">
      <overlay
        v-if="mode === MODE_FORM"
        title="Новая запись"
        @close="showGeneralList"
      >
        <forma :vehicle="vehicle"/>
      </overlay>
    </transition>
  </div>
</template>

<script>
  import { firestore } from '@/config'
  import ProgressCircular from '@/components/common/progress-circular'
  import Overlay from '@/components/common/overlay'
  import Forma from './forma'
  import TotalsList from './totals-list'
  import FullList from './full-list'
  import YearsChips from './years-chips'

  export default {
    components: {
      TotalsList,
      FullList,
      YearsChips,
      Overlay,
      ProgressCircular,
      Forma
    },

    name: 'VehicleExpenses',
    props: ['vehicle'],

    data () {
      return {
        MODE_GENERAL_LIST: 'general-list',
        MODE_COMPLETE_LIST: 'complete-list',
        MODE_FORM: 'form',
        mode: 'general-list',
        years: undefined,
        year: undefined,
        form: undefined,
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
      },

      showGeneralList () {
        this.mode = this.MODE_GENERAL_LIST
      },

      showCompleteList (expenseType) {
        this.expenseType = expenseType
        this.mode = this.MODE_COMPLETE_LIST
      },

      showForm () {
        this.mode = this.MODE_FORM
      }
    },

    async created () {
      this.loading = true
      await this.loadYears()
      this.year = this.years[0]
      this.loading = false
    }
  }
</script>

<style lang="scss" scoped>
  @import "@material/fab/mdc-fab";
</style>
