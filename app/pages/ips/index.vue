<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const fileRef = ref<HTMLInputElement>()
const isDeleteAccountModalOpen = ref(false)

const state = reactive({
  name: 'Benjamin Canac',
  email: 'ben@nuxtlabs.com',
  username: 'benjamincanac',
  avatar: '',
  bio: '',
  password_current: '',
  password_new: ''
})

const toast = useToast()

function validate(state: any): FormError[] {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Please enter your name.' })
  if (!state.email) errors.push({ path: 'email', message: 'Please enter your email.' })
  if ((state.password_current && !state.password_new) || (!state.password_current && state.password_new)) errors.push({ path: 'password', message: 'Please enter a valid password.' })
  return errors
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  state.avatar = URL.createObjectURL(input.files[0])
}

function onFileClick() {
  fileRef.value?.click()
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)

  toast.add({ title: 'Profile updated', icon: 'i-heroicons-check-circle' })
}

const options = [
  { id: -1, name: 'Any Protocols', value: null },
  { id: 0, name: 'HOPOPT', value: 0 },
  { id: 1, name: 'ICMP', value: 'ICMP' },
  { id: 2, name: 'IGMP', value: 2 },
  { id: 3, name: 'GGP', value: 3 },
  // { id: 4, name: 'IPv4', value: 4 },
  { id: 5, name: 'ST', value: 5 },
  { id: 6, name: 'TCP', value: 'TCP' },
  { id: 7, name: 'CBT', value: 7 },
  { id: 8, name: 'EGP', value: 8 },
  { id: 9, name: 'IGP', value: 9 },
  { id: 10, name: 'BBN-RCC-MON', value: 10 },
  { id: 11, name: 'NVP-II', value: 11 },
  { id: 12, name: 'PUP', value: 12 },
  { id: 13, name: 'ARGUS (deprecated)', value: 13 },
  { id: 14, name: 'EMCON', value: 14 },
  { id: 15, name: 'XNET', value: 15 },
  { id: 16, name: 'CHAOS', value: 16 },
  { id: 17, name: 'UDP', value: 'UDP' },
  { id: 18, name: 'MUX', value: 18 },
  { id: 19, name: 'DCN-MEAS', value: 19 },
  { id: 20, name: 'HMP', value: 20 },
  { id: 21, name: 'PRM', value: 21 },
  { id: 22, name: 'XNS-IDP', value: 22 },
  { id: 23, name: 'TRUNK-1', value: 23 },
  { id: 24, name: 'TRUNK-2', value: 24 },
  { id: 25, name: 'LEAF-1', value: 25 },
  { id: 26, name: 'LEAF-2', value: 26 },
  { id: 27, name: 'RDP', value: 27 },
  { id: 28, name: 'IRTP', value: 28 },
  { id: 29, name: 'ISO-TP4', value: 29 },
  { id: 30, name: 'NETBLT', value: 30 },
  { id: 31, name: 'MFE-NSP', value: 31 },
  { id: 32, name: 'MERIT-INP', value: 32 },
  { id: 33, name: 'DCCP', value: 33 },
  { id: 34, name: '3PC', value: 34 },
  { id: 35, name: 'IDPR', value: 35 },
  { id: 36, name: 'XTP', value: 36 },
  { id: 37, name: 'DDP', value: 37 },
  { id: 38, name: 'IDPR-CMTP', value: 38 },
  { id: 39, name: 'TP++', value: 39 },
  { id: 40, name: 'IL', value: 40 },
  // { id: 41, name: 'IPv6', value: 41 },
  { id: 42, name: 'SDRP', value: 42 },
  { id: 43, name: 'IPv6-Route', value: 43 },
  { id: 44, name: 'IPv6-Frag', value: 44 },
  { id: 45, name: 'IDRP', value: 45 },
  { id: 46, name: 'RSVP', value: 46 },
  { id: 47, name: 'GRE', value: 47 },
  { id: 48, name: 'DSR', value: 48 },
  { id: 49, name: 'BNA', value: 49 },
  { id: 50, name: 'ESP', value: 50 },
  { id: 51, name: 'AH', value: 51 },
  { id: 52, name: 'I-NLSP', value: 52 },
  { id: 53, name: 'SWIPE (deprecated)', value: 53 },
  { id: 54, name: 'NARP', value: 54 },
  { id: 55, name: 'Min-IPv4', value: 55 },
  { id: 56, name: 'TLSP', value: 56 },
  { id: 57, name: 'SKIP', value: 57 },
  { id: 58, name: 'IPv6-ICMP', value: 58 },
  { id: 59, name: 'IPv6-NoNxt', value: 59 },
  { id: 60, name: 'IPv6-Opts', value: 60 }
]

