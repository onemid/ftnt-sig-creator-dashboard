<script setup lang="ts">
const route = useRoute()

const links = [{
  id: 'home',
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/',
  tooltip: {
    text: 'Home'
  }
}, {
  id: 'signature',
  label: 'Signature Editor',
  icon: 'i-heroicons-code-bracket-square',
  to: '/signature',
  tooltip: {
    text: 'Signature Utils'
  }
}, {
  id: 'config',
  label: 'Config Parser',
  icon: 'i-heroicons-cog',
  to: '/config',
  tooltip: {
    text: 'Config Parser'
  }
}, {
  id: 'logs',
  label: 'Logs Preview',
  icon: 'i-heroicons-document-text',
  to: '/logs',
  tooltip: {
    text: 'Logs Utils'
  }
}]

const groups = [{
  key: 'links',
  label: 'Go to',
  commands: links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
}, {
  key: 'code',
  label: 'Code',
  commands: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    click: () => {
      window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`, '_blank')
    }
  }]
}]
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <UButton
            color="gray"
            variant="ghost"
            class="w-full"
          >
            <UAvatar
              src="/favicon.ico"
              size="2xs"
            />

            <span class="truncate text-gray-900 dark:text-white font-semibold">Fortinet IPS</span>
          </UButton>
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

        <UDashboardSidebarLinks :links="links" />

        <div class="flex-1" />
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>
