<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <h1>Регистрация</h1>
        <p>Для регистрации укажите свой адрес электронной почты и придумайте <b>пароль не короче шести</b> символов.</p>
        <form @submit.prevent="doRegister">
          <mdc-textfield
            label="Электронная почта"
            type="email"
            v-model="email"
            required
          />
          <mdc-textfield
            label="Пароль"
            type="password"
            v-model="password"
            required
            minlength="6"
          />
          <mdc-button :loading="loading">
            Зарегистрироваться
          </mdc-button>
          <mdc-snackbar
            v-model="errorSnackbar"
            v-bind="{ message: errorMessage }"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import { auth, authPersistence, firestore } from '@/config'
  import MdcButton from '@/components/mdc/button'
  import MdcTextfield from '@/components/mdc/textfield'
  import MdcSnackbar from '@/components/mdc/snackbar'
  import FirebaseErrors from '@/libs/firebase/errors'

  const data = function () {
    return {
      email: null,
      password: null,
      loading: false,
      errorSnackbar: null,
      errorCode: null,
      fallback: '/profile'
    }
  }

  const computed = {
    errorMessage () {
      return FirebaseErrors.getMessage(this.errorCode)
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
    doRegister () {
      this.loading = true
      this.errorCode = null
      auth.createUserWithEmailAndPassword(this.email, this.password)
        .then(resp => {
          // Init user's data
          firestore.collection('users').doc(resp.user.uid).set({})
          // Login user
          auth.setPersistence(authPersistence.LOCAL)
            .then(() => auth.signInWithEmailAndPassword(this.email, this.password))
            .then(() => this.$router.push(this.fallback))
        })
        .catch(error => (this.errorCode = error.code))
        .finally(() => (this.loading = false))
    }
  }

  export default {
    components: { MdcButton, MdcTextfield, MdcSnackbar },
    name: 'AuthRegister',
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
