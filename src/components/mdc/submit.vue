<template>
  <div class="form-submit">
    <button
      ref='root'
      :disabled="loading"
      class="mdc-button mdc-button--unelevated"
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
  </div>
</template>

<script>
  import {MDCRipple} from '@material/ripple'

  export default {
    name: 'MdcSubmit',
    props: ['loading', 'icon'],

    mounted () {
      this.button = new MDCRipple(this.$refs.root)
    },

    destroyed () {
      this.button.destroy()
    }
  }
</script>

<style lang="scss">
  @import "@/assets/variables.scss";
  @import "~@material/button/mdc-button";

  @media (max-width: 600px) {
    .form-submit .mdc-button {
      padding: 15px 20px;
      height: auto;
    }
  }
</style>
