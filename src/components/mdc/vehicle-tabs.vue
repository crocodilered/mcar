<template>
  <div ref="tabBar" class="mdc-tab-bar mdc-tab-bar--upper" role="tablist">
    <div class="mdc-tab-scroller">
      <div class="mdc-tab-scroller__scroll-area">
        <div class="mdc-tab-scroller__scroll-content">
          
          <button @click="switchTab('expenses')" class="mdc-tab mdc-tab--active" role="tab" aria-selected="true" tabindex="0">
            <span class="mdc-tab__content">
              <span class="mdc-tab__text-label">Расходы</span>
            </span>
            <span class="mdc-tab-indicator mdc-tab-indicator--active">
              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
            </span>
            <span class="mdc-tab__ripple"></span>
          </button>

          <!--
          <button @click="switchTab('report')" class="mdc-tab" role="tab" aria-selected="true" tabindex="0">
            <span class="mdc-tab__content">
              <span class="mdc-tab__text-label">Отчет</span>
            </span>
            <span class="mdc-tab-indicator">
              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
            </span>
            <span class="mdc-tab__ripple"></span>
          </button>
          -->

          <button @click="switchTab('notes')" class="mdc-tab" role="tab" aria-selected="true" tabindex="1">
            <span class="mdc-tab__content">
              <span class="mdc-tab__text-label">Заметки</span>
            </span>
            <span class="mdc-tab-indicator">
              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
            </span>
            <span class="mdc-tab__ripple"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { MDCTabBar } from '@material/tab-bar'
  import { mapState } from 'vuex'

  export default {
    name: 'VehicleTabs',

    data () {
      return {
        tabBar: null
      }
    },

    watch: {
      vehicleManageTab (newVal) {
        if (newVal === 'expense') {
          this.tabBar.activateTab(0)
        } else if (newVal === 'report') {
          this.tabBar.activateTab(1)
        } else if (newVal === 'notes') {
          this.tabBar.activateTab(2)
        }
      }
    },

    computed: {
      ...mapState(['vehicleManageTab'])
    },

    methods: {
      switchTab (tab) {
        this.$store.commit('setVehicleManageTab', tab)
      }
    },

    mounted () {
      this.tabBar = new MDCTabBar(this.$refs.tabBar)
    },

    destroyed () {
      this.tabBar.destroy()
    }
  }
</script>

<style lang="scss">
  @import "@/assets/variables.scss";

  @import "~@material/tab-bar/mdc-tab-bar";
  @import "~@material/tab-scroller/mdc-tab-scroller";
  @import "~@material/tab-indicator/mdc-tab-indicator";
  @import "~@material/tab/mdc-tab";

  .mdc-tab-bar--upper {
    .mdc-tab__icon, 
    .mdc-tab__text-label {
      color: $mdc-theme-on-primary-light ! important;
    }

    .mdc-tab-indicator > .mdc-tab-indicator__content--underline {
      background-color: $mdc-theme-secondary ! important;
      height: 4px;
    }
  }


</style>
