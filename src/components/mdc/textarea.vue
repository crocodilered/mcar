<template>
  <div class="form-field">
    <div
      ref="textarea"
      class="mdc-text-field text-field mdc-text-field--textarea"
    >
      <textarea
        :id="`tf-${uid}`"
        :value="value"
        :required="required"
        :minlength="minlength"
        :maxlength="maxlength"
        @input="$emit('input', $event.target.value)"
        @change="valueChanged"
        :rows="rows"
        :autofocus="autofocus"
        class="mdc-text-field__input"
      />
      
      <div class="mdc-notched-outline">
        <div class="mdc-notched-outline__leading"></div>
        <div class="mdc-notched-outline__notch">
          <label
            :for="`tf-${uid}`"
            class="mdc-floating-label"
          >
            {{ label }}
          </label>
        </div>
        <div class="mdc-notched-outline__trailing"></div>
      </div>
    </div>
    <div
      ref="textareaHelp"
      class="mdc-text-field-helper-text"
      aria-hidden="true"
    >
      {{ errorText || helpText }}
    </div>
  </div>
</template>

<script>
  import { MDCTextField } from '@material/textfield'
  import { MDCTextFieldHelperText } from '@material/textfield/helper-text'

  export default {
    name: 'MdcTextarea',
    props: [
      'value',
      'label',
      'rows',
      'minlength',
      'maxlength',
      'required',
      'help-text',
      'error-text',
      'valid',
      'autocomplete',
      'autofocus'
    ],

    data () {
      return {
        uid: null,
        textarea: null,
        textareaHelp: null
      }
    },

    watch: {
      errorText (newVal) {
        if (newVal) {
          this.textarea.valid = false
        }
      }
    },

    mounted () {
      this.uid = this._uid
      this.textarea = new MDCTextField(this.$refs.textarea)
      this.textareaHelp = new MDCTextFieldHelperText(this.$refs.textareaHelp)
    },

    destroyed () {
      this.textarea.destroy()
      this.textareaHelp.destroy()
    },

    methods: {
      valueChanged () {
        this.$emit('change')
        this.textarea.valid = false
        this.textareaHelp.foundation.setPersistent(true)
        this.textareaHelp.foundation.setValidation(true)
        this.textareaHelp.foundation.setValidity(false)
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/variables.scss";
  @import "~@material/textfield/mdc-text-field";

  .form-field {
    margin-bottom: .75rem;
  }

  .form-field > .mdc-text-field {
    width: 100%;
  }
</style>
