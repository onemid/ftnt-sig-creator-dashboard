<script setup lang="ts">
const links = [[{
  label: 'Create',
  icon: 'i-heroicons-pencil-square',
  to: '/ips',
  exact: true
}, {
  label: 'Signature',
  icon: 'i-heroicons-code-bracket',
  to: '/ips/members'
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
