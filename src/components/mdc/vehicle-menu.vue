<template>
  <div class="mdc-menu-surface--anchor">
    <button
      @click="vehicleMenu.open = true"
      class="material-icons mdc-top-app-bar__action-item mdc-ripple-upgraded--unbounded mdc-ripple-upgraded"
      aria-label="Menu"
    >
      more_vert
    </button>
    <div
      ref="vehicleMenu"
      class="mdc-menu mdc-menu-surface"
      tabindex="-1"
    >
      <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical">
        <li class="mdc-list-item" role="menuitem">
          <span class="mdc-list-item__text" @click="$router.push(`/vehicle/${vehicle.id}/update`)">Редактировать авто</span>
        </li>
        <li class="mdc-list-item" role="menuitem">
          <span class="mdc-list-item__text" @click="$router.push(`/vehicle/${vehicle.id}/delete`)">Удалить авто</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { MDCMenu } from '@material/menu'

  export default {
    name: 'VehicleTopAppbarMenu',
    props: ['vehicle'],

    data () {
      return {
        vehicleMenu: null
      }
    },

    mounted () {
      this.vehicleMenu = new MDCMenu(this.$refs.vehicleMenu)
    },

    destroyed () {
      this.vehicleMenu.destroy()
    }
  }
</script>

<style lang="scss">
  @import "~@material/list/mdc-list.scss";
  @import "~@material/menu-surface/mdc-menu-surface";
  @import "~@material/menu/mdc-menu";
</style>
