<script setup lang="ts">
import type { FgtLog, FgtLogBody } from '~/types'
import { useLogsStore } from '~~/stores/logs'
import fields from '~/data/pattern_fields'

const logsStore = useLogsStore()
const logs = ref(logsStore.getLogs())
const logsBodyObj: Ref<FgtLogBody[] | null> = ref([])
const logsObj: Ref<FgtLog[] | null> = ref(logsStore.getLogsObject())
const logsOptions: Ref<[]> = ref([])
const logsObjString: Ref<string | null> = ref(null)

const logsParsedColumns = ref([])
const selectedCols = ref([])
const remainedSelectedCols = ref([])
const isLogsModalOpen = ref(false)
const isLogsFieldsModalOpen = ref(false)
const isLoading = ref(false)

const q = ref('')
const pq = ref('')
const isDefaultFilterApplied = ref(false)

const sort = ref({ column: 'eventtime', direction: 'asc' as const })
const filteredRowsCnt = ref(logsBodyObj.value.length)
const page = ref(1)
const pageCount = 22

const selectedRow = ref([])
const filterOptions = ['Fulltext', 'Properties']
const selectedFilterOptions = ref('Fulltext')

const loadLogs = () => {
  isLoading.value = true
  logsObj.value = logsStore.getLogsObject()
  postProcess()
  isLoading.value = false
  isLogsModalOpen.value = false
}

const parsingLogs = () => {
  isLoading.value = true
  logsStore.setLogs(logs.value)
  logsObj.value = logsStore.getLogsObject()
  postProcess()
  isLoading.value = false
  isLogsModalOpen.value = false
}

const postProcess = () => {
  logsOptions.value = logsOptions.value.map((obj) => {
    return obj.propName
  })
  logsObjString.value = JSON.stringify(logsOptions.value)
  const arrayOfCols = Array.from(logsStore.columns)
  logsParsedColumns.value = arrayOfCols.map((elem) => {
    console.log(elem, fields[elem])
    if (fields[elem]) {
      return {
        key: elem,
        label: `${fields[elem].realName}\n(${elem})`,
        sortable: true
      }
    }
    return {
      key: elem,
      label: elem,
      sortable: true
    }
  })
  logsBodyObj.value = []
  logsObj.value.forEach((elem) => {
    logsBodyObj.value.push(elem.log.reduce((obj, item) => (obj[item.propName] = item.propVal,
    obj), {}))
  })
  remainedSelectedCols.value = Array.from(logsParsedColumns.value)
}

loadLogs()

watch(selectedCols, () => {
  remainedSelectedCols.value = Array.from(logsParsedColumns.value)
  selectedCols.value.forEach((elem) => {
    const idxToRm = remainedSelectedCols.value.findIndex(relem =>
      relem.key === elem.key
    )
    if (idxToRm !== -1) {
      remainedSelectedCols.value.splice(idxToRm, 1)
    }
  })
})

// const sort = ref({
//   column: 'eventtime',
//   direction: 'asc'
// })

const filteredRows = computed(() => {
  filteredRowsCnt.value = logsBodyObj.value.length
  if (!q.value) {
    return logsBodyObj.value
  }
  const cmpFilteredRows: FgtLogBody[] = logsBodyObj.value
  let results: FgtLogBody[] = []
  if (selectedFilterOptions.value === 'Fulltext') {
    results = cmpFilteredRows.filter((obj) => {
      return Object.entries(obj).some((kv) => {
        return (String(kv[0]) + '=' + String(kv[1])).toLowerCase().includes(q.value.toLowerCase())
      })
    })
  } else if (selectedFilterOptions.value === 'Properties') {
    // let queries = q.value.split(',')
    // queries.forEach((query) => {
    //   const querySplit = query.trim().split(/=(.*)/s)
    //   let tmpResults: FgtLogBody[] = []
    //   if (querySplit.length === 3 && querySplit[1].trim() !== '') {
    //     tmpResults = cmpFilteredRows.filter((obj) => {
    //       return Object.entries(obj).some((kv) => {
    //         return String(kv[0]) === querySplit[0].trim() && String(kv[1]).toLowerCase().startsWith(querySplit[1].trim().toLowerCase())
    //       })
    //     })
    //   }
    //   results = results.concat(tmpResults)
    // })

    // AND Op
    const queries = q.value.split(',')
    let tmpResults: FgtLogBody[] = cmpFilteredRows
    queries.forEach((query) => {
      const querySplit = query.trim().split(/=(.*)/s)
      if (querySplit.length === 3 && querySplit[1].trim() !== '') {
        tmpResults = tmpResults.filter((obj) => {
          return Object.entries(obj).some((kv) => {
            if (querySplit[0].trim().endsWith('!')) {
              console.log()
              return String(kv[0]) + '!' === querySplit[0].trim() && !(String(kv[1]).toLowerCase().startsWith(querySplit[1].trim().toLowerCase()))
            }
            return String(kv[0]) === querySplit[0].trim() && String(kv[1]).toLowerCase().startsWith(querySplit[1].trim().toLowerCase())
          })
        })
      }
    })
    results = tmpResults
  }
  page.value = 1
  filteredRowsCnt.value = results.length
  return results
})

