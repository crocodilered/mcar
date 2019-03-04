class AbstractModel {
  constructor () {
    // Empty one
  }

  static parseUserInput (userInput) {
    return userInput
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
  }

  /**
   * Parse obj as javascript Date
   * @param {*} obj 
   */
  static parseDate (obj) {
    if (!obj) {
      return null
    }
    if (obj instanceof Date) {
      return obj
    }
    if (obj instanceof String) {
      const [y, m, d] = obj.split('-')
      return new Date(y, m - 1, d)
    }
    if (typeof obj === 'object' && obj.toDate) {
      return obj.toDate()
    }
  }
}

export default AbstractModel
