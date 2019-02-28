<template>
  <router-link
    :to="to"
    class="mdc-list-item"
    exact-active-class="mdc-list-item--activated"
  >
    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">{{ icon }}</i>
    <span class="mdc-list-item__text">{{ text }}</span>
  </router-link>
</template>

<script>
  export default {
    name: 'DrawerLink',
    props: ['to', 'icon', 'text']
  }
</script>
