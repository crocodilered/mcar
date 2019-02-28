class VehicleModel {
  constructor (id, title, makeYear, mileage, photoPath, photoUrl) {
    this.id = id
    this.title = title
    this.makeYear = makeYear ? parseInt(makeYear) : null
    this.mileage = mileage ? parseInt(mileage) : null
    this.photoPath = photoPath // Path to photo stored in firebase
    this.photoUrl = photoUrl
  }

  setRandomPhoto () {
    // TODO: Remove Webpack's shit
    const i = Math.ceil(Math.random() * 6)
    const images = require.context('@/assets/', false, /\.png$/)
    this.photoUrl = images(`./vehicle-icon-${i}.png`)
    this.photoPath = null
  }

  get json () {
    return {
      title: this.title,
      makeYear: parseInt(this.makeYear),
      mileage: parseInt(this.mileage),
      photoPath: this.photoPath,
      photoUrl: this.photoUrl
    }
  }

  set json (value) {
    if (value) {
      this.title = value.title
      this.makeYear = parseInt(value.makeYear)
      this.mileage = parseInt(value.mileage)
      this.photoPath = value.photoPath
      this.photoUrl = value.photoUrl
    }
  }
}

export default VehicleModel
