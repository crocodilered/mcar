<template>
  <button
    ref='button'
    :disabled="loading"
    :class="cssClass"
    class="mdc-button"
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
    props: ['loading', 'icon', 'plain', 'outlined'],

    computed: {
      cssClass () {
        return {
          'mdc-button--unelevated': (this.plain === undefined && this.outlined === undefined),
          'mdc-button--plain': (this.plain !== undefined),
          'mdc-button--outlined': (this.outlined !== undefined),
          'mdc-button--extended': (this.plain === undefined)
        }
      }
    },

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
