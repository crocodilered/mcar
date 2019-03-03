<template>
  <b-container>
    <h1>Выход</h1>
    <p>Уже уходите? Возвращайтесь!</p>

    <form @submit.prevent="doLogout">
      <mdc-submit :loading="loading">
        Выйти
      </mdc-submit>
    </form>

  </b-container>
</template>

<script>
  import { auth } from '@/config'
  import MdcSubmit from '@/components/mdc/submit'

  const data = function () {
    return {
      loading: false,
      error: null,
      fallback: '/'
    }
  }

  const methods = {
    doLogout () {
      this.error = null
      this.loading = true
      auth.signOut()
        .then(() => this.$router.push(this.fallback))
        .catch((error) => {
          this.error = error.code
        })
        .finally(() => {
          this.loading = false
        })
    }
  }

  export default {
    name: 'AuthLogout',
    components: { MdcSubmit },
    data,
    methods,
    created () {
      if (!this.$store.getters.isAuthenticated) {
        this.$router.push(this.fallback)
      }
    }
  }
</script>
