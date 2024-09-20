<script setup lang="ts">
const modules = [{
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
        <ULandingCTA
          title="Fortinet IPS and App Control Utilities"
          description="Please click the utilities listed below to continue."
          card
        />
        <UPageGrid class="my-5">
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
