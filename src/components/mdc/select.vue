<template>
  <div class="form-field" v-if="options">
    <div ref="select" class="mdc-select mdc-select--outlined">
      <input type="hidden" name="enhanced-select">
      <i class="mdc-select__dropdown-icon"></i>
      <div class="mdc-select__selected-text"></div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface" style="width: 300px;">
        <ul class="mdc-list">
          <li
            v-for="(o, i) in options"
            :key="`option-${i}`"
            :data-value="o.label"
            :class="{ 'mdc-list-item': true, 'mdc-list-item--selected': o.value === value }"
            :aria-selected="o.value === value"
            @click="$emit('input', o.value)"
          >
            {{ o.label }}
          </li>
        </ul>
      </div>

      <div class="mdc-notched-outline">
        <div class="mdc-notched-outline__leading"></div>
        <div class="mdc-notched-outline__notch">
          <label class="mdc-floating-label">{{ label }}</label>
        </div>
        <div class="mdc-notched-outline__trailing"></div>
      </div>
    </div>

    <div
      ref="textfieldHelp"
      class="mdc-text-field-helper-text"
      aria-hidden="true"
    >
      {{ helpText }}
    </div>
  </div>
</template>

<script>
  import { MDCSelect } from '@material/select'

  export default {
    name: 'MdcSelect',
    props: [
      'value',
      'label',
      'options', // array of { value, label }
      'helpText'
    ],

    data () {
      return {
        select: null
      }
    },

    mounted () {
      this.select = new MDCSelect(this.$refs.select)
    },

    destroyed () {
      this.select.destroy()
    }
  }
</script>

<style lang="scss">
  @import "@/assets/variables.scss";

  @import "~@material/list/mdc-list";
  @import "~@material/menu-surface/mdc-menu-surface";
  @import "~@material/menu/mdc-menu";
  @import "~@material/select/mdc-select";

  .form-field {
    margin-bottom: .75rem;
  }

  .form-field > .mdc-select {
    width: 100%;
  }
</style>
