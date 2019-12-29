<template>
  <v-app>
    <Navigation />
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
      <v-slide-y-transition mode="out-in">
        <router-view />
      </v-slide-y-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'App',
  components: {
    Navigation
  },
  data(){
    return {
    }
  }
};
</script>
