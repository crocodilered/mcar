<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <h1>Профиль</h1>

        <h3>Изменить пароль</h3>

        <h3>Ваши автомобили</h3>
        <div class="mdc-layout-grid__inner">
          <div class="
            mdc-layout-grid__cell
            mdc-layout-grid__cell--span-6
          "
            v-for="(o, i) in vehicles"
            :key="`vehicle-card-${i}`"
          >
            <div class="mdc-card mdc-card--outlined">
              <div clas="mdc-card__primary-action">
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
                  <mdc-icon-button @click="$router.push(`/vehicle/${o.id}/update`)">
                    edit
                  </mdc-icon-button>
                  <mdc-icon-button @click="$router.push(`/vehicle/${o.id}/delete`)">
                    delete
                  </mdc-icon-button>
                </div>
              </div>
            </div>
          </div>
          <div class="
            mdc-layout-grid__cell
            mdc-layout-grid__cell--span-6
          ">
            <mdc-button outlined @click="$router.push('/vehicle/create')">
              Добавить автомобиль
            </mdc-button>
          </div>
        </div>

        <h3>Выйти из приложения</h3>
        <p>Все ваши данные будут сохранены.</p>
        <mdc-button
          outlined
          @click="doLogout"
        >
          Выйти
        </mdc-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { auth } from '@/config'
  import MdcButton from '@/components/mdc/button'
  import MdcIconButton from '@/components/mdc/icon-button'

  export default {
    components: { MdcButton, MdcIconButton },
    name: 'Profile',

    data () {
      return {
        loading: false
      }
    },
    
    computed: {
      ...mapState(['user', 'vehicles'])
    },

    methods: {
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