watch(sort, () => {
  logsBodyObj.value.sort((a, b) => {
    const aStr = a[sort.value.column] ?? ''
    const bStr = b[sort.value.column] ?? ''
    if (sort.value.direction === 'asc') {
      return aStr.localeCompare(bStr)
    }
    if (sort.value.direction === 'desc') {
      return bStr.localeCompare(aStr)
    }
  })
})

const pageRows = computed(() => {
  return filteredRows.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const defaultFilter = () => {
  const defaultFilterList = ['date', 'time', 'type', 'subtype', 'level', 'action', 'utmaction', 'policyid', 'srcip', 'dstip', 'srcport', 'dstport', 'service', 'app', 'policytype', 'shapingpolicyid', 'vd', 'attack']
  const tmp = []
  defaultFilterList.forEach((elem) => {
    if (fields[elem]) {
      tmp.push({
        key: elem,
        label: `${fields[elem].realName}\n(${elem})`,
        sortable: true
      })
    } else {
      tmp.push({
        key: elem,
        label: elem,
        sortable: true
      })
    }
  })
  selectedCols.value = tmp
  isDefaultFilterApplied.value = true
}

const clearFilter = () => {
  selectedCols.value = []
  remainedSelectedCols.value = logsBodyObj.value
  isDefaultFilterApplied.value = false
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

const selectRow = (row) => {
  const index = selectedRow.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selectedRow.value.push(row)
  } else {
    selectedRow.value.splice(index, 1)
  }
}
</script>

<template>
  <UDashboardPanelContent class="pb-10">
    <UDashboardSection
      title="Logs Preview"
      description="Convert the raw logs into the tabular view."
    >
      <template #links>
        <div>
          <UButton
            label="Paste Logs"
            @click="isLogsModalOpen = true"
          />
          <UModal
            v-model="isLogsModalOpen"
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
                    Paste Logs
                  </h3>
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark-20-solid"
                    class="-my-1"
                    @click="() => {
                      isLogsModalOpen = false
                      logs = logsStore.getLogs()
                    }"
                  />
                </div>
              </template>
              <MonacoEditor
                v-model="logs"
                :disabled="isLoading"
                lang="shell"
                class="w-full h-[80%] border rounded p-1"
                :options="{ theme: 'vs-light', wordWrap: 'on', minimap: { enabled: false } }"
              />
              <UButton
                color="red"
                class="mt-5 mx-1 float-end"
                @click="logs = ''"
              >
                Clear
              </UButton>
              <UButton
                color="green"
                class="mt-5 mx-1 float-end"
                :loading="isLoading"
                @click="parsingLogs"
              >
                Parse Logs
              </UButton>
            </UCard>
          </UModal>
        </div>
        <div>
          <UButton
            label="Fields Explain"
            variant="outline"
            @click="isLogsFieldsModalOpen = true"
          />

          <UModal
            v-model="isLogsFieldsModalOpen"
            fullscreen
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
    </UDashboardSection>

    <UCard
      :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
      class="min-w-0"
    >
      <template #header>
        <div class="grid grid-cols-2 gap-5">
          <div class="flex gap-1">
            <USelectMenu
              v-model="selectedFilterOptions"
              :options="filterOptions"
            />
            <UInput
              v-if="selectedFilterOptions === 'Fulltext'"
              v-model="q"
              placeholder="Filter logs anywhere..."
              class="w-full"
            >
              <template #trailing>
                <span class="text-gray-500 dark:text-gray-400 text-xs">{{ filteredRowsCnt }} results</span>
              </template>
            </UInput>
            <UInput
              v-if="selectedFilterOptions === 'Properties'"
              v-model="q"
              placeholder="Syntax: Property1=Val_1,Property2=Val_2,..."
              class="w-full"
            >
              <template #trailing>
                <span class="text-gray-500 dark:text-gray-400 text-xs">{{ filteredRowsCnt }} results</span>
              </template>
            </UInput>
          </div>

          <div class="flex gap-2">
            <span
              v-if="isDefaultFilterApplied"
              class="w-full"
            >
              <UBadge
                class="w-full font-bold"
                size="lg"
                variant="outline"
              >Default Filter Applied</UBadge>
            </span>
            <span
              v-else
              class="w-full"
            >
              <USelectMenu
                v-model="selectedCols"
                v-model:query="pq"
                :ui-menu="{
                  height: 'max-h-[48rem]'
                }"
                :options="logsParsedColumns"
                placeholder="Select properties to preview..."
                multiple
                searchable
              />
            </span>

            <UButton
              size="sm"
              :variant="isDefaultFilterApplied ? 'soft' : 'solid'"
              color="green"
              :disabled="isDefaultFilterApplied"
              @click="defaultFilter"
            >
              Default Filter
            </UButton>
            <UButton
              size="sm"
              :variant="selectedCols.length === 0 ? 'soft' : 'solid'"
              color="red"
              :disabled="selectedCols.length === 0"
              @click="clearFilter"
            >
              Reset Filter
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
    <UTable
      v-if="logsParsedColumns.length > 0 "
      v-model:sort="sort"
      :loading="isLoading"
      :rows="logsParsedColumns.length > 0 ? pageRows : []"
      class="w-full mt-1 font-mono"
      :columns="[...selectedCols, ...remainedSelectedCols]"
      sort-mode="manual"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      :sort-button="{
        icon: 'i-heroicons-arrows-up-down-20-solid',
        trailing: true,
        square: true,
        color: 'gray',
        variant: 'ghost',
        class: '-m-1.5 text-xs font-bold text-left'
      }"
      :ui="{
        thead: 'sticky top-0 bg-white',
        th: {
          base: 'text-left rtl:text-right',
          padding: 'py-2 px-2',
          color: 'text-gray-900 dark:text-white',
          font: '',
          size: ''
        },
        td: {
          base: 'break-all',
          padding: 'py-0.5 px-2',
          color: 'text-gray-500 dark:text-gray-400',
          font: '',
          size: 'text-sm'
        }
      }
      "
    >
      <template
        #action-data="{ row }"
      >
        <span v-if="row.action">
          <UBadge
            v-if="row.action === 'accept' || row.action === 'allow' || row.action === 'pass'"
            color="green"
            class="font-bold gap-1 uppercase w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="4"
              stroke="currentColor"
              class="size-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
            {{ row.action }}
          </UBadge>
          <UBadge
            v-else-if="row.action === 'block' || row.action === 'deny' || row.action === 'drop'"
            color="red"
            class="font-bold gap-1 uppercase w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="4"
              stroke="currentColor"
              class="size-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
            {{ row.action }}
          </UBadge>
          <UBadge
            v-else-if="row.action === 'reset' || row.action === 'server-rst' || row.action === 'client-rst'"
            color="orange"
            class="font-bold gap-1 uppercase w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              class="size-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            {{ row.action }}
          </UBadge>
          <UBadge
            v-else-if="row.action === 'close'"
            color="black"
            variant="solid"
            class="font-bold gap-1 uppercase w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              class="size-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.181 8.68a4.503 4.503 0 0 1 1.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 0 0 6.364 6.365l3.129-3.129m5.614-5.615 1.757-1.757a4.5 4.5 0 0 0-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 0 1-1.242-.88 4.483 4.483 0 0 1-1.062-1.683m6.587 2.345 5.907 5.907m-5.907-5.907L8.898 8.898M2.991 2.99 8.898 8.9"
              />
            </svg>
            {{ row.action }}
          </UBadge>
          <UBadge
            v-else
            color="white"
            class="font-bold gap-1 uppercase w-full justify-center"
            variant="ghost"
          >{{ row.action }}</UBadge>
        </span>
        <span v-else />
      </template>
      <template
        #utmaction-data="{ row }"
        class="text-center"
      >
        <span v-if="row.utmaction">
          <UBadge
            v-if="row.utmaction === 'accept' || row.utmaction === 'allow' || row.utmaction === 'pass'"
            color="green"
            class="font-bold gap-1 uppercase w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="4"
              stroke="currentColor"
              class="size-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
            {{ row.utmaction }}
          </UBadge>
          <UBadge
            v-else-if="row.utmaction === 'block' || row.utmaction === 'deny' || row.utmaction === 'drop'"
            color="red"
            class="font-bold gap-1 uppercase w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="4"
              stroke="currentColor"
              class="size-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
            {{ row.utmaction }}
          </UBadge>
          <UBadge
            v-else-if="row.utmaction === 'reset' || row.utmaction === 'server-rst' || row.utmaction === 'client-rst'"
            color="orange"
            class="font-bold gap-1 uppercase w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              class="size-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            {{ row.utmaction }}
          </UBadge>
          <UBadge
            v-else-if="row.utmaction === 'close'"
            color="black"
            variant="solid"
            class="font-bold gap-1 uppercase w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              class="size-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.181 8.68a4.503 4.503 0 0 1 1.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 0 0 6.364 6.365l3.129-3.129m5.614-5.615 1.757-1.757a4.5 4.5 0 0 0-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 0 1-1.242-.88 4.483 4.483 0 0 1-1.062-1.683m6.587 2.345 5.907 5.907m-5.907-5.907L8.898 8.898M2.991 2.99 8.898 8.9"
              />
            </svg>
            {{ row.utmaction }}
          </UBadge>
          <UBadge
            v-else
            color="white"
            class="font-bold gap-1"
            variant="ghost"
          >{{ row.utmaction }}</UBadge>
        </span>
        <span v-else />
      </template>
    </UTable>
    <div
      v-if="logsBodyObj.length > 0"
      class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UPagination
        v-model="page"
        :max="12"
        :page-count="pageCount"
        :total="filteredRows.length"
        show-last
        show-first
      />
    </div>
  </UDashboardPanelContent>
</template>
