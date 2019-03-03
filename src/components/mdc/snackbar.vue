<template>
  <div ref="root" class="mdc-snackbar mdc-snackbar--leading">
    <div class="mdc-snackbar__surface">
      <div class="mdc-snackbar__label"
          role="status"
          aria-live="polite"
      >
        {{ message }}
      </div>
      <div class="mdc-snackbar__actions">
        <button type="button" class="mdc-button mdc-snackbar__action">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { MDCSnackbar } from '@material/snackbar'

  export default {
    name: 'MdcSnackbar',
    props: ['value', 'message'],

    watch: {
      value (newVal) {
        if (this.snackbar && newVal) {
          this.snackbar.open()
        }
      }
    },

    mounted () {
      this.snackbar = new MDCSnackbar(this.$refs.root)
      this.snackbar.listen('MDCSnackbar:closed', () => this.$emit('input', false))
    },

    destroyed () {
      this.snackbar.destroy()
    }
  }
</script>

<style lang="scss">
  @import "@/assets/variables.scss";
  @import "~@material/snackbar/mdc-snackbar";
</style>