const serviceOptions = [
  { id: -1, name: 'Any Services', description: 'No specified services', value: null },
  { id: 0, name: 'Back_orifice (bo, bo2k)', description: 'TCP/UDP, any port', value: 'BO' },
  { id: 1, name: 'DCE RPC', description: 'TCP/UDP, any port', value: 'DCERPC' },
  { id: 2, name: 'DHCP', description: 'UDP, any port', value: 'DHCP' },
  { id: 3, name: 'DNP3', description: 'TCP, any port', value: 'DNP3' },
  { id: 4, name: 'DNS', description: 'TCP/UDP, 53', value: 'DNS' },
  { id: 5, name: 'FTP', description: 'TCP, any port', value: 'FTP' },
  { id: 6, name: 'H323', description: 'TCP, 1720', value: 'H323' },
  { id: 7, name: 'HTTP', description: 'TCP, any port', value: 'HTTP' },
  { id: 8, name: 'IM (yahoo, msn, aim, qq)', description: 'TCP/UDP, any port', value: 'IM' },
  { id: 9, name: 'IMAP', description: 'TCP, any port', value: 'IMAP' },
  { id: 10, name: 'LDAP', description: 'TCP, 389', value: 'LDAP' },
  { id: 11, name: 'MSSQL', description: 'TCP, 1433', value: 'MSSQL' },
  { id: 12, name: 'NBSS', description: 'TCP, 139, 445', value: 'NBSS' },
  { id: 13, name: 'NNTP', description: 'TCP, any port', value: 'NNTP' },
  { id: 14, name: 'P2P (skype, BT, eDonkey, kazaz, gnutella, dc++)', description: 'TCP/UDP, any port', value: 'P2P' },
  { id: 15, name: 'POP3', description: 'TCP, any port', value: 'POP3' },
  { id: 16, name: 'RADIUS', description: 'UDP, 1812, 1813', value: 'RADIUS' },
  { id: 17, name: 'RDT', description: 'TCP, any port, by RTSP', value: 'RDT' },
  { id: 18, name: 'RTCP', description: 'TCP, any port, by RTSP', value: 'RTCP' },
  { id: 19, name: 'RTP', description: 'TCP, any port, by RTSP', value: 'RTP' },
  { id: 20, name: 'RTSP', description: 'TCP, any port', value: 'RTSP' },
  { id: 21, name: 'SCCP (skinny)', description: 'TCP, 2000', value: 'SCCP' },
  { id: 22, name: 'SIP', description: 'TCP/UDP, any port', value: 'SIP' },
  { id: 23, name: 'SMTP', description: 'TCP, any port', value: 'SMTP' },
  { id: 24, name: 'SNMP', description: 'UDP, 161, 162', value: 'SNMP' },
  { id: 25, name: 'SSH', description: 'TCP, any port', value: 'SSH' },
  { id: 26, name: 'SSL', description: 'TCP, any port', value: 'SSL' },
  { id: 27, name: 'SUN RPC', description: 'TCP/UDP, 111, 32771', value: 'RPC' },
  { id: 28, name: 'TELNET', description: 'TCP, 23', value: 'TELNET' },
  { id: 29, name: 'TFN', description: 'ICMP, any port', value: 'TFN' },
  { id: 30, name: 'MODBUS', description: 'TCP, 502', value: 'MODBUS' },
  { id: 31, name: 'IEC104', description: 'TCP, 2024', value: 'IEC104' },
  { id: 32, name: 'WebSocket', description: 'TCP, any port', value: 'websocket' },
  { id: 33, name: 'COTP', description: 'TCP, 102', value: 'COTP' },
  { id: 34, name: 'TFTP', description: 'UDP, any port', value: 'TFTP' }
]

const selected = ref(options[0])
const selectedService = ref(serviceOptions[0])
const value = ref('')

const makeSig = () => {

}
</script>

