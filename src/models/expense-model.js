class ExpenseModel {
  constructor (value) {
    this.json = value
  }

  get json () {
    return {
      type: parseInt(this.type),
      amount: parseFloat(this.amount),
      title: this.title,
      description: this.description,
      date: this.date,
      mileage: parseInt(this.mileage)
    }
  }

  set json (value) {
    if (value) {
      this.type = parseInt(value.type)
      this.amount = parseFloat(value.amount)
      this.title = value.title
      this.description = value.description
      this.date = this.parseDate(value.date)
      this.mileage = parseInt(value.mileage)
    }
  }

  static getTypeEnum () {
    return [
      { value: 1, label: 'Обслуживание' },
      { value: 2, label: 'Ремонт' },
      { value: 3, label: 'Тюнинг' },
      { value: 4, label: 'Аксессуары' },
      { value: 5, label: 'Топливо' }
    ]
  }

  parseDate (date) {
    if (!date) return null
    if (date instanceof Date) return date
    const [y, m, d] = date.split('-')
    return new Date(y, m - 1, d)
  }
}

export default ExpenseModel
