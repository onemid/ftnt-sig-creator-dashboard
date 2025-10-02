<script setup lang="ts">
import protos from '../../data/protos'
import type { FgtLog, FgtLogBody } from '~/types'
import { useLogsStore } from '~~/stores/logs'
import fields from '~/data/fields'

const colorMode = useColorMode()
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
const isLoading = ref(false)
const isAddPopoverOpen = ref(false)
const isEditPopoverOpen = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const q = ref('')
const pq = ref('')
const newQuery = ref('')
const isDefaultFilterApplied = ref(false)

const selectedFilters = ref([])
const filterAppliedOptions = ref([])

const mulFilters = computed({
  get: () => selectedFilters.value,
  set: async (filters) => {
    const promises = filters.map(async (filter) => {
      if (filter.id) {
        return filter
      }

      const response = {
        id: filterAppliedOptions.value.length + 1,
        name: filter.name
      }

      filterAppliedOptions.value.push(response)

      return response
    })

    selectedFilters.value = await Promise.all(promises)
  }
})

const sort = ref({ column: 'eventtime', direction: 'asc' as const })
const filteredRowsCnt = ref(logsBodyObj.value.length)
const page = ref(1)
// const pageCount = 22
const pageCount = 100

const filterOptions = ['Fulltext', 'Properties', 'Complex']
const selectedFilterOptions = ref('Fulltext')

