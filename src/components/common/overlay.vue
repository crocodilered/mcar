<template>
  <div class="overlay">
    <div class="header">
      <mdc-icon-button
        @click="$emit('close')"
        title="Закрыть"
      >
        close
      </mdc-icon-button>
    </div>
    <h1>{{ title }}</h1>
    <div class="content">
      <slot/>
    </div>
  </div>
</template>

<script>
  import MdcIconButton from '@/components/mdc/icon-button'

  export default {
    components: { MdcIconButton },
    name: 'Overlay',
    props: ['title']
  }
</script>

<style lang="scss">
  .overlay {
    background-color: #ffffff;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 4;
    padding: 0 1rem;
    
    .header {
      margin-top: 1rem;
      text-align: right;
    }

    h1 {
      margin-top: 0;
    }

    .header, h1, .content {
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
