import type { LogFields } from '~/types'

const fields: LogFields = {
  date: {
    realName: 'Date',
    description: 'Day, month, and year when the log message was recorded.'
  },
  direction: {
    realName: 'Direction',
    description: 'Indicates message/packets direction.'
  },
  time: {
    realName: 'Time',
    description: 'Hour clock when the log message was recorded.'
  },
  tz: {
    realName: 'TZ',
    description: 'Timezone'
  },
  duration: {
    realName: 'Duration',
    description: 'Duration of the session, in seconds.'
  },
  sessionid: {
    realName: 'Session ID',
    description: 'ID for the session.'
  },
  vd: {
    realName: 'VDOM',
    description: 'Name of the virtual domain in which the log message was recorded.'
  },
  transport: {
    realName: 'NAT Translation',
    description: 'NAT source port.'
  },
  srcip: {
    realName: 'Src IP',
    description: 'IP address of the traffic\u2019s origin.\r\nThe source varies by the direction:\n\n\nIn HTTP requests, this is the web\r\nbrowser or other client.\n\n\nIn HTTP responses, this is the\r\nphysical server.'
  },
  transip: {
    realName: 'NAT IP',
    description: 'NAT source IP.'
  },
  srcport: {
    realName: 'Src Port ',
    description: 'Port number of the traffic\'s origin.'
  },
  srccountry: {
    realName: 'Src Country',
    description: 'Name of the source country.'
  },
  srcintf: {
    realName: 'Src Interface',
    description: 'Interface name of the traffic\'s origin.'
  },
  srcname: {
    realName: 'Src Name',
    description: 'Name of the source.'
  },
  srcintfrole: {
    realName: 'Src Interface Name',
    description: 'Name of the source interface.'
  },
  devtype: {
    realName: 'Device Type',
    description: 'Device type of the source.'
  },
  osname: {
    realName: 'OS',
    description: 'OS of the source.'
  },
  mastersrcmac: {
    realName: 'Master Src MAC',
    description: 'The master MAC address for a host that has multiple network\r\ninterfaces.'
  },
  srcmac: {
    realName: 'Src MAC',
    description: 'MAC address associated with the source IP address.'
  },
  srcserver: {
    realName: 'Source Server',
    description: 'Server of the source.'
  },
  devid: {
    realName: 'Device ID',
    description: 'Serial number of the device for the traffic\'s origin.'
  },
  dstip: {
    realName: 'Dst IP',
    description: 'Destination IP address for the web.'
  },
  dstport: {
    realName: 'Dst Port',
    description: 'Port number of the traffic\'s destination.'
  },
  dstdevtype: {
    realName: 'Dst Device Type',
    description: 'Device type of the destination.'
  },
  dstcountry: {
    realName: 'Dst Country',
    description: 'Name of the destination country.'
  },
  dstintf: {
    realName: 'Dst Interface',
    description: 'Interface of the traffic\'s destination.'
  },
  dstname: {
    realName: 'Dst Name',
    description: 'Name of the destination.'
  },
  dsthwvendor: {
    realName: 'Dst HW. Vendor',
    description: 'Name of the destination hardware vendor.'
  },
  dstintfrole: {
    realName: 'Dst Interface Name',
    description: 'Name of the destination interface.'
  },
  masterdstmac: {
    realName: 'Master Dst MAC',
    description: 'The master MAC address for a host that has multiple network\r\ninterfaces.'
  },
  dstmac: {
    realName: 'Dst MAC',
    description: 'MAC address associated with the destination IP address.'
  },
  dstserver: {
    realName: 'Dst Server',
    description: 'Server of the destination.'
  },
  app: {
    realName: 'App Name',
    description: 'Name of the application.'
  },
  appcat: {
    realName: 'AppCtrl Category',
    description: 'Category of the application.'
  },
  applist: {
    realName: 'AppCtrl Profile Name',
    description: 'Application Control profile name'
  },
  appact: {
    realName: 'AppCtrl Security Action',
    description: 'The security action from app control'
  },
  service: {
    realName: 'Service',
    description: 'Name of the service.'
  },
  appid: {
    realName: 'App ID',
    description: 'ID of the application.'
  },
  apprisk: {
    realName: 'App Risk',
    description: 'Risk level of the application.'
  },
  countapp: {
    realName: 'countapp',
    description: 'Number of App Ctrl logs associated with the session.'
  },
  rcvdbyte: {
    realName: 'Rcvd bytes',
    description: 'Number of bytes received.'
  },
  rcvdpkt: {
    realName: 'Rcvd packets',
    description: 'Number of packets received.'
  },
  sentbyte: {
    realName: 'Sent bytes',
    description: 'Number of bytes sent.'
  },
  sentpkt: {
    realName: 'Sent packets',
    description: 'Number of packets sent.'
  },
  action: {
    realName: 'Action',
    description: 'Status of the session. Uses following definitions:\r\n\t\t\t\t\t\tDeny: blocked by firewall policyStart: session start log (special option to enable logging at start of a session). This means firewall allowed.All Others: allowed by Firewall Policy and the status indicates how it was closed.'
  },
  policyid: {
    realName: 'Policy ID',
    description: 'ID of the firewall policy\r\ngoverning the traffic which caused\r\nthe log message.'
  },
  policyname: {
    realName: 'Policy Name',
    description: 'Name of the firewall policy\r\ngoverning the traffic which caused\r\nthe log message.'
  },
  poluuid: {
    realName: 'Policy UUID',
    description: 'UUID for the firewall policy.'
  },
  policytype: {
    realName: 'Policy Type',
    description: ''
  },
  policymode: {
    realName: 'Policy Mode',
    description: 'Firewall policy mode.'
  },
  level: {
    realName: 'Level',
    description: 'Security level rating.'
  },
  eventtime: {
    realName: 'Event Time',
    description: 'Epoch time the log was triggered by FortiGate. If you convert the epoch time to human readable time, it might not match the Date and Time in the header owing to a small delay between the time the log was triggered and recorded. The Log Time field is the same for the same log among all log devices, but the Date and Time might differ.'
  },
  proto: {
    realName: 'Protocol #',
    description: 'tcp: The protocol used by web traffic (tcp by default)'
  },
  type: {
    realName: 'Type',
    description: 'Log type. See Type'
  },
  subtype: {
    realName: 'Sub Type',
    description: 'Log sub-type.'
  },
  logid: {
    realName: 'Log ID',
    description: 'Log ID. See Log ID definitions'
  },
  trandisp: {
    realName: 'NAT Translation Type',
    description: 'NAT translation type.'
  },
  utmaction: {
    realName: 'UTM Action',
    description: 'Security action performed by UTM.'
  },
  utmref: {
    realName: 'UTM Ref',
    description: 'UTM reference number.'
  }
}

export default fields
