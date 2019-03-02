<template>
  <div id="app">
    <aside ref="drawer" class="mdc-drawer mdc-drawer--dismissible">
      <div class="mdc-drawer__header">
        <h3 class="mdc-drawer__title">Автоистория</h3>
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
              v-for="(o, i) in navigationVehicles"
              :key="`nav-vehicle-${i}`"
              :to="`/vehicle/${i}`"
              :text="o.title"
              @click.native="drawer.open = false"
              icon="directions_car"
            />
            <drawer-link @click.native="drawer.open = false" to="/vehicle/create" icon="add" text="Добавить авто" />
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
            <a href="#" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
            <span class="mdc-top-app-bar__title">{{ title }}</span>
          </section>
          <section
            v-if="currentVehicle"
            class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
          >
            <button
              @click="$router.push(`/vehicle/${currentVehicle.id}/update`)"
              class="material-icons mdc-top-app-bar__action-item mdc-ripple-upgraded"
              aria-label="Редактировать"
              title="Редактировать авто"
            >
              edit
            </button>
            <button
              @click="$router.push(`/vehicle/${currentVehicle.id}/delete`)"
              class="material-icons mdc-top-app-bar__action-item mdc-ripple-upgraded"
              aria-label="Удалить"
              title="Удалить авто"
            >
              delete
            </button>
          </section>
        </div>
      </header>
      <main ref="content" class="main-content">
        <div class="mdc-top-app-bar--fixed-adjust">
          <div class="vehicle-manage-tabs">
            <div class="mdc-layout-grid">
              <div class="mdc-layout-grid__inner">
                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
                  <vehicle-tabs v-if="vehicleManageTab"/>
                </div>
              </div>
            </div>
          </div>
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
      'navigationVehicles',
      'currentVehicle',
      'user'
    ]),

    title () {
      return this.currentVehicle
        ? this.currentVehicle.title.slice()
        : 'Автоистория'
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
      this.drawer = new MDCDrawer(this.$refs.drawer)
      this.topAppBar = new MDCTopAppBar(this.$refs.appbar)
      this.topAppBar.setScrollTarget(this.$refs.content)
      this.topAppBar.listen('MDCTopAppBar:nav', () => {
        this.drawer.open = !this.drawer.open
      })
    },

    destroyed () {
      this.drawer.destroy()
      this.topAppBar.destroy()
    }
  }
</script>

<style lang="scss">
  @import "@/assets/style.scss";
  
  @import "~@material/layout-grid/mdc-layout-grid";
  @import "~@material/typography/mdc-typography";
  @import "~@material/top-app-bar/mdc-top-app-bar.scss";
  @import "~@material/drawer/mdc-drawer.scss";
  @import "~@material/list/mdc-list.scss";
  
  body {
    margin: 0;
    display: flex;
    height: 100vh;
    /* background-color: #f2f2f2; moved to elements style */
  }
  .mdc-drawer-app-content {
    flex: auto;
    overflow: auto;
    position: relative;
  }
  .main-content {
    overflow: auto;
    height: 100%;
  }
  .app-bar {
    position: absolute;
  }
  #app {
    width: 100%;
  }
  form {
    margin: 2em 0;
  }
  h1 {
    @include mdc-typography(headline1);
    font-size: 2.5rem;
    line-height: 2.5rem;
    margin: 1rem 0 2rem;
  }
  h2 {
    @include mdc-typography(headline2);
    font-size: 2rem;
    line-height: 2rem;
    margin: 1rem 0 2rem;
  }
  p {
    @include mdc-typography(body1);
    margin: 1rem 0 2rem;
  }
  .app-fab--absolute {
    position: fixed ! important;
    bottom: 1rem;
    right: 1rem;
    z-index: 1000;
  }
  .mdc-drawer-app-content {
    height: 100%;
  }
  .vehicle-manage-tabs {
    background-color: $mdc-theme-primary-light;
    .mdc-layout-grid {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  .window-overlay {
    background-color: #f2f2f2;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  @media (max-width: $width-sm) {
    .vehicle-manage-tabs .mdc-layout-grid {
      padding: 0;
    }
  }
  @media (max-width: $width-xl) {
    .app-fab--absolute {
      bottom: 1.5rem;
      right: 1.5rem;
    }
  }
  @media (min-width: 840px) {
    .mdc-layout-grid__cell:first-child {
      grid-column-start: 4;
    }
  }
</style>