<template>
  <UDashboardPanelContent class="pb-24">
    <UTextarea v-model="value" />
    <UForm
      :state="state"
      :validate="validate"
      :validate-on="['submit']"
      @submit="onSubmit"
    >
      <UDashboardSection
        title="Basic Options"
        description="Define the basic property of the signature"
      >
        <template #links>
          <UButton
            type="submit"
            label="Preview Signatures"
            color="black"
          />
        </template>

        <UFormGroup
          name="name"
          label="Name"
          description="Unique for each custom signature, and mandatory in all rules. Should only contain printable characters without whitespace. With maximum length of 64 bytes."
          required
          class="grid grid-cols-2 gap-2 items-center"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.username"
            type="username"
            autocomplete="off"
            size="md"
            input-class="ps-[70px]"
          >
            <template #leading>
              <span class="text-gray-500 dark:text-gray-400 text-sm font-mono">--name</span>
            </template>
          </UInput>
        </UFormGroup>
      </UDashboardSection>

      <UDivider class="mb-4" />

      <UDashboardSection
        title="Protocol"
        description="Define the protocol properties of the signature"
      >
        <div class="grid grid-cols-2 gap-10 items-center">
          <UFormGroup
            name="name"
            label="Protocol"
            description="Protocol associated with signature, and mandatory in all rules. (--protocol)"
            required
            class="grid grid-cols-1 gap-2 items-center"
            :ui="{ container: '' }"
          >
            <USelectMenu
              v-model="selected"
              :options="options"
              placeholder="Select a protocol"
              searchable
              searchable-placeholder="Search by protocol name or id"
              option-attribute="name"
              by="id"
              :search-attributes="['name', 'id']"
            >
              <template #option="{ option: protocol }">
                <span class="truncate">{{ protocol.name }}</span>
              </template>
            </USelectMenu>
          </UFormGroup>
          <UFormGroup
            name="email"
            label="TCP Sequence"
            description="Checks the TCP sequence number value or range. (--seq)"
            required
            class="grid grid-cols-1 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.email"
              placeholder="Leave blank if no specified."
              type="text"
              autocomplete="off"
              size="md"
            />
          </UFormGroup>
        </div>

        <div class="grid grid-cols-4 gap-10 items-center">
          <UFormGroup
            name="email"
            label="Source Address"
            description="Checks the source IP address. (--src_addr)"
            required
            class="grid grid-cols-1 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.email"
              type="text"
              autocomplete="off"
              placeholder="Leave blank if no specified."
              size="md"
            />
          </UFormGroup>
          <UFormGroup
            name="email"
            label="Source Port"
            description="Checks the source port. (--src_port)"
            required
            class="grid grid-cols-1 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.email"
              type="text"
              autocomplete="off"
              placeholder="Leave blank if no specified."
              size="md"
            />
          </UFormGroup>
          <UFormGroup
            name="email"
            label="Destination Address"
            description="Checks the destination IP address. (--dst_addr)"
            required
            class="grid grid-cols-1 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.email"
              type="text"
              autocomplete="off"
              placeholder="Leave blank if no specified."
              size="md"
            />
          </UFormGroup>
          <UFormGroup
            name="email"
            label="Destination Port"
            description="Checks the destination port. (--dst_port)"
            required
            class="grid grid-cols-1 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.email"
              type="text"
              autocomplete="off"
              placeholder="Leave blank if no specified."
              size="md"
            />
          </UFormGroup>
        </div>
      </UDashboardSection>

      <UDivider class="mb-4" />

      <UDashboardSection
        title="Special Options"
        description="Define the special properties of the signature"
      >
        <UFormGroup
          name="name"
          label="Service"
          description="The service keyword is used to specify the session type associated with a packet. (--service)"
          required
          class="grid grid-cols-2 gap-2 items-center"
          :ui="{ container: '' }"
        >
          <USelectMenu
            v-model="selectedService"
            :options="serviceOptions"
            placeholder="Select a service"
            searchable
            searchable-placeholder="Search by protocol name or id"
            option-attribute="name"
            by="id"
            :search-attributes="['name', 'description']"
          >
            <template #option="{ option: service }">
              <span class="truncate">{{ service.name }} ({{ service.description }})</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup
          name="email"
          label="Source Address"
          description="Checks the source IP address. (--src_addr)"
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.email"
            type="text"
            autocomplete="off"
            size="md"
          />
        </UFormGroup>

        <UFormGroup
          name="email"
          label="Destination Address"
          description="Checks the destination IP address. (--dst_addr)"
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.email"
            type="text"
            autocomplete="off"
            size="md"
          />
        </UFormGroup>

        <UFormGroup
          name="email"
          label="TCP Sequence"
          description="Checks the TCP sequence number value or range. (--seq)"
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.email"
            type="text"
            autocomplete="off"
            size="md"
          />
        </UFormGroup>
      </UDashboardSection>
    </UForm>

    <UDivider class="mb-4" />

    <UDashboardSection
      title="Account"
      description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
    >
      <div>
        <UButton
          color="red"
          label="Delete account"
          size="md"
          @click="isDeleteAccountModalOpen = true"
        />
      </div>
    </UDashboardSection>

    <!-- ~/components/settings/DeleteAccountModal.vue -->
    <SettingsDeleteAccountModal v-model="isDeleteAccountModalOpen" />
  </UDashboardPanelContent>
</template>
