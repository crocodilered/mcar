<template>
  <div
    v-if="list"
  >
    <mdc-icon-button
      @click="$emit('show-general-list')"
      title="Закрыть"
    >
      arrow_back
    </mdc-icon-button>

    <h1>
      {{ year }}
      <small>/ {{ expenseType.label }}</small>
    </h1>

    <table class="mdc-table">
      <tr
        v-for="(o, i) in list"
        :key="`item-${i}`"
        @click="showDetails(o)"
      >
        <td>{{ o.title }}</td>
        <td>{{ o.amount }} ₽</td>
      </tr>
    </table>

    <transition name="fade">
      <overlay
        v-if="details"
        :title="details.title"
        @close="details = null"
      >
        <dl>
          <dt>Сумма</dt>
          <dd>{{ details.amount }} ₽</dd>

          <dt>Дата</dt>
          <dd>{{ details.date.toDate().toLocaleDateString() }}</dd>

          <dt>Пробег</dt>
          <dd>{{ details.mileage ? `${details.mileage} км.` : '—' }}</dd>
        </dl>
      </overlay>
    </transition>
  </div>
</template>

<script>
  import { firestore } from '@/config'
  import MdcIconButton from '@/components/mdc/icon-button'
  import ExpenseModel from '@/libs/models/expense'
  import Overlay from '@/components/common/overlay'

  export default {
    name: 'FullList',
    props: ['vehicle', 'year', 'expenseType'],
    components: { Overlay, MdcIconButton },

    data () {
      return {
        list: undefined,
        details: undefined
      }
    },

    methods: {
      showDetails (expense) {
        this.details = expense
      }
    },

    async created () {
      // Load list for given year
      const dateFrom = new Date(this.year, 0, 1)
      const dateTo = new Date(this.year, 11, 31, 23, 59, 59)
      const snapshot = await firestore
        .collection('users').doc(this.$store.state.user.uid)
        .collection('vehicles').doc(this.vehicle.id)
        .collection('expenses')
        .where('type', '==', this.expenseType.id)
        .where('date', '>=', dateFrom)
        .where('date', '<=', dateTo)
        .get()

      this.list = snapshot.docs.map(doc => {
        return doc.data()
      })
    }
  }
</script>

<style lang="scss">
  dt {
    color: gray;
  }

  dd {
    font-size: 160%;
    margin: 0.4rem 0 1rem 0;
  }
</style>
