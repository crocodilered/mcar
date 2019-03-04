import AbstractModel from './abstract'

class NoteModel extends AbstractModel {
  constructor (json) {
    super()
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
      this.date = AbstractModel.parseDate(value.date)
      this.content = value.content
    }
  }

  get parsedContent () {
    return AbstractModel.parseUserInput(this.content)
  }
}

export default NoteModel
