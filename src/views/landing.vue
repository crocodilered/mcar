<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell--main">
        <h1>Заметки про автомобиль</h1>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    beforeCreate () {
      if (this.$store.getters.isAuthenticated) {
        this.$router.push('/profile')
      }
    }
  }
</script>
