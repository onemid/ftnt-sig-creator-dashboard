import { defineStore } from 'pinia'
import type { SigBody, SigStore } from '~/types'
import sigParser from '~/utils/sig_parser'
import sigGrouping from '~/utils/sig_grouping'

export const useSigsStore = defineStore('signatures', {
  // a function that returns a fresh state
  state: (): SigStore => ({
    signature: 'F-SBID(--name "Fortinet.FortiGate.Signature")',
    sigBody: [{
      propOrder: 1,
      propName: '--name',
      propVal: 'Fortinet.FortiGate.Signature'
    }],
    sigGroupedBody: [{
      propOrder: 1,
      propName: '--name',
      propVal: 'Fortinet.FortiGate.Signature'
    }]
  }),
  persist: {
    key: 'signatures',
    storage: persistedState.localStorage
  },
  getters: {

  },
  // optional actions
  actions: {
    getSigObject(): SigBody[] {
      return this.sigBody
    },
    getSigGroupedObject(): SigBody[] {
      return this.sigGroupedBody
    },
    getSignature(): string {
      return this.signature
    },
    setSignature(signature: string) {
      this.signature = signature
      this.sigBody = sigParser(this.signature)
      this.sigGroupedBody = sigGrouping(this.sigBody)
    }
  }
})
