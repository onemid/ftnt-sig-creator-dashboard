<script setup lang="ts">
const links = [[{
  label: 'Preview',
  icon: 'i-heroicons-pencil-square',
  to: '/signature',
  exact: true
}, {
  label: 'Signature',
  icon: 'i-heroicons-code-bracket',
  to: '/signature/preview'
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
      <UDashboardNavbar title="Signature Editor" />

      <!--      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto"> -->
      <!--        <UHorizontalNavigation :links="links" /> -->
      <!--      </UDashboardToolbar> -->

      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>
