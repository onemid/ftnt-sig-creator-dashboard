<script setup lang="ts">
import type { SigBody } from '~/types'
import { useSigsStore } from '~~/stores/signatures'
import sigMaker from '~/utils/sig_maker'

const sigsStore = useSigsStore()
const signature = ref(sigsStore.getSignature())
const signaturePrettier = ref('')
const sigObj: Ref<SigBody[] | null> = ref(sigsStore.getSigObject())
const signatureOptions: Ref<[]> = ref([])
const sigObjString: Ref<string | null> = ref(null)

const sigParsedColumns = [{
  key: 'actions'
}, {
  key: 'id',
  label: 'Order'
}, {
  key: 'propName',
  label: 'Property'
}, {
  key: 'propVal',
  label: 'Value'
}]

watch(signature, (newVal) => {
  sigsStore.setSignature(newVal)
  sigObj.value = sigsStore.getSigObject()
  signatureOptions.value = sigObj.value.map((obj) => {
    return obj.propName
  })
  sigObjString.value = JSON.stringify(sigObj.value)
  signaturePrettier.value = sigMaker(sigObj.value)
}, {
  immediate: true
})

const q = ref('')
const pq = ref('')
const selected = ref([])

const filteredRows = computed(() => {
  let cmpFilteredRows = sigObj.value
  if (selected.value.length > 0) {
    cmpFilteredRows = sigObj.value.filter(obj =>
      selected.value.includes(obj.propName)
    )
  }
  if (!q.value) {
    return cmpFilteredRows
  }

  return cmpFilteredRows.filter((obj) => {
    return Object.values(obj).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})

const clearFilter = () => {
  selected.value = []
}

const items = row => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid'
  }], [{
    label: 'Archive',
    icon: 'i-heroicons-archive-box-20-solid'
  }, {
    label: 'Move',
    icon: 'i-heroicons-arrow-right-circle-20-solid'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid'
  }]
]
</script>

<template>
  <UDashboardPanelContent class="pb-24">
    <UDashboardSection
      title="Signature Preview"
      description="Parsing the signature in structural way."
      orientation="horizontal"
      :ui="{ container: 'lg:sticky top-2' }"
    >
      <template #links>
        <UTextarea
          v-model="signature"
          class="font-mono w-full"
          placeholder="Please paste the signature to parse."
          :resize="true"
          :rows="15"
        />
        <UTextarea
          v-model="signaturePrettier"
          class="font-mono w-full"
          placeholder="Please paste the signature to parse."
          :resize="true"
          :rows="15"
        />
      </template>

      <UCard
        :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
        class="min-w-0"
      >
        <template #header>
          <div class="grid grid-cols-2 gap-5">
            <UInput
              v-model="q"
              placeholder="Filter property..."
              class="w-full"
            />
            <div class="flex gap-2">
              <USelectMenu
                v-model="selected"
                v-model:query="pq"
                :options="signatureOptions"
                placeholder="Select properties to preview..."
                class="w-full"
                multiple
                searchable
              >
                <template #label>
                  <span
                    v-if="selected.length"
                    class="truncate"
                  >{{ selected.join(', ') }}</span>
                  <span v-else>Select properties</span>
                </template>
              </USelectMenu>
              <UButton
                size="sm"
                :variant="selected.length === 0 ? 'soft' : 'solid'"
                color="red"
                :disabled="selected.length === 0"
                @click="clearFilter"
              >
                Clear Filter
              </UButton>
            </div>
          </div>
        </template>
        <UTable
          v-if="sigObj"
          :rows="filteredRows"
          class="w-full"
          :ui="{
            th: {
              base: 'text-left rtl:text-right',
              padding: '',
              color: 'text-gray-900 dark:text-white',
              font: 'font-semibold',
              size: 'text-sm'
            },
            td: {
              base: 'break-all',
              padding: '',
              color: 'text-gray-500 dark:text-gray-400',
              font: '',
              size: 'text-sm'
            } }"
          :columns="sigParsedColumns"
        >
          <template #actions-data="{ row }">
            <UDropdown :items="items(row)">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-ellipsis-horizontal-20-solid"
              />
            </UDropdown>
          </template>
          <template #id-data="{ row }">
            <span class="font-mono">{{ row.propOrder }}</span>
          </template>
          <template #propName-data="{ row }">
            <span class="font-mono">{{ row.propName }}</span>
          </template>
          <template #propVal-data="{ row }">
            <span class="font-mono font-bold break-all">{{ row.propVal }}</span>
          </template>
        </UTable>
      </UCard>
    </UDashboardSection>
  </UDashboardPanelContent>
</template>
