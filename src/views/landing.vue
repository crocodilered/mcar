<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
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
