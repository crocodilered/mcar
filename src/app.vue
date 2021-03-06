<template>
  <div id="app">
    <aside
      v-if="isAuthenticated"
      ref="drawer"
      class="mdc-drawer mdc-drawer--modal"
    >
      <div class="mdc-drawer__header">
        <h3 class="mdc-drawer__title">Заметки об автомобиле</h3>
        <h6 class="mdc-drawer__subtitle" v-if="user">{{ user.email }}</h6>
      </div>
      <div class="mdc-drawer__content">
        <nav class="mdc-list">
          <hr class="mdc-list-divider">
          <template v-if="isAuthenticated">
            <drawer-link @click.native="drawer.open = false" to="/profile" icon="face" text="Профиль" />
            <hr class="mdc-list-divider">
            <h6 class="mdc-list-group__subheader">Автомобили</h6>
            <drawer-link
              v-for="(o, i) in vehicles"
              :key="`nav-vehicle-${i}`"
              :to="`/vehicle/${i}`"
              :text="o.title"
              @click.native="drawer.open = false"
              icon="directions_car"
            />
          </template>
          <template v-else>
            <drawer-link @click.native="drawer.open = false" to="/login" icon="exit_to_app" text="Войти" />
            <drawer-link @click.native="drawer.open = false" to="/register" icon="fingerprint" text="Зарегистрироваться" />
          </template>
        </nav>
      </div>
    </aside>

    <div class="mdc-drawer-scrim"></div>

    <div class="mdc-drawer-app-content">
      <header ref="appbar" class="mdc-top-app-bar app-bar">
        <div class="mdc-top-app-bar__row">
          <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <a
              v-if="isAuthenticated"
              href="#"
              class="material-icons mdc-top-app-bar__navigation-icon"
            >
              menu
            </a>
            <span class="mdc-top-app-bar__title">{{ title }}</span>
          </section>
        </div>
      </header>
      <main ref="content" class="main-content">
        <div class="mdc-top-app-bar--fixed-adjust">
          <vehicle-tabs v-if="vehicleManageTab"/>
          <router-view/>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import { MDCTopAppBar } from '@material/top-app-bar'
  import { MDCDrawer } from '@material/drawer'
  import { mapGetters, mapState } from 'vuex'
  import DrawerLink from '@/components/mdc/drawer-link'
  import VehicleTabs from '@/components/mdc/vehicle-tabs'

  const computed = {
    ...mapGetters(['isAuthenticated']),
    ...mapState([
      'vehicleManageTab',
      'currentVehicle',
      'vehicles',
      'user'
    ]),

    title () {
      return this.currentVehicle
        ? this.currentVehicle.title.slice()
        : 'Заметки об автомобиле'
    }
  }

  const data = function () {
    return {
      drawer: null,
      topAppBar: null
    }
  }

  export default {
    components: {
      DrawerLink,
      VehicleTabs
    },

    name: 'Application',
    data,
    computed,

    mounted () {
      this.topAppBar = new MDCTopAppBar(this.$refs.appbar)
      this.topAppBar.setScrollTarget(this.$refs.content)
      
      if (this.$refs.drawer) {
        this.drawer = new MDCDrawer(this.$refs.drawer)
        this.topAppBar.listen('MDCTopAppBar:nav', () => {
          this.drawer.open = !this.drawer.open
        })
      }
    },

    destroyed () {
      this.topAppBar.destroy()
      if (this.drawer) this.drawer.destroy()
    }
  }
</script>

<style lang="scss">
  @import "@/assets/variables.scss";

  @import "~@material/layout-grid/mdc-layout-grid";
  @import "~@material/typography/mdc-typography";
  @import "~@material/top-app-bar/mdc-top-app-bar.scss";
  @import "~@material/drawer/mdc-drawer.scss";
  @import "~@material/list/mdc-list.scss";
  
  @import "@/assets/app.scss";
  @import "@/assets/grid.scss";
</style>
