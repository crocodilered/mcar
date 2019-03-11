<template>
  <form @submit.prevent="createExpense">
    <mdc-select
      label="Тип"
      :options="expenseTypeEnum.map(item => {
        return {
          value: item.id,
          label: item.label
        }
      })"
      v-model="expense.type"
    />

    <mdc-textfield
      label="Краткое описание"
      type="text"
      v-model="expense.title"
      maxlength="200"
      required
    />

    <mdc-textfield
      label="Сумма"
      type="number"
      v-model="expense.amount"
      min="1"
      required
    />

    <date-picker
      label="Дата"
      v-model="expense.date"
      :min="minDateStr"
      :max="maxDateStr"
      required
    />

    <mdc-textfield
      label="Пробег"
      type="number"
      v-model="expense.mileage"
      min="1"
    />

    <mdc-submit :loading="loading">
      Сохранить
    </mdc-submit>

    <mdc-snackbar
      v-model="showSnackbar"
      message="Данные о расходах сохранены."
    />
  </form>
</template>

<script>
  import { firestore } from '@/config'
  import ExpenseModel from '@/libs/models/expense'
  import DatePicker from '@/components/common/date-picker'
  import InputBehavior from '@/libs/input-behavior'

  import MdcSubmit from '@/components/mdc/submit'
  import MdcSelect from '@/components/mdc/select'
  import MdcTextfield from '@/components/mdc/textfield'
  import MdcSnackbar from '@/components/mdc/snackbar'

  const data = function () {
    return {
      loading: false,
      showSnackbar: false,

      expenseTypeEnum: ExpenseModel.getTypesEnum(),

      // Form fields
      titleBhv: new InputBehavior(value => {
        return (value === '')
          ? 'Обязательное поле.'
          : ''
      }),

      amountBhv: new InputBehavior(value => {
        if (value === '') {
          return 'Обязательное поле.'
        } else if (value <= 0) {
          return 'Не может быть меньше или равно 0.'
        }
        return ''
      }),

      mileageBhv: new InputBehavior(value => {
        if (value === '') {
          return 'Обязательное поле.'
        } else if (value <= 0) {
          return 'Не может быть меньше или равно 0.'
        }
        return ''
      }),

      dateBhv: new InputBehavior(value => {
        return (value instanceof Date && !isNaN(value))
          ? ''
          : 'Обязательное поле.'
      }),

      expense: this.getEmptyExpense()
    }
  }

  const computed = {
    minDateStr () {
      return this.vehicle ? `${this.vehicle.makeYear}-01-01` : ''
    },

    maxDateStr () {
      const d = new Date()
      return d.toISOString().substr(0, 10)
    },

    aggregationMonth () {
      if (this.expense) {
        const d = this.expense.date
        return new Date(d.getFullYear(), d.getMonth(), 1)
      } else {
        return null
      }
    },

    aggregationYear () {
      return this.expense
        ? new Date(this.expense.date.getFullYear(), 0, 1)
        : null
    }
  }

  const methods = {
    getEmptyExpense () {
      return new ExpenseModel({
        type: 1,
        amount: null,
        title: null,
        description: null,
        date: new Date(),
        mileage: null
      })
    },

    validateForm () {
      this.titleBhv.test(this.expense.title)
      this.amountBhv.test(this.expense.amount)
      // this.mileageBhv.test(this.expense.mileage)
      this.dateBhv.test(this.expense.date)

      return this.titleBhv.bool &&
        this.amountBhv.bool &&
        // this.mileageBhv.bool &&
        this.dateBhv.bool
    },

    createExpense () {
      if (this.validateForm()) {
        this.loading = true
        this.runTransaction()
          .then(() => {
            this.loading = false
            this.expense = this.getEmptyExpense()
            this.showSnackbar = true
          })
          .catch(() => {
            // Got error while expense transaction running.'
          })
      }
    },

    async runTransaction () {
      if (this.vehicle && this.expense) {
        const vehicleRef = firestore
          .collection('users').doc(this.$store.state.user.uid)
          .collection('vehicles').doc(this.vehicle.id)

        const expenseRef = vehicleRef
          .collection('expenses').doc()

        /**
         * Prepare aggregation data (monthly && yearly)
         */
        const buildAggregation = async function (vehicleRef, type, date) {
          const key = date.getTime().toString()
          const ref = vehicleRef.collection(`expensesAggregated${type}`).doc(key)
          const snapshot = await ref.get()

          // Init data
          // Applpy existing data if they do exist
          // or init new instance otherwise
          let data = (snapshot.exists)
            ? snapshot.data()
            : { date }

          // Inject to data new expense type if needed
          if (!data[this.expense.type]) data[this.expense.type] = { amount: 0 }

          // Calculate new aggregation value
          data[this.expense.type].amount += parseFloat(this.expense.amount)

          return { ref, data }
        }
        // Prepare monthly and yearly aggregations data
        const aggregationM = await buildAggregation.call(this, vehicleRef, 'Monthly', this.aggregationMonth)
        const aggregationY = await buildAggregation.call(this, vehicleRef, 'Yearly', this.aggregationYear)

        // Run transaction
        return firestore.runTransaction(transaction => {
          return transaction.get(vehicleRef)
            .then(() => {
              transaction.update(vehicleRef, { updated: new Date() })
              transaction.set(expenseRef, { ...this.expense.json, created: new Date() })
              transaction.set(aggregationM.ref, aggregationM.data, { merge: true })
              transaction.set(aggregationY.ref, aggregationY.data, { merge: true })
            })
        })
      }
    }
  }

  export default {
    components: {
      MdcSubmit,
      MdcSelect,
      MdcTextfield,
      DatePicker,
      MdcSnackbar
    },
    name: 'VehicleExpense',
    props: ['vehicle'],
    data,
    computed,
    methods
  }
</script>
