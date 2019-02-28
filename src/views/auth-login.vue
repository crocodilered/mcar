<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <h1>Вход</h1>
        <p>Введите указанные при регистрации адрес электронной почты и пароль.</p>
        <form @submit.prevent="doLogin">
          <mdc-textfield
            label="Электронная почта"
            type="email"
            v-model="email"
            autocomplete="username"
            required
          />
          <mdc-textfield
            label="Пароль"
            type="password"
            v-model="password"
            autocomplete="current-password"
            required
          />
          <mdc-button :loading="loading">
            Войти
          </mdc-button>
          <mdc-snackbar
            v-model="errorSnackbar"
            v-bind="{ message: errorMessage }"
          />
        </form>
        <p style="margin-top: 3em;"><router-link to="/register">Зарегистрироваться</router-link></p>
        <p><router-link to="/reset-password">Восстановить пароль</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
  import { auth, authPersistence } from '@/config'
  import MdcButton from '@/components/mdc/button'
  import MdcTextfield from '@/components/mdc/textfield'
  import MdcSnackbar from '@/components/mdc/snackbar'

  const data = function () {
    return {
      email: null,
      password: null,
      loading: false,
      errorCode: null,
      errorSnackbar: false,
      fallback: '/profile'
    }
  }

  const computed = {
    errorMessage () {
      switch (this.errorCode) {
        case 'auth/user-not-found':
          return 'Пользователь не обнаружен.'
        case 'auth/wrong-password':
          return 'Введен неверный пароль.'
        case 'auth/too-many-requests':
          return 'Перебор с неудачными попытками входа, попробуйте еще раз через пару минут.'
        default:
          return 'Произошла ошибка (не распознанная).'
      }
    }
  }

  const watch = {
    errorCode (newVal) {
      if (newVal !== null && newVal !== undefined) {
        this.$nextTick(() => (this.errorSnackbar = true))
      }
    }
  }

  const methods = {
    doLogin () {
      this.errorCode = null
      this.loading = true
      auth
        .setPersistence(authPersistence.LOCAL)
        .then(() => auth.signInWithEmailAndPassword(this.email, this.password))
        .then(() => this.router.push(this.fallback))
        .catch((error) => {
          this.errorCode = error.code
        })
        .finally(() => {
          this.loading = false
        })
    }
  }

  export default {
    components: { MdcButton, MdcTextfield, MdcSnackbar },
    name: 'AuthLogin',
    data,
    computed,
    watch,
    methods,

    created () {
      if (this.$store.getters.isAuthenticated) {
        this.$router.push(this.fallback)
      }
    }
  }
</script>
