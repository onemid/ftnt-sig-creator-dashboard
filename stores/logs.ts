import { defineStore } from 'pinia'
import type { FgtLog, LogsStore } from '~/types'
import logParser from '~/utils/log_parser'

export const useLogsStore = defineStore('logs', {
  // a function that returns a fresh state
  state: (): LogsStore => ({
    logs: '',
    columns: new Set(),
    parsedLogs: []
  }),
  persist: true,
  getters: {

  },
  // optional actions
  actions: {
    getLogsObject(): FgtLog[] {
      return this.parsedLogs
    },
    getLogs(): string {
      return this.logs
    },
    setLogs(logs: string) {
      this.logs = logs.trim()
      // split by line
      this.parsedLogs = []
      const tmpParsedLogs: FgtLog[] = []
      logs.split('\n').forEach((log) => {
        const logObj = logParser(log)
        if (logObj.log.length !== 0) {
          tmpParsedLogs.push(logObj)
        }
      })
      this.parsedLogs = tmpParsedLogs.sort((a, b) => a.logTime - b.logTime)
      let preSeen = 0
      this.columns = new Set()
      const tmpColumns: Set<string> = new Set()
      for (const parsedLog of this.parsedLogs) {
        for (const logBody of parsedLog.log) {
          tmpColumns.add(logBody.propName)
        }
        preSeen += 1
        if (preSeen > 5) {
          break
        }
      }
      this.columns = tmpColumns
    }
  }
})
