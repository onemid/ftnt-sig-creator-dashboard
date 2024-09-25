<script setup lang="ts">
import type { SigBody } from '~/types'
import { useSigsStore } from '~~/stores/signatures'
import sigMaker from '~/utils/sig_maker'
import patternFields from '~/data/pattern_fields'
import { MonacoEditor } from '#components'

const colorMode = useColorMode()
const sigsStore = useSigsStore()
const signature = ref(sigsStore.getSignature())
const signaturePrettier = ref('')
const sigObj: Ref<SigBody[] | null> = ref(sigsStore.getSigGroupedObject())
const signatureOptions: Ref<[]> = ref([])
const sigObjString: Ref<string | null> = ref(null)
const editorRef = ref<any>()

const mountMonacoListener = (editor) => {
  console.log(editor)
  editor.onDidChangeCursorPosition((e) => {
    console.log(editor.getSelection())
    console.log(JSON.stringify(e))
  })

  editor.onDidChangeCursorSelection((e) => {
    console.log(JSON.stringify(e))
  })
}

const isEditModalOpen = ref(false)
const editModalTitle = ref('Edit Property')
const editSigBodyVal = ref({ propOrder: -1, propName: '', propVal: '' })
const editSigPatBodyVal: Ref<SigBody[]> = ref([{ propOrder: 1, propName: '--pattern', propVal: '' }])
const editTargetOrder: Ref<number | undefined> = ref(undefined)
const selectedEditMode = ref('Property')

const sigParsedColumns = [{
  key: 'propName',
  label: 'Property'
}, {
  key: 'propVal',
  label: 'Value'
}, {
  key: 'actions'
}]

const changeSignature = (sigText: string) => {
  sigsStore.setSignature(sigText)
  sigObj.value = sigsStore.getSigGroupedObject()
  signatureOptions.value = sigObj.value.map((obj) => {
    return obj.propName
  })
  sigObjString.value = JSON.stringify(sigObj.value)
  signaturePrettier.value = sigMaker(sigsStore.getSigGroupedObject())
}

watch(signature, (newVal) => {
  changeSignature(newVal)
}, {
  immediate: true
})

