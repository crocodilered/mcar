<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <h1>Профиль</h1>
        <h4 v-if="user">{{ user.email }}</h4>
        <hr/>
        <form>
            <h5>Изменить пароль</h5>
        </form>
        <hr/>
        <mdc-submit :loding="loading" @click="doLogout">
          Выйти
        </mdc-submit>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import router from '@/router'
  import { auth } from '@/config'
  import MdcSubmit from '@/components/mdc/submit'

  const data = function () {
    return {
      loading: false,
      error: 0
    }
  }

  const computed = {
    ...mapState(['user', 'vehicles'])
  }

  const methods = {
    async doLogout () {
      this.loading = true
      await auth.signOut()
      this.$store.commit('setUser', null)
      this.$store.commit('setCurrentVehicle', null)
      this.$store.commit('setVehicles', null)
      this.loading = false
      router.push('/')
    }
  }

  export default {
    components: { MdcSubmit },
    name: 'Profile',
    data,
    computed,
    methods
  }
</script>
