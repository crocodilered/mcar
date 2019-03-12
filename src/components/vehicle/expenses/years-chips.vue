<template>
  <div
    ref="yearsChips"
    class="mdc-chip-set  mdc-chip-set--choice"
  >
    <div
      v-for="(o, i) in years"
      :key="`year-list-nav-${i}`"
      @click="$emit('input', o)"
      :tabindex="i"
      class="mdc-chip year-chip"
    >
      <div class="mdc-chip__text">
        {{ o }}
      </div>
    </div>
  </div>
</template>

<script>
  import { MDCChipSet } from '@material/chips'

  export default {
    name: 'YearsChips',
    props: ['years', 'value'],

    mounted () {
      this.yearsChips = new MDCChipSet(this.$refs.yearsChips)
    },

    destroyed () {
      this.yearsChips.destroy()
    }
  }
</script>

<style lang="scss">
  @import "@/assets/variables.scss";
  @import "@material/chips/mdc-chips";

  .mdc-chip.year-chip {
    border-radius: 4px;
  }

  .mdc-chip-set .mdc-chip.year-chip {
    margin-left: 0;
  }
</style>
