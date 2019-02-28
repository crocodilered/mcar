<template>
  <mdc-textfield
    v-model="valueStr"
    :label="label"
    :min="min"
    :max="max"
    :required="required"
    @change="valueChangeHandler"
    type="date"
  />
</template>

<script>
  import MdcTextfield from '@/components/mdc/textfield'

  export default {
    components: { MdcTextfield },
    name: 'DatePicker',
    props: ['label', 'value', 'max', 'min', 'required'],

    data () {
      return {
        valueStr: this.value ? this.value.toISOString().substr(0, 10) : ''
      }
    },

    computed: {
      valueDate () {
        if (this.valueStr) {
          const [y, m, d] = this.valueStr.split('-')
          return new Date(y, m - 1, d)
        } else {
          return null
        }
      }
    },

    methods: {
      valueChangeHandler () {
        this.$emit('input', this.valueDate)
        this.$emit('change')
      }
    }
  }
</script>
