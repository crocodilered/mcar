<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
        <h1>Восстановление пароля</h1>
        <p v-if="emailSent">
          Инструкции для восстановления пароля высланы на почту {{ email.value }}, проверяйте ящик.
        </p>
        <template v-else>
          <p>Введите указанный при регистрации адрес электронной почты и мы вышлем вам инструкции для восстановления пароля.</p>

          <form @submit.prevent="doReset">
            <mdc-textfield
              label="Электронная почта"
              type="email"
              v-model="email"
              required
            />
            <mdc-submit :loading="loading">
              Восстановить
            </mdc-submit>
            <mdc-snackbar
              v-model="errorSnackbar"
              :message="errorMessage"
            />
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import { auth, devAccount } from '@/config'
  import MdcSubmit from '@/components/mdc/submit'
  import MdcTextfield from '@/components/mdc/textfield'
  import MdcSnackbar from '@/components/mdc/snackbar'

  import FirebaseErrors from '@/libs/firebase/errors'

  const data = function () {
    return {
      email: devAccount.validEmail,
      loading: false,
      errorCode: null,
      errorSnackbar: false,
      emailSent: false,
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
    doReset () {
      this.loading = true
      this.errorCode = null
      auth.sendPasswordResetEmail(this.email)
        .then(() => {
          this.emailSent = true
        })
        .catch(error => {
          this.errorCode = error.code
        })
        .finally(() => {
          this.loading = false
        })
    }
  }

  export default {
    name: 'AuthReset',
    components: { MdcSubmit, MdcTextfield, MdcSnackbar },
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
