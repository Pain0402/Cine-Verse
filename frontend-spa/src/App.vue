<template>
  <div id="app">
    <AppNavbar />
    <div style="padding-top: 70px;"> <!-- Spacer for fixed navbar -->
       <AppBreadcrumb v-if="$route.name !== 'home'" />
    </div>

    <RouterView />

    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue';
import AppNavbar from '@/components/AppNavbar.vue';
import AppBreadcrumb from '@/components/AppBreadcrumb.vue';
</script>

<style></style>
