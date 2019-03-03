<template>
  <form @submit.prevent="saveVehicle">
    <mdc-textfield
      label="Марка / модель"
      type="text"
      v-model="vehicleTitle"
      placeholder="Mercedes Benz S600, к примеру"
      required
    />

    <mdc-textfield
      label="Год выпуска"
      type="number"
      v-model="vehicle.makeYear"
      required
    />

    <!--div
      v-if="false"
      label="Фотография"
    >
      <canvas
        ref="canvas"
        width="600"
        height="600"
        style="display: none;"
      ></canvas>
      <div
        class="photo"
        v-bind:style="{ 'backgroundImage': 'url(' + (photoUrl || vehicle.photoUrl) + ')' }"
        @click="selectPhoto"
      >
        <div>
          <span class="material-icons">cloud_upload</span>
        </div>
      </div>
      <input
        type="file"
        style="display: none"
        ref="inputPhoto"
        accept="image/*"
        @change="loadPhoto"
      />
    </div-->

    <mdc-button :loading="loading">
      Сохранить
    </mdc-button>
  </form>
</template>

<script>
  import { storage, firestore } from '@/config'
  import MdcTextfield from '@/components/mdc/textfield'
  import MdcButton from '@/components/mdc/button'

  const computed = {
    canvas () {
      return this.$refs.canvas
    }
  }

  const data = function () {
    return {
      vehicleTitle: this.vehicle.title || '',
      photoUrl: null,
      photoFile: null,
      loading: false
    }
  }

  const watch = {
    vehicle: function () {
      this.photoUrl = null
    }
  }

  const methods = {
    selectPhoto () {
      this.$refs.inputPhoto.click()
    },

    loadPhoto (event) {
      const files = event.target.files
      if (files[0] !== undefined) {
        if (files[0].name.lastIndexOf('.') <= 0) return
        const fr = new FileReader()
        fr.addEventListener('load', () => {
          this.photoFile = files[0]

          // Populate canvas
          const context = this.canvas.getContext('2d')
          const image = new Image()
          image.src = fr.result
          image.onload = () => {
            let sourceX, sourceY, sourceWidth, sourceHeight
            if (image.width > image.height) {
              sourceX = (image.width - image.height) / 2
              sourceY = 0
              sourceWidth = image.height
              sourceHeight = image.height
            } else {
              sourceX = 0
              sourceY = (image.height - image.width) / 2
              sourceWidth = image.width
              sourceHeight = image.width
            }

            context.drawImage(image,
              sourceX, sourceY, sourceWidth, sourceHeight,
              0, 0, this.canvas.width, this.canvas.height)

            this.photoUrl = this.canvas.toDataURL()
          }
        })
        fr.readAsDataURL(files[0])
      } else {
        this.photoFile = null
        this.photoUrl = null
      }
    },

    savePhoto () {
      return new Promise((resolve, reject) => {
        if (this.photoFile && this.vehicle && this.vehicle.id) {
          const storageRef = storage.ref()

          // Delete prev photo
          if (this.vehicle.photoPath) {
            storageRef.child(this.vehicle.photoPath).delete()
              .catch(() => {
                // Old photo delete error
              })
          }

          // Upload photo to server
          const ts = (new Date()).getTime()
          const name = `${ts}_${this.vehicle.id}.jpg`
          const path = `vehicles/photos/${name}`

          this.canvas.toBlob(blob => {
            storageRef.child(path).put(blob)
              .then(() => {
                this.vehicle.photoPath = path
                storageRef.child(path).getDownloadURL()
                  .then(url => {
                    this.vehicle.photoUrl = url
                    // Finalize
                    this.photoUrl = null
                    this.photoFile = null
                    resolve()
                  })
              })
              .catch(error => reject(error))
          }, 'image/jpeg', 0.75)
        } else {
          resolve()
        }
      })
    },

    async saveVehicle () {
      if (this.vehicle) {
        const userUid = this.$store.state.user.uid
        const collRef = firestore.collection('users').doc(userUid).collection('vehicles')
        let emit, appendixData, options

        this.loading = true
        if (this.vehicle.id) {
          emit = 'update'
          appendixData = { updated: new Date() }
          options = { merge: true }
        } else {
          emit = 'create'
          appendixData = { updated: new Date(), created: new Date() }
          let vehicleRef = collRef.doc()
          this.vehicle.id = vehicleRef.id
        }

        await this.savePhoto()

        this.vehicle.title = this.vehicleTitle
        collRef.doc(this.vehicle.id).set({ ...this.vehicle.json, ...appendixData }, options)
          .then(() => {
            this.$emit(emit)
            // Update local cache
            const vehicles = this.$store.state.vehicles || {}
            vehicles[this.vehicle.id] = this.vehicle
            this.$store.dispatch('loadVehicles', vehicles)
            this.$store.dispatch('selectCurrentVehicle', this.vehicle.id)
          })
          .catch(() => {
            // Show error
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }

  export default {
    name: 'VehicleProperties',
    components: { MdcButton, MdcTextfield },
    props: ['vehicle'],
    computed,
    data,
    watch,
    methods
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/variables.scss';

  .photo {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 300px;
    height: 300px;
    cursor: pointer;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    
    .material-icons {
      font-size: 43px;
      margin: 0 10px;
      padding: 10px;
      border-radius: 10px;
      color: $mdc-theme-primary;
      background: rgba(255, 255, 255, .6);
      opacity: 1;
    }
  }
</style>
