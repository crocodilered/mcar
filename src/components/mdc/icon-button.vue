<template>
  <button
    ref='button'
    class="mdc-icon-button material-icons"
    @click="$emit('click')"
  >
    <slot/>
  </button>
</template>

<script>
  import {MDCRipple} from '@material/ripple'

  export default {
    name: 'MdcIconButton',

    mounted () {
      this.button = new MDCRipple(this.$refs.button)
      this.button.unbounded = true
    },

    destroyed () {
      this.button.destroy()
    }
  }
</script>

<style lang="scss">
  @import "@/assets/variables.scss";
  @import "~@material/icon-button/mdc-icon-button";
</style>