const loadLogs = () => {
  isLoading.value = true
  logsStore.setLogs(logsStore.logs)
  logsObj.value = logsStore.getLogsObject()
  if (logs.value.length > 0 && logsObj.value.length === 0) {
    parsingLogs()
    return
  }
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

const addMulFilter = () => {
  mulFilters.value.push({ id: mulFilters.value.length, name: newQuery.value })
  isAddPopoverOpen.value = false
  newQuery.value = ''
}

const editMulFilter = (idx: number) => {
  mulFilters.value[idx] = { id: idx, name: newQuery.value }
  isEditPopoverOpen.value = false
  newQuery.value = ''
}

const deleteMulFilter = (idx: number) => {
  mulFilters.value.splice(idx, 1)
  isEditPopoverOpen.value = false
  newQuery.value = ''
}

const filteredRows = computed(() => {
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  filteredRowsCnt.value = logsBodyObj.value.length
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  page.value = 1
  let results: FgtLogBody[] = []
  if ((selectedFilterOptions.value === 'Complex' && selectedFilters.value.length === 0)
    || ((selectedFilterOptions.value === 'Fulltext' || selectedFilterOptions.value === 'Properties') && !q.value)) {
    results = logsBodyObj.value
  } else {
    const cmpFilteredRows: FgtLogBody[] = logsBodyObj.value
    if (selectedFilterOptions.value === 'Fulltext') {
      results = cmpFilteredRows.filter((obj) => {
        return Object.entries(obj).some((kv) => {
          return (String(kv[0]) + '=' + String(kv[1])).toLowerCase().includes(q.value.toLowerCase())
        })
      })
    } else if (selectedFilterOptions.value === 'Properties') {
      const queries = q.value.split(',')
      let tmpResults: FgtLogBody[] = cmpFilteredRows
      queries.forEach((query) => {
        const querySplit = query.trim().split(/=(.*)/s)
        if (querySplit.length === 3 && querySplit[1].trim() !== '') {
          tmpResults = tmpResults.filter((obj) => {
            return Object.entries(obj).some((kv) => {
              if (querySplit[0].trim().endsWith('!')) {
                return String(kv[0]) + '!' === querySplit[0].trim() && !(String(kv[1]).toLowerCase().startsWith(querySplit[1].trim().toLowerCase()))
              }
              return String(kv[0]) === querySplit[0].trim() && String(kv[1]).toLowerCase().startsWith(querySplit[1].trim().toLowerCase())
            })
          })
        }
      })
      results = tmpResults
    } else if (selectedFilterOptions.value === 'Complex') {
      let tmpResults: FgtLogBody[] = cmpFilteredRows
      for (const selectedFilter of selectedFilters.value) {
        const tmpDictResults = {}
        const queries = selectedFilter.name.split('||')
        queries.forEach((query) => {
          const querySplit = query.trim().split(/=(.*)/s)
          if (querySplit.length === 3 && querySplit[1].trim() !== '') {
            const tmpFilterResults = tmpResults.filter((obj) => {
              return Object.entries(obj).some((kv) => {
                querySplit[0] = querySplit[0].trim().toLowerCase()
                querySplit[1] = querySplit[1].trim().toLowerCase()
                if (querySplit[0].endsWith('!')) {
                  if (querySplit[1].startsWith('*') && querySplit[1].endsWith('*')) {
                    return String(kv[0]) + '!' === querySplit[0] && !(String(kv[1]).toLowerCase().includes(querySplit[1].slice(1, -1)))
                  } else if (querySplit[1].startsWith('*')) {
                    return String(kv[0]) + '!' === querySplit[0] && !(String(kv[1]).toLowerCase().endsWith(querySplit[1].slice(1)))
                  } else if (querySplit[1].endsWith('*')) {
                    return String(kv[0]) + '!' === querySplit[0] && !(String(kv[1]).toLowerCase().startsWith(querySplit[1].slice(0, -1)))
                  } else {
                    return String(kv[0]) + '!' === querySplit[0] && !(String(kv[1]).toLowerCase() === (querySplit[1]))
                  }
                } else {
                  if (querySplit[1].startsWith('*') && querySplit[1].endsWith('*')) {
                    return String(kv[0]) === querySplit[0] && String(kv[1]).toLowerCase().includes(querySplit[1].slice(1, -1))
                  } else if (querySplit[1].trim().startsWith('*')) {
                    return String(kv[0]) === querySplit[0] && String(kv[1]).toLowerCase().endsWith(querySplit[1].slice(1))
                  } else if (querySplit[1].trim().endsWith('*')) {
                    return String(kv[0]) === querySplit[0] && String(kv[1]).toLowerCase().startsWith(querySplit[1].slice(0, -1))
                  } else {
                    return String(kv[0]) === querySplit[0] && String(kv[1]).toLowerCase() === (querySplit[1])
                  }
                }
              })
            })
            const tmpDictInnerResults = Object.fromEntries(tmpFilterResults.map(x =>
              [x.id ?? x.eventtime, x]))
            Object.assign(tmpDictResults, tmpDictInnerResults)
          }
        })
        tmpResults = Object.entries(tmpDictResults).map((elem) => {
          return elem[1]
        })
      }
      results = tmpResults
    }
  }

  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  filteredRowsCnt.value = results.length

  return results
})

const rows = computed(() => {
  return filteredRows.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
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

const defaultFilter = () => {
  const defaultFilterList = ['date', 'time', 'proto', 'action', 'utmaction', 'policyid', 'policyname', 'policytype',
    'srcip', 'dstip', 'srcport', 'dstport', 'service', 'app', 'sessionid', 'vd', 'attack']
  const tmp = []
  defaultFilterList.forEach((elem) => {
    if (fields[elem] && logsParsedColumns.value.findIndex((col) => {
      return col.key === elem
    }) !== -1) {
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

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      logs.value = content
    }
    reader.readAsText(file)
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
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
                    <div class="flex items-center gap-2">
                      <input
                        ref="fileInput"
                        type="file"
                        accept=".txt,.log"
                        class="hidden"
                        @change="handleFileUpload"
                      >
                      <UButton
                        color="blue"
                        variant="soft"
                        icon="i-heroicons-arrow-up-tray"
                        @click="triggerFileUpload"
                      >
                        Upload File
                      </UButton>
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
                  </div>
                </template>
                <MonacoEditor
                  v-model="logs"
                  :disabled="isLoading"
                  lang="shell"
                  class="w-full h-[80%] border rounded p-1"
                  :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light', wordWrap: 'on', minimap: { enabled: false } }"
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
              >
                <template #label>
                  <span
                    v-if="selectedCols.length"
                    class="truncate text-xs font-bold"
                  >{{ selectedCols.map((selectedCol) => selectedCol.label.split('(')[0]).join(' ; ') }}</span>
                  <span v-else>Select properties</span>
                </template>
              </USelectMenu>
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
          <div class="flex gap-1 grow">
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
              class="w-full font-mono"
            >
              <template #trailing>
                <span class="text-gray-500 dark:text-gray-400 text-xs">{{ filteredRowsCnt }} results</span>
              </template>
            </UInput>
            <div
              v-if="selectedFilterOptions === 'Complex'"
              class="flex gap-1  flex-wrap"
            >
              <div
                v-for="(mulFilter, idx) in mulFilters"
                :key="idx"
                class="flex gap-1 items-center font-mono"
              >
                <UPopover
                  :popper="{ placement: 'top-start' }"
                >
                  <UButton
                    color="white"
                    :label="`(${mulFilter.name.split('||').join(' OR ')})`"
                    trailing-icon="i-heroicons-pencil-square"
                    @click="() => { newQuery = mulFilters[idx].name }"
                  />

                  <template #panel>
                    <div class="p-4 w-96">
                      <UButtonGroup
                        size="sm"
                        class="w-full"
                        orientation="horizontal"
                      >
                        <UInput
                          v-model="newQuery"
                          class="w-full"
                          autofocus
                          placeholder="Place the query..."
                        />
                        <UButton
                          icon="i-heroicons-check"
                          color="green"
                          @click="editMulFilter(idx)"
                        />
                        <UButton
                          icon="i-heroicons-trash"
                          color="red"
                          @click="deleteMulFilter(idx)"
                        />
                      </UButtonGroup>
                    </div>
                  </template>
                </UPopover>
                <div
                  v-if="idx !== mulFilters.length - 1"
                  class="font-bold"
                >
                  AND
                </div>
              </div>
              <div
                class="font-bold gap-1 flex flex-wrap"
              >
                <UPopover>
                  <UButton
                    color="green"
                    :label="!mulFilters.length ? 'Add Filter' : ''"
                    trailing-icon="i-heroicons-plus"
                  />

                  <template #panel>
                    <div class="p-4 w-96">
                      <UButtonGroup
                        size="sm"
                        class="w-full"
                        orientation="horizontal"
                      >
                        <UInput
                          v-model="newQuery"
                          autofocus
                          class="w-full"
                          placeholder="Place the query..."
                        />
                        <UButton
                          icon="i-heroicons-check"
                          color="green"
                          @click="addMulFilter"
                        />
                      </UButtonGroup>
                    </div>
                  </template>
                </UPopover>
                <UPopover>
                  <UButton
                    color="primary"
                    variant="outline"
                    trailing-icon="i-heroicons-question-mark-circle"
                  />

                  <template #panel>
                    <div class="w-96">
                      <UDivider
                        label="Basic Usage"
                        class="pt-4"
                      />
                      <div class="p-4 text-xs">
                        Syntax: <span class="font-mono">PropertyName=DesireValue</span>
                        <br>
                        Example: <span class="font-mono">srcport=8080</span>
                      </div>
                      <UDivider label="[Or] Query Syntax" />
                      <div class="p-4 text-xs">
                        Syntax: <span class="font-mono">Prop1=Val1||Prop2=Val2||...</span>
                        <br>
                        Example: <span class="font-mono">srcport=8080||srcport=443</span>
                      </div>
                      <UDivider label="[And] Query Syntax" />
                      <div class="p-4 text-xs">
                        Simply Click the <span class="font-bold">Add Filter</span> button to add a new filter.
                      </div>
                      <UDivider label="Wildcard Syntax" />
                      <div class="p-4 text-xs">
                        Match Start: <span class="font-mono">PropertyName=ABC*</span>
                        <br>
                        Example: <span class="font-mono">srcport=80*</span> (match the text which prefix is 80)
                        <br>
                        <br>
                        Match End: <span class="font-mono">PropertyName=*ABC</span>
                        <br>
                        Example: <span class="font-mono">srcport=*80</span> (match the text which suffix is 80)
                        <br>
                        <br>
                        Match Include: <span class="font-mono">PropertyName=*ABC*</span>
                        <br>
                        Example: <span class="font-mono">srcport=*80*</span> (match the text which includes 80)
                      </div>
                    </div>
                  </template>
                </UPopover>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UCard>
    <UTable
      v-if="filteredRows.length > 0"
      v-model:sort="sort"
      :loading="isLoading"
      :rows="rows"
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
        thead: 'sticky top-0 bg-white dark:bg-gray-900',
        tr: {
          base: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
        },
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
        #proto-data="{ row }"
      >
        <span v-if="row.proto">
          <UBadge
            v-if="parseInt(row.proto) < protos.length"
            :color="protos[parseInt(row.proto)].color"
            :variant="protos[parseInt(row.proto)].variant"
            class="font-bold gap-1 uppercase w-full justify-center justify-items-center"
          >
            {{ row.proto }}
            {{ protos[parseInt(row.proto)].name }}
          </UBadge>
          <UBadge
            v-else
            color="green"
            variant="outline"
            class="font-bold gap-1 uppercase w-full justify-center justify-items-center"
          >
            {{ row.proto }}
          </UBadge>
        </span>
      </template>
      <template
        #action-data="{ row }"
      >
        <span v-if="row.action">
          <UBadge
            v-if="row.action === 'accept' || row.action === 'allow' || row.action === 'pass'"
            color="green"
            class="font-bold gap-1 uppercase w-full justify-center justify-items-center"
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
            v-else-if="row.action === 'block' || row.action === 'deny'"
            color="red"
            class="font-bold gap-1 uppercase w-full justify-center justify-items-center"
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
            v-else-if="row.action.startsWith('drop')"
            color="black"
            class="gap-1 uppercase w-full justify-center justify-items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="size-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            <span class="font-bold">{{ row.action }}</span>
          </UBadge>
          <UBadge
            v-else-if="row.action === 'reset' || row.action === 'server-rst' || row.action === 'client-rst'"
            color="orange"
            class="font-bold gap-1 uppercase w-full justify-center justify-items-center"
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
            class="font-bold gap-1 uppercase w-full justify-center justify-items-center"
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
            class="font-bold gap-1 uppercase w-full justify-center justify-items-center"
            variant="outline"
          >{{ row.action }}</UBadge>
        </span>
        <span v-else />
      </template>
      <template
        #utmaction-data="{ row }"
      >
        <span v-if="row.utmaction">
          <UBadge
            v-if="row.utmaction === 'accept' || row.utmaction === 'allow' || row.utmaction === 'pass'"
            color="green"
            class="font-bold gap-1 uppercase w-full justify-center justify-items-center"
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
            v-else-if="row.utmaction === 'block' || row.utmaction === 'deny'"
            color="red"
            class="font-bold gap-1 uppercase w-full justify-center justify-items-center"
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
            v-else-if="row.utmaction.startsWith('drop')"
            color="black"
            class="gap-1 uppercase w-full justify-center justify-items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="size-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            <span class="font-bold">{{ row.utmaction }}</span>
          </UBadge>
          <UBadge
            v-else-if="row.utmaction === 'reset' || row.utmaction === 'server-rst' || row.utmaction === 'client-rst'"
            color="orange"
            class="font-bold gap-1 uppercase w-full justify-center justify-items-center"
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
            class="font-bold gap-1 uppercase w-full justify-center justify-items-center"
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
