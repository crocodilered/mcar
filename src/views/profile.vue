<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell--main">
        <h1>Профиль</h1>

        <h3>Ваши автомобили</h3>
        <div class="mdc-layout-grid__inner">
          <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
            v-for="(o, i) in vehicles"
            :key="`vehicle-card-${i}`"
          >
            <div class="mdc-card mdc-card--outlined">
              <div clas="mdc-card__primary-action"
                @click="$router.push(`/vehicle/${o.id}`)"
              >
                <div style="padding: 1rem 1rem 0 1rem">
                  <p style="
                    margin: 0;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  ">
                    <big style="x-ovelay: hidden;">{{ o.title }}</big><br>
                    {{ o.makeYear }} г.в.
                  </p>
                </div>
              </div>
              <div class="mdc-card__actions" style="padding-top: 0;">
                <div class="mdc-card__action-buttons">
                  <mdc-button plain @click="$router.push(`/vehicle/${o.id}`)">
                    Расходы
                  </mdc-button>
                </div>
                <div class="mdc-card__action-icons">
                  <mdc-icon-button @click="showVehicleProperties(o)">
                    edit
                  </mdc-icon-button>
                  <mdc-icon-button @click="showVehicleDelete(o)">
                    delete
                  </mdc-icon-button>
                </div>
              </div>
            </div>
          </div>
          <div class="
            mdc-layout-grid__cell
            mdc-layout-grid__cell--span-12
          ">
            <mdc-button
              icon="add"
              @click="showVehicleProperties()"
              outlined
            >
              Добавить автомобиль
            </mdc-button>
          </div>
        </div>

        <h3>Изменить пароль</h3>

        <h3>Выйти из приложения</h3>
        <p>Все ваши данные будут сохранены.</p>
        <mdc-button
          @click="doLogout"
          icon="exit_to_app"
          outlined
        >
          Выйти
        </mdc-button>
      </div>
    </div>

    <transition name="fade">
      <overlay
        v-if="vehicleToSave"
        @close="vehicleToSave = null"
        :title="vehicleToSave.id ? 'Редактирование авто' : 'Добавление авто'"
      >
        <vehicle-properties v-model="vehicleToSave"/>
      </overlay>
    </transition>

    <transition name="fade">
      <overlay
        v-if="vehicleToDelete"
        @close="vehicleToDelete = null"
        title="Удаление авто"
      >
        <vehicle-delete v-model="vehicleToDelete"/>
      </overlay>
    </transition>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { auth } from '@/config'
  import Overlay from '@/components/common/overlay'
  import MdcButton from '@/components/mdc/button'
  import MdcIconButton from '@/components/mdc/icon-button'

  import VehicleModel from '@/libs/models/vehicle'
  import VehicleProperties from '@/components/vehicle/properties'
  import VehicleDelete from '@/components/vehicle/delete'

  export default {
    components: {
      MdcButton,
      MdcIconButton,
      Overlay,
      VehicleProperties,
      VehicleDelete
    },

    name: 'Profile',

    data () {
      return {
        vehicleToSave: undefined,
        vehicleToDelete: undefined,
        loading: false
      }
    },
    
    computed: {
      ...mapState(['user', 'vehicles'])
    },

    methods: {
      showVehicleProperties (vehicle) {
        if (vehicle) {
          this.vehicleToSave = vehicle
        } else {
          this.vehicleToSave = new VehicleModel()
          // this.vehicleToSave.setRandomPhoto()
        }
      },

      showVehicleDelete (vehicle) {
        this.vehicleToDelete = vehicle
      },

      async doLogout () {
        this.loading = true
        await auth.signOut()
        this.$store.commit('setUser', null)
        this.$store.commit('setCurrentVehicle', null)
        this.$store.commit('setVehicles', null)
        this.loading = false
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/variables.scss";
  @import "@material/card/mdc-card";
</style>
