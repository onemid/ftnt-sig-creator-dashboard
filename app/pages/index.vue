<script setup lang="ts">
const modules = [{
  title: 'Home',
  description: 'Collection of essential tools of Fortinet IPS.',
  to: '/',
  icon: 'i-heroicons-home'
}, {
  title: 'Signature Editor',
  description: 'Parsing the signature in structural way.',
  to: '/signature',
  icon: 'i-heroicons-code-bracket-square'
},
{
  title: 'Config Parser',
  description: 'Convert the config into the friendly view.',
  to: '/config',
  icon: 'i-heroicons-cog'
}, {
  title: 'Logs Preview',
  description: 'Convert the raw logs into the tabular view.',
  to: '/logs',
  icon: 'i-heroicons-document-text'
}]
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Fortinet IPS and App Control Utilities">
        <template #right>
          Home
        </template>
      </UDashboardNavbar>

      <UDashboardPanelContent>
        <UPageGrid>
          <UPageCard
            v-for="(module, index) in modules"
            :key="index"
            v-bind="module"
          >
            <template #description>
              <span class="line-clamp-2">{{ module.description }}</span>
            </template>
          </UPageCard>
        </UPageGrid>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
