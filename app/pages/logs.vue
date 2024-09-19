<script setup lang="ts">
import fields from '~/data/fields'

const isLogsFieldsModalOpen = ref(false)
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Logs Preview">
        <template #right>
          <div>
            <UButton
              label="Fields Explain"
              variant="outline"
              @click="isLogsFieldsModalOpen = true"
            />

            <UModal
              v-model="isLogsFieldsModalOpen"
            >
              <UCard
                :ui="{
                  base: 'h-fit flex flex-col',
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
                      Fields Explain
                    </h3>
                    <UButton
                      color="gray"
                      variant="ghost"
                      icon="i-heroicons-x-mark-20-solid"
                      class="-my-1"
                      @click="() => {
                        isLogsFieldsModalOpen = false
                      }"
                    />
                  </div>
                </template>
                <UContainer class="overflow-y-auto h-full">
                  <UAccordion
                    color="blue"
                    variant="solid"
                    size="md"
                    :items="
                      Object.keys(fields).sort().map((key, index) => {
                        const field = fields[key];
                        return {
                          label: `${index + 1}. ${field.realName} (${key})`,
                          content: `${field.realName} - ${field.description}`
                        };
                      })"
                  />
                </UContainer>
              </UCard>
            </UModal>
          </div>
        </template>
      </UDashboardNavbar>

      <!--      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto"> -->
      <!--        <UHorizontalNavigation :links="links" /> -->
      <!--      </UDashboardToolbar> -->

      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>
