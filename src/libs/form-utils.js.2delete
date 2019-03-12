const rules = {

  required: value => {
    if (value && value !== '') {
      return true
    } else {
      return false
    }
  },

  email: value => {
    const re = /.+@.+\..{2,6}$/
    return re.test(String(value).toLowerCase())
  },

  password: value => {
    return (value && value.length > 5) || 'Минимум 6 символов.'
  },

  int: value => {
    const re = /^([0-9]+)$/
    return !!re.test(String(value).toLowerCase()) || 'Должно быть целое число.'
  },

  year: value => {
    const isDigits = /^([0-9]+)$/.test(value)
    const currentYear = new Date().getFullYear()
    const valueYear = parseInt(value)
    return (isDigits && valueYear > 1950 && valueYear <= currentYear) || 'Укажите год.'
  }

}

export default { rules }
