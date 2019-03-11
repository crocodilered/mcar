<template>
  <div class="form window-overlay">
    <div class="mdc-layout-grid">
      <div class="mdc-layout-grid__inner">
        <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
          <div style="text-align: right;">
            <mdc-icon-button
              @click="$emit('close')"
              title="Закрыть"
            >
              close
            </mdc-icon-button>
          </div>
          <h1>{{ title }}</h1>
          <slot/>
        </div>
      </div>
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

<style>
  .window-overlay {
    background-color: #f2f2f2;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 4;
  }
</style>
