<template>
  <button
    ref='button'
    :aria-label="title"
    :title="title"
    aria-hidden="true"
    aria-pressed="false"
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

    props: ['title'],

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
