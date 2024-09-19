<script setup lang="ts">
import configParser from '~/utils/config_parser'

const isConfigModalOpen = ref(false)
const config = ref('')

const parsingConfig = () => {
  console.log(JSON.stringify(configParser(config.value)))
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
  </UDashboardPanelContent>
</template>
