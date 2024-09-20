<script setup lang="ts">
import { TreeItem, TreeRoot } from 'radix-vue'
import { Icon } from '@iconify/vue'
import configParser from '~/utils/config_parser'
import type { ConfigNode } from '~/types'

const colorMode = useColorMode()
const isConfigModalOpen = ref(false)
const config = ref('')
const configObj: Ref<ConfigNode[]> = ref([])

const parsingConfig = () => {
  configObj.value = configParser(config.value)
  isConfigModalOpen.value = false
}

const q = ref('')
const expanded = ref([])

const filterConfig = computed(() => {
  // If the query is empty, return the original nodes
  if (!q.value.trim()) {
    return configObj.value
  }

  const lowerCaseQuery = q.value.toLowerCase()
  const defaultExpanded = []

  const getSafeLowerCase = (prop?: string): string => {
    return prop ? prop.toLowerCase() : ''
  }

  // Recursive function to filter nodes
  const filterNodes = (node: ConfigNode): ConfigNode | null => {
    // Check if the current node matches the query
    const matches
        = getSafeLowerCase(node.type).startsWith(lowerCaseQuery)
        || getSafeLowerCase(node.name).includes(lowerCaseQuery)
        || getSafeLowerCase(node.value).includes(lowerCaseQuery)

    // If the node has children, recursively filter them
    let filteredChildren: ConfigNode[] | undefined
    if (node.children) {
      filteredChildren = node.children
        .map(filterNodes)
        .filter((child): child is ConfigNode => child !== null)
    }

    // Determine if the node should be included:
    // - It matches the query, or
    // - Any of its children match the query
    if (matches || (filteredChildren && filteredChildren.length > 0)) {
      if (node.type === 'config') {
        defaultExpanded.push(node.key)
      }
      return {
        ...node,
        children: filteredChildren
      }
    }

    // Exclude the node if it doesn't match and has no matching children
    return null
  }

  // Apply the filter to each root node and exclude nulls

  if (defaultExpanded.length < 50) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    expanded.value = defaultExpanded
  }
  return configObj.value
    .map(filterNodes)
    .filter((node): node is ConfigNode => node !== null)
})
</script>

<template>
  <UDashboardPanelContent class="pb-5">
    <UDashboardSection
      title="Parse Config"
      description="Convert the FortiOS config into tree view."
      orientation="horizontal"
      :ui="{ container: 'lg:sticky top-2' }"
    >
      <template #links>
        <div class="flex flex-col md:flex-rol gap-3">
          <div class="flex gap-1.5">
            <UButton
              label="Paste Config"
              @click="isConfigModalOpen = true"
            />
            <UModal
              v-model="isConfigModalOpen"
              fullscreen
            >
              <UCard
                :ui="{
                  base: 'h-full flex flex-col',
                  rounded: '',
                  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                  body: {
                    base: 'grow'
                  }
                }"
              >
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                      Paste Config
                    </h3>
                    <UButton
                      color="gray"
                      variant="ghost"
                      icon="i-heroicons-x-mark-20-solid"
                      class="-my-1"
                      @click="() => {
                        isConfigModalOpen = false
                      }"
                    />
                  </div>
                </template>
                <MonacoEditor
                  v-model="config"
                  lang="shell"
                  class="w-full h-[80%] border rounded p-1"
                  :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light', wordWrap: 'on', minimap: { enabled: false } }"
                />
                <UButton
                  color="red"
                  class="mt-5 mx-1 float-end"
                  @click="config = ''"
                >
                  Clear
                </UButton>
                <UButton
                  color="green"
                  class="mt-5 mx-1 float-end"
                  @click="parsingConfig"
                >
                  Parse Config
                </UButton>
              </UCard>
            </UModal>
          </div>
        </div>
      </template>

      <UCard
        :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
        class="min-w-0"
      >
        <template #header>
          <UInput
            v-model="q"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search properties..."
            autofocus
          />
        </template>

        <TreeRoot
          v-if="configObj"
          v-slot="{ flattenItems }"
          v-model:expanded="expanded"
          class="list-none select-none w-full text-blackA11 rounded-lg text-sm font-medium pt-3 p-5"
          :items="filterConfig"
          :get-key="(item) => item.key"
          :default-expanded="['components']"
        >
          <h2 class="font-semibold !text-base text-blackA11 px-2 pt-1 pb-2">
            FortiOS Configuration Structure
          </h2>
          <TreeItem
            v-for="item in flattenItems"
            v-slot="{ isExpanded }"
            :key="item._id"
            :style="{ 'padding-left': `${item.level - 0.5}rem` }"
            v-bind="item.bind"
            class="flex items-center py-1 px-2 my-0.5 rounded outline-none focus:ring-grass8 focus:ring-2 data-[selected]:bg-grass4"
          >
            <template v-if="item.hasChildren">
              <Icon
                v-if="!isExpanded"
                icon="lucide:folder"
                class="h-4 w-4"
              />
              <Icon
                v-else
                icon="lucide:folder-open"
                class="h-4 w-4"
              />
            </template>
            <Icon
              v-else
              :icon="item.value.type === 'set' ? 'lucide:cog'
                : item.value.type === 'edit' ? 'lucide:pencil'
                  : item.value.type === 'config' ? 'lucide:circle-slash-2'
                    : 'lucide:circle-slash-2'"
              class="h-4 w-4"
            />
            <div class="pl-2">
              {{ item.value.type }}
              <span class="font-bold text-green-700 dark:text-green-400 ml-1">{{ item.value.name }}</span>
              <span class="font-bold text-cyan-700 dark:text-cyan-400 font-mono ml-1">{{ item.value.value }}</span>
            </div>
          </TreeItem>
        </TreeRoot>
      </UCard>
    </UDashboardSection>
  </UDashboardPanelContent>
</template>
