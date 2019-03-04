import AbstractModel from './abstract'

class ExpenseModel extends AbstractModel {
  constructor (value) {
    super()
    this.json = value
  }

  get json () {
    return {
      type: this.type,
      amount: this.amount,
      title: this.title,
      description: this.description,
      date: this.date,
      mileage: this.mileage
    }
  }

  set json (value) {
    if (value) {
      this.type = parseInt(value.type)
      this.amount = parseFloat(value.amount)
      this.title = value.title
      this.description = value.description
      this.date = AbstractModel.parseDate(value.date)
      this.mileage = parseInt(value.mileage)
    }
  }

  static getTypesEnum () {
    return [
      { id: 1, label: 'Обслуживание' },
      { id: 2, label: 'Ремонт' },
      { id: 3, label: 'Тюнинг' },
      { id: 4, label: 'Аксессуары' },
      { id: 5, label: 'Топливо' }
    ]
  }
}

export default ExpenseModel
