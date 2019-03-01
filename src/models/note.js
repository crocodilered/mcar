class NoteModel {
  constructor (json) {
    this.json = json
  }

  get json () {
    return {
      date: this.date,
      content: this.content
    }
  }

  set json (value) {
    if (value) {
      this.date = this.parseDate(value.date)
      this.content = value.content
    }
  }

  get parsedContent () {
    let parsed = this.content
    parsed = parsed
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
    return parsed
  }

  parseDate (date) {
    if (!date) {
      return null
    }
    if (date instanceof Date) {
      return date
    }
    if (date instanceof String) {
      const [y, m, d] = date.split('-')
      return new Date(y, m - 1, d)
    }
    if(typeof date === 'object' && date.toDate) {
      return date.toDate()
    }
  }
}

export default NoteModel