watch(sigsStore.$state, () => {
  signature.value = sigsStore.getSignature()
  signaturePrettier.value = sigsStore.getSignature()
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

const openEditModal = (sigOrder: number, method: 'ADD' | 'EDIT') => {
  editTargetOrder.value = sigOrder
  if (method === 'ADD') {
    editSigBodyVal.value = { propOrder: -1, propName: '', propVal: '' }
    editSigPatBodyVal.value = [{ propOrder: 1, propName: '--pattern', propVal: '' }]
    editModalTitle.value = 'Add Property'
    isEditModalOpen.value = true
  } else if (method === 'EDIT') {
    editModalTitle.value = 'Edit Property'
    selectedEditMode.value = 'Property'
    editSigBodyVal.value.propName = sigObj.value[sigOrder - 1].propName
    editSigBodyVal.value.propOrder = sigObj.value[sigOrder - 1].propOrder
    if (sigObj.value[sigOrder - 1].propName.startsWith('PATTERN')) {
      selectedEditMode.value = 'Pattern'
      editSigPatBodyVal.value = sigObj.value[sigOrder - 1].propVal
    } else {
      editSigBodyVal.value.propVal = sigObj.value[sigOrder - 1].propVal
    }
    isEditModalOpen.value = true
  }
}

const moveSigBody = (sigOrder: number, method: 'ADD' | 'EDIT' | 'UP' | 'DOWN' | 'DELETE') => {
  if (method === 'UP' && sigOrder > 1) {
    const tempIdx = sigObj.value.findIndex(elem => elem.propOrder === sigOrder)
    const temp = sigObj.value[tempIdx - 1]
    sigObj.value[tempIdx - 1] = sigObj.value[tempIdx]
    sigObj.value[tempIdx] = temp
  } else if (method === 'DOWN' && sigOrder <= sigObj.value.length - 1) {
    const tempIdx = sigObj.value.findIndex(elem => elem.propOrder === sigOrder)
    const temp = sigObj.value[tempIdx + 1]
    sigObj.value[tempIdx + 1] = sigObj.value[tempIdx]
    sigObj.value[tempIdx] = temp
  } else if (method === 'DELETE') {
    const tempIdx = sigObj.value.findIndex(elem => elem.propOrder === sigOrder)
    sigObj.value.splice(tempIdx, 1)
  } else if (method === 'ADD') {
    const tempIdx = sigObj.value.findIndex(elem => elem.propOrder === editTargetOrder.value)
    if (selectedEditMode.value === 'Property') {
      sigObj.value = [...sigObj.value.slice(0, tempIdx + 1), editSigBodyVal.value, ...sigObj.value.slice(tempIdx + 1)]
      editSigBodyVal.value = { propOrder: -1, propName: '', propVal: '' }
    } else if (selectedEditMode.value === 'Pattern') {
      sigObj.value = [...sigObj.value.slice(0, tempIdx + 1), ...editSigPatBodyVal.value, ...sigObj.value.slice(tempIdx + 1)]
      editSigPatBodyVal.value = [{ propOrder: 1, propName: '--pattern', propVal: '' }]
    }
    editTargetOrder.value = undefined
    isEditModalOpen.value = false
  } else if (method === 'EDIT') {
    const tempIdx = sigObj.value.findIndex(elem => elem.propOrder === editTargetOrder.value)
    if (selectedEditMode.value === 'Property') {
      sigObj.value[tempIdx] = editSigBodyVal.value
      editSigBodyVal.value = { propOrder: -1, propName: '', propVal: '' }
    } else if (selectedEditMode.value === 'Pattern') {
      sigObj.value = [...sigObj.value.slice(0, tempIdx), ...editSigPatBodyVal.value, ...sigObj.value.slice(tempIdx + 1)]
      editSigPatBodyVal.value = [{ propOrder: 1, propName: '--pattern', propVal: '' }]
    }
    editTargetOrder.value = undefined
    isEditModalOpen.value = false
  }

  // Adjust the sigOrder for the overall sigBody
  changeSignature(sigMaker(sigObj.value))
}
</script>

<template>
  <UDashboardPanelContent>
    <UCard
      :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
      class="min-w-0"
    >
      <template #header>
        <MonacoEditor
          ref="editorRef"
          v-model="signature"
          lang="shell"
          class="font-mono w-full h-20 border dark:border-gray-700 rounded p-1"
          :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light', wordWrap: 'on', minimap: { enabled: false } }"
          @load="mountMonacoListener"
        />
        <!--        <MonacoEditor -->
        <!--          v-model="signaturePrettier" -->
        <!--          lang="shell" -->
        <!--          class="font-mono w-full h-20 border rounded p-1" -->
        <!--          :options="{ theme: 'vs-light', wordWrap: 'on', minimap: { enabled: false } }" -->
        <!--        /> -->
        <div class="grid grid-cols-2 gap-5 mt-2">
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
    </UCard>
    <UTable
      v-if="sigObj"
      :rows="filteredRows"
      class="w-full mt-1"
      :ui="{
        tr: {
          base: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
        },
        th: {
          base: 'text-left rtl:text-right',
          padding: 'py-1 px-0.5',
          color: 'text-gray-900 dark:text-white',
          font: 'font-semibold',
          size: 'text-sm'
        },
        td: {
          base: 'break-all',
          padding: 'py-0 px-0.5',
          color: 'text-gray-500 dark:text-gray-400',
          font: '',
          size: 'text-sm'
        } }"
      :columns="sigParsedColumns"
    >
      <template #actions-data="{ row }">
        <div class="flex w-16">
          <UButton
            color="gray"
            variant="ghost"
            size="xs"
            icon="i-heroicons-plus"
            @click="openEditModal(row.propOrder, 'ADD')"
          />
          <UButton
            color="gray"
            variant="ghost"
            size="xs"
            icon="i-heroicons-pencil"
            @click="openEditModal(row.propOrder, 'EDIT')"
          />
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="xs"
            :disabled="row.propName === '--name'"
            @click="moveSigBody(row.propOrder, 'DELETE')"
          />
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-up"
            size="xs"
            :disabled="row.propOrder === 1"
            @click="moveSigBody(row.propOrder, 'UP')"
          />
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-down"
            size="xs"
            :disabled="row.propOrder === filteredRows.length"
            @click="moveSigBody(row.propOrder, 'DOWN')"
          />
        </div>
      </template>
      <template #propName-data="{ row }">
        <div
          v-if=" row.propName.startsWith('WRONG_ORDER_')"
          class="flex gap-2"
        >
          <UBadge
            class="w-full font-bold font-mono justify-between"
            color="red"
            :label="`WRONG ${row.propName.replace('WRONG_ORDER_', '')}`"
          />
        </div>
        <div
          v-else-if=" row.propName.startsWith('PATTERN_GROUP_')"
          class="flex gap-2"
        >
          <UBadge
            class="w-full font-bold font-mono justify-center"
            color="primary"
            :label="`PATTERN ${row.propName.replace('PATTERN_GROUP_', '')}`"
          />
        </div>
        <div v-else>
          <span class="font-mono font-bold">{{ row.propName }}</span>
        </div>
      </template>
      <template
        #propVal-data="{ row }"
      >
        <div
          v-if=" row.propName.startsWith('PATTERN_GROUP')"
        >
          <ul
            role="list"
            class="divide-y divide-gray-200 dark:divide-white"
          >
            <li
              v-for="prop in row.propVal"
              :key="prop.propName"
              :class="['grid grid-cols-2 py-1.5 pr-5 text-sm leading-6',
                       prop.propName === '--pattern' || prop.propName === '--pcre' ? 'border-t-2 border-stone-300' : '']"
            >
              <div class="flex items-center">
                <svg
                  :class="['ml-1 h-1.5 w-1.5', prop.propName === '--pattern' || prop.propName === '--pcre' ? 'fill-sky-500' : 'fill-orange-400']"
                  viewBox="0 0 6 6"
                  aria-hidden="true"
                >
                  <circle
                    cx="3"
                    cy="3"
                    r="3"
                  />
                </svg>
                <div class="ml-2 flex min-w-0 flex-1 gap-2">
                  <span class="truncate font-bold font-mono">{{ prop.propName }}</span>
                </div>
                <UBadge
                  v-if="(prop.propName === '--pattern' || prop.propName === '--pcre') && prop.propVal.trim().startsWith('!')"
                  color="red"
                  class="italic font-bold"
                  variant="outline"
                  label="NEGATIVE PATTERN"
                />
              </div>
              <div class="ml-4">
                <span
                  v-if="prop.propName === '--no_case'"
                >
                  <UBadge
                    color="green"
                    class="italic font-bold"
                    variant="outline"
                    label="CASE INSENSITIVE"
                  />
                </span>
                <span
                  v-else
                  class="font-medium text-indigo-600 dark:text-white font-mono"
                >
                  {{ prop.propVal }}
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div
          v-else-if=" row.propName.startsWith('--byte_jump')"
          class="mt-1.5"
        >
          <div class="flex gap-2">
            <UBadge
              size="xs"
              class="font-bold"
              color="orange"
              variant="outline"
              label="Original Value"
            />
            <div class="font-mono font-bold break-all">
              {{ row.propVal }}
            </div>
          </div>
          <div class="flex gap-2 items-center">
            <div
              v-for="(val, idx) in row.propVal.split(',')"
              :key="idx"
              class="my-1"
            >
              <div
                v-if="idx === 0"
                class="font-bold break-all flex gap-2 "
              >
                <UBadge
                  size="xs"
                  class="font-bold"
                  variant="outline"
                  label="Bytes"
                />
                <span class="font-mono">{{ val }}</span>
              </div>
              <div
                v-if="idx === 1"
                class="font-bold break-all flex gap-2"
              >
                <UBadge
                  size="xs"
                  class="font-bold"
                  variant="outline"
                  label="Offset/Var"
                />
                <span class="font-mono">{{ val }}</span>
              </div>
              <div
                v-if="idx === 2"
                class="font-bold break-all flex gap-2"
              >
                <UBadge
                  size="xs"
                  class="font-bold"
                  variant="outline"
                  label="Multiplier"
                />
                <span class="font-mono">{{ val }}</span>
              </div>
              <div
                v-if="idx >= 3"
                class="font-bold break-all flex gap-2"
              >
                <UBadge
                  size="xs"
                  class="font-bold"
                  variant="outline"
                  :label="`Modifier ${idx - 2}`"
                /><span class="font-mono">{{ val }}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if=" row.propName.startsWith('--byte_test')"
          class="mt-1.5"
        >
          <div class="flex gap-2">
            <UBadge
              size="xs"
              class="font-bold"
              color="orange"
              variant="outline"
              label="Original Value"
            />
            <div class="font-mono font-bold break-all">
              {{ row.propVal }}
            </div>
          </div>
          <div class="flex gap-2 items-center">
            <div
              v-for="(val, idx) in row.propVal.split(',')"
              :key="idx"
              class="my-1"
            >
              <div
                v-if="idx === 0"
                class="font-bold break-all flex gap-2 "
              >
                <UBadge
                  size="xs"
                  class="font-bold"
                  variant="outline"
                  label="Bytes"
                />
                <span class="font-mono">{{ val }}</span>
              </div>
              <div
                v-if="idx === 1"
                class="font-bold break-all flex gap-2"
              >
                <UBadge
                  size="xs"
                  class="font-bold"
                  variant="outline"
                  label="Op"
                />
                <span class="font-mono">{{ val }}</span>
              </div>
              <div
                v-if="idx === 2"
                class="font-bold break-all flex gap-2"
              >
                <UBadge
                  size="xs"
                  class="font-bold"
                  variant="outline"
                  label="Value"
                />
                <span class="font-mono">{{ val }}</span>
              </div>
              <div
                v-if="idx === 3"
                class="font-bold break-all flex gap-2"
              >
                <UBadge
                  size="xs"
                  class="font-bold"
                  variant="outline"
                  label="Multiplier"
                />
                <span class="font-mono">{{ val }}</span>
              </div>
              <div
                v-if="idx >= 4"
                class="font-bold break-all flex gap-2"
              >
                <UBadge
                  size="xs"
                  class="font-bold"
                  variant="outline"
                  :label="`Modifier ${idx - 3}`"
                />
                <span class="font-mono">{{ val }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <span class="font-mono font-bold break-all">{{ row.propVal }}</span>
        </div>
      </template>
    </UTable>
    <UModal
      v-if="editTargetOrder"
      v-model="isEditModalOpen"
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
              {{ editModalTitle }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isEditModalOpen = false"
            />
          </div>
        </template>
        <UFormGroup
          class="mb-3"
          label="Choose Editing Mode"
          name="editMode"
        >
          <USelectMenu
            v-model="selectedEditMode"
            icon="i-heroicons-pencil-square"
            size="lg"
            :options="['Property', 'Pattern']"
          />
        </UFormGroup>
        <UAlert
          v-if="editModalTitle === 'Add Property' && sigObj[editTargetOrder-1].propName.startsWith('PATTERN')"
          color="green"
          variant="outline"
          :ui="{
            description: 'mt-1 text-sm leading-4 opacity-90 font-mono font-bold'
          }"
          :description="`PATTERN ${sigObj[editTargetOrder-1].propName.replace('PATTERN_GROUP_', '')}`"
          :title="`You are trying to add property after:`"
        />
        <UAlert
          v-else-if="editModalTitle === 'Add Property'"
          color="green"
          variant="outline"
          :ui="{
            description: 'mt-1 text-sm leading-4 opacity-90 font-mono font-bold'
          }"
          :description="`${sigObj[editTargetOrder-1].propName} ${sigObj[editTargetOrder-1].propVal}`"
          :title="`You are trying to add pattern property after:`"
        />
        <UAlert
          v-else-if="editModalTitle === 'Edit Property' && sigObj[editTargetOrder-1].propName.startsWith('PATTERN')"
          color="orange"
          variant="outline"
          :ui="{
            description: 'mt-1 text-sm leading-4 opacity-90 font-mono font-bold'
          }"
          :description="`PATTERN ${sigObj[editTargetOrder-1].propName.replace('PATTERN_GROUP_', '')}`"
          :title="`You are trying to edit the following signature pattern body:`"
        />
        <UAlert
          v-else-if="editModalTitle === 'Edit Property'"
          color="orange"
          variant="outline"
          :ui="{
            description: 'mt-1 text-sm leading-4 opacity-90 font-mono font-bold'
          }"
          :description="`${sigObj[editTargetOrder-1].propName} ${sigObj[editTargetOrder-1].propVal}`"
          :title="`You are trying to edit the following signature body:`"
        />

        <UDivider class="my-3" />

        <div
          v-if="selectedEditMode === 'Property'"
          class="space-y-3"
        >
          <UFormGroup
            label="Property"
            name="propName"
          >
            <UInput
              v-model="editSigBodyVal.propName"
              :autofocus="editSigBodyVal.propName === ''"
              class="font-mono"
            />
          </UFormGroup>
          <UFormGroup
            label="Value"
            name="propVal"
          >
            <UInput
              v-model="editSigBodyVal.propVal"
              :autofocus="editSigBodyVal.propName !== ''"
              class="font-mono"
            />
          </UFormGroup>
        </div>
        <div
          v-else-if="selectedEditMode === 'Pattern'"
          class="space-y-3"
        >
          <div
            v-for="(eachPat, idx) in editSigPatBodyVal"
            :key="idx"
          >
            <UFormGroup
              v-if="eachPat.propName === '--pattern' || eachPat.propName === '--pcre'"
              label="Property"
              name="propName"
            >
              <USelectMenu
                v-model="editSigPatBodyVal[idx].propName"
                :options="patternFields['patterns'].options"
                searchable
              />
            </UFormGroup>
            <UFormGroup
              v-else
              :label="`Modifier of ${editSigPatBodyVal[0].propName}`"
              name="propVal"
            >
              <USelectMenu
                v-if="editSigPatBodyVal[0].propName === '--pattern'"
                v-model="editSigPatBodyVal[idx].propName"
                :options="patternFields['patternModifiers'].options"
                searchable
              />
              <USelectMenu
                v-else-if="editSigPatBodyVal[0].propName === '--pcre'"
                v-model="editSigPatBodyVal[idx].propName"
                :options="patternFields['pcreModifiers'].options"
                searchable
              />
            </UFormGroup>

            <UFormGroup
              v-if="eachPat.propName === '--pattern' || eachPat.propName === '--pcre'"
              class="mt-2"
              label="Value"
              name="propVal"
            >
              <MonacoEditor
                v-model="editSigPatBodyVal[idx].propVal"
                lang="shell"
                class="font-mono w-full h-20 border dark:border-gray-700 rounded p-1"
                :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light', wordWrap: 'on', minimap: { enabled: false } }"
              />
            </UFormGroup>
            <UFormGroup
              v-else-if="editSigPatBodyVal[idx].propName === '--no_case'"
              class="mt-2"
              label="Value"
              name="propVal"
            >
              <UBadge
                color="green"
                class="italic font-bold"
                variant="outline"
                label="CASE INSENSITIVE"
              />
            </UFormGroup>
            <UFormGroup
              v-else
              class="mt-2"
              label="Value"
              name="propVal"
            >
              <UInput
                v-model="editSigPatBodyVal[idx].propVal"
                autofocus
                class="font-mono"
              />
            </UFormGroup>
            <UDivider class="mt-3" />
          </div>
          <div class="flex justify-center gap-2">
            <UButton
              icon="i-heroicons-plus"
              size="sm"
              color="green"
              :ui="{ rounded: 'rounded-full' }"
              variant="solid"
              label="Add Modifier"
              @click="editSigPatBodyVal.push({
                propOrder: editSigPatBodyVal.length + 1,
                propName: '--distance',
                propVal: '0'
              })"
            />
            <UButton
              v-if="editSigPatBodyVal.length >1"
              icon="i-heroicons-minus"
              size="sm"
              color="red"
              :ui="{ rounded: 'rounded-full' }"
              variant="outline"
              @click="editSigPatBodyVal.pop()"
            />
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <UButton
              v-if="editModalTitle==='Add Property'"
              color="green"
              @click="moveSigBody(editTargetOrder.value, 'ADD')"
            >
              Add Property
            </UButton>
            <UButton
              v-if="editModalTitle==='Edit Property'"
              @click="moveSigBody(editTargetOrder.value, 'EDIT')"
            >
              Edit Property
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UDashboardPanelContent>
</template>
