import { defineStore } from 'pinia'
import { parse, stringify } from 'zipson'
import type { ConfigNode, ConfigStore } from '~/types'
import configParser from '~/utils/config_parser'

export const useConfigStore = defineStore('config', {
  // a function that returns a fresh state
  state: (): ConfigStore => ({
    config: '',
    parsedConfig: []
  }),
  persist: {
    key: 'config',
    storage: persistedState.localStorage,
    serializer: {
      deserialize: parse,
      serialize: stringify
    }
  },
  getters: {

  },
  // optional actions
  actions: {
    getConfigObject(): ConfigNode[] {
      return this.parsedConfig
    },
    getConfig(): string {
      return this.config
    },
    setConfig(config: string) {
      this.config = config.trim()
      this.parsedConfig = configParser(config)
    }
  }
})
