<template>
  <div
    v-if="list"
    class="list"
  >
    <ul class="mdc-list mdc-list--two-line">
      <li
        v-for="(o, i) in list"
        :key="`item-${i}`"
        class="mdc-list-item"
        @click="showExpense(o)"
      >
        <span class="mdc-list-item__text">
          <span class="mdc-list-item__primary-text">{{ o.label }}</span>
          <span class="mdc-list-item__secondary-text">{{ o.amount }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  import { firestore } from '@/config'
  import ExpenseModel from '@/libs/models/expense'

  export default {
    name: 'VehicleExpensesYearly',
    props: ['vehicle', 'year'],

    data () {
      return {
        list: undefined
      }
    },

    async created () {
      // Load consolidated list for given year
      const list = {}
      const date = new Date(this.year, 0, 1)

      const snapshot = await firestore
        .collection('users').doc(this.$store.state.user.uid)
        .collection('vehicles').doc(this.vehicle.id)
        .collection('expensesAggregatedYearly')
        .where('date', '==', date)
        .get()

      snapshot.forEach(doc => {
        const data = doc.data()
        for (let key in data) {
          if (key !== 'date') {
            if (!list[key]) list[key] = 0
            list[key] += data[key].amount
          }
        }
      })

      this.list = ExpenseModel.getTypesEnum().map(item => {
        item.amount = list[item.value] || 0
        return item
      })
    }
  }
</script>
