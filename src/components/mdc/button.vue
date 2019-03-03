<template>
  <button
    ref='button'
    :disabled="loading"
    class="mdc-button mdc-button--unelevated mdc-button--extended"
    @click="$emit('click')"
  >
    <i
      v-if="icon"
      class="material-icons mdc-button__icon"
    >
      {{ icon }}
    </i>
    <span class="mdc-button__label">
      <slot/>
    </span>
  </button>
</template>

<script>
  import {MDCRipple} from '@material/ripple'

  export default {
    name: 'MdcButton',
    props: ['loading', 'icon'],

    mounted () {
      this.button = new MDCRipple(this.$refs.button)
    },

    destroyed () {
      this.button.destroy()
    }
  }
</script>

<style lang="scss">
  @import "@/assets/variables.scss";
  @import "~@material/button/mdc-button";

  @media (max-width: $width-sm) {
    .mdc-button--extended {
      padding: 15px 20px;
      height: auto;
    }
  }
</style>
