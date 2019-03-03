<template>
  <div class="form-field">
    <div
      ref="textfield"
      class="mdc-text-field mdc-text-field--outlined"
    >
      <input
        :id="`tf-${uid}`"
        :value="value"
        :type="type"
        :required="required"
        :minlength="minlength"
        :maxlength="maxlength"
        :min="min"
        :max="max"
        :autocomplete="autocomplete"
        @input="$emit('input', $event.target.value)"
        @change="valueChanged"
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
      ref="textfieldHelp"
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
    name: 'MdcTextfield',
    props: [
      'value',
      'label',
      'type',
      'minlength',
      'maxlength',
      'min',
      'max',
      'required',
      'help-text',
      'error-text',
      'valid',
      'autocomplete'
    ],

    data () {
      return {
        uid: null,
        textfield: null,
        textfieldHelp: null
      }
    },

    watch: {
      errorText (newVal) {
        if (newVal) {
          this.textfield.valid = false
        }
      }
    },

    mounted () {
      this.uid = this._uid
      this.textfield = new MDCTextField(this.$refs.textfield)
      this.textfieldHelp = new MDCTextFieldHelperText(this.$refs.textfieldHelp)
    },

    destroyed () {
      this.textfield.destroy()
      this.textfieldHelp.destroy()
    },

    methods: {
      valueChanged () {
        this.$emit('change')
        this.textfield.valid = false
        this.textfieldHelp.foundation.setPersistent(true)
        this.textfieldHelp.foundation.setValidation(true)
        this.textfieldHelp.foundation.setValidity(false)
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
