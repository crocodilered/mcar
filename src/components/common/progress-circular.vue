<template>
  <div class="progress-circular">
    <i class="material-icons mdc-text-field__icon">sync</i>
  </div>
</template>

<script>
  export default {
    name: 'ProgressCircular'
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/variables.scss';

  .progress-circular {
    margin-top: 20%;
    text-align: center;
  }
  .material-icons {
    animation:spin 1.2s linear infinite;
    zoom: 3;
    color: $mdc-theme-primary;
  }
  @keyframes spin {
    100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); }
  }
</style>
