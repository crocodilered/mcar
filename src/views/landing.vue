<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell--main">
        <h1>Заметки об&nbsp;автомобиле</h1>
        <p style="font-size: 120%;">Приложение для ведения статистки о&nbsp;расходах на&nbsp;автомобиль.</p>
        <p>Сможете хранить информацию о&nbsp;расходах, номера запчастей записывать и&nbsp;все такое.</p>
        <div class="buttons">
          <div>
            <mdc-button outlined>Войти</mdc-button>
          </div>
          <div>
            <mdc-button outlined>Зарегистрироваться</mdc-button>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <overlay title="Войти"></overlay>
    </transition>
    <transition name="fade">
      <overlay title="Зарегистрироваться"></overlay>
    </transition>
    <transition name="fade">
      <overlay title="Изменить пароль"></overlay>
    </transition>
  </div>
</template>

<script>
  import MdcButton from '@/components/mdc/button'
  import Overlay from '@/components/common/overlay'

  export default {
    name: 'Landing',
    components: { MdcButton, Overlay },

    methods: {

    },

    beforeCreate () {
      if (this.$store.getters.isAuthenticated) {
        this.$router.push('/profile')
      }
    }
  }
</script>

<style>
  .buttons {
    margin: 2rem 0;
    display: flex;
    justify-content: space-between;
  }
</style>
