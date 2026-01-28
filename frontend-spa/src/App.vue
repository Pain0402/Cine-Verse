<template>
  <div id="app">
    <StarfieldBackground /> <!-- Background Animation -->
    <AppNavbar />
    <div style="padding-top: 70px;"> 
       <AppBreadcrumb v-if="$route.name !== 'home'" />
    </div>

    <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue';
import AppNavbar from '@/components/AppNavbar.vue';
import AppBreadcrumb from '@/components/AppBreadcrumb.vue';
import StarfieldBackground from '@/components/StarfieldBackground.vue';
</script>

<style>
/* Global Transition Styles */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
