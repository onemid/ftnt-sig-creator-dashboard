<script setup lang="ts">
import { TreeItem, TreeRoot } from 'radix-vue'
import { Icon } from '@iconify/vue'
import configParser from '~/utils/config_parser'
import type { ConfigNode } from '~/types'

const isConfigModalOpen = ref(false)
const config = ref('')
const configObj: Ref<ConfigNode[]> = ref([])

const parsingConfig = () => {
  configObj.value = configParser(config.value)
  isConfigModalOpen.value = false
}
</script>

<template>
  <UDashboardPanelContent class="pb-5">
    <UCard
      :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
      class="min-w-0"
    >
      <template #header>
        <div class="flex flex-col md:flex-rol gap-3">
          <div class="flex gap-1.5">
            <UButton
              label="Paste Logs"
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
                  :options="{ theme: 'vs-light', wordWrap: 'on', minimap: { enabled: false } }"
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
    </UCard>
    <TreeRoot
      v-if="configObj"
      v-slot="{ flattenItems }"
      class="list-none select-none w-full bg-white text-blackA11 rounded-lg p-2 text-sm font-medium mt-5"
      :items="configObj"
      :get-key="(item) => item.type + item.name"
      :default-expanded="['components']"
    >
      <h2 class="font-semibold !text-base text-blackA11 px-2 pt-1">
        FortiGate Configuration Structure
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
          :icon="item.value.icon || 'lucide:file'"
          class="h-4 w-4"
        />
        <div class="pl-2">
          {{ item.value.type }} {{ item.value.name }} {{ item.value.settings }}
        </div>
      </TreeItem>
    </TreeRoot>
  </UDashboardPanelContent>
</template>
