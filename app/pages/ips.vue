<script setup lang="ts">
const links = [[{
  label: 'Basic Options',
  icon: 'i-heroicons-information-circle',
  to: '/ips',
  exact: true
}, {
  label: 'Protocol Options',
  icon: 'i-heroicons-arrows-right-left',
  to: '/ips/protocol'
}, {
  label: 'Payload Options',
  icon: 'i-heroicons-finger-print',
  to: '/ips/payload'
}, {
  label: 'Special Options',
  icon: 'i-heroicons-cursor-arrow-rays',
  to: '/ips/special'
}], [{
  label: 'Documentation',
  icon: 'i-heroicons-book-open',
  to: 'https://ui.nuxt.com/pro',
  target: '_blank'
}, {
  label: 'Buy me a coffee',
  icon: 'i-heroicons-credit-card',
  to: 'https://ui.nuxt.com/pro/purchase',
  target: '_blank'
}]]
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="IPS Signature" />

      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>
