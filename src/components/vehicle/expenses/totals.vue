<template>
  <div>
    <div v-if="list">
      <h1>{{ year }} год</h1>
      <table class="mdc-table mdc-table--big" :key="`data-${year}`">
        <tr
          v-for="(o, i) in list"
          :key="`item-${i}`"
          @click="$emit('show-complete-list', o)"
        >
          <td>{{ o.label }}</td>
          <td>{{ o.amount }} ₽</td>
        </tr>
      </table>
    </div>
    <progress-circular
      v-if="list === null"
    />
  </div>
</template>

<script>
  import { firestore } from '@/config'
  import ExpenseModel from '@/libs/models/expense'
  import ProgressCircular from '@/components/common/progress-circular'

  export default {
    name: 'ExpensesTotals',
    props: ['vehicle', 'year'],

    components: { ProgressCircular },

    data () {
      return {
        list: undefined
      }
    },

    watch: {
      vehicle () {
        this.loadList()
      },
      year () {
        this.loadList()
      }
    },

    methods: {
      async loadList () {
        if (!this.vehicle || !this.year) return

        this.list = null

        const snapshot = await firestore
          .collection('users').doc(this.$store.state.user.uid)
          .collection('vehicles').doc(this.vehicle.id)
          .collection('expensesAggregatedYearly')
          .where('date', '==', new Date(this.year, 0, 1))
          .get()

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data()
          this.list = ExpenseModel.getTypesEnum().map(item => {
            item.amount = (data[item.id] && data[item.id].amount)
              ? data[item.id].amount
              : 0
            return item
          })
        }
      }
    },

    created () {
      this.loadList()
    }
  }
</script>
