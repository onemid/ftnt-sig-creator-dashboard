import type { Avatar } from '#ui/types'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'

export interface User {
  id: number
  name: string
  email: string
  avatar?: Avatar
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: Avatar
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

// Below is the ftnt sig

export interface SigBody {
  propOrder: number
  propName: string
  propVal: string | SigBody[]
}

export interface SigStore {
  signature: string
  sigBody: SigBody[]
  sigGroupedBody: SigBody[]
}

// Below is the fgt log

export interface FgtLogBody {
  propOrder: number
  propName: string
  propVal: string
  propSearch: string
}

export interface FgtLog {
  logOrder: number
  logTime: number | null
  log: FgtLogBody[]
}

export interface LogsStore {
  logs: string
  columns: Set<string>
  parsedLogs: FgtLog[]
}

type LogField = {
  realName: string
  description: string
}

type LogFields = {
  [key: string]: LogField
}

type LimitedOption = {
  limit: string
  options: string[]
}

type LimitedOptions = {
  [key: string]: LimitedOption
}
