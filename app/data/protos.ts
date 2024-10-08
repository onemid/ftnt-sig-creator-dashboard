const protos = [{ id: 0, name: 'HOPOPT', value: 0, color: 'purple', variant: 'outline' },
  { id: 1, name: 'ICMP', value: 'ICMP', color: 'pink', variant: 'solid' },
  { id: 2, name: 'IGMP', value: 2, color: 'purple', variant: 'outline' },
  { id: 3, name: 'GGP', value: 3, color: 'purple', variant: 'outline' },
  { id: 4, name: 'IPv4', value: 4, color: 'amber', variant: 'solid' },
  { id: 5, name: 'ST', value: 5, color: 'purple', variant: 'outline' },
  { id: 6, name: 'TCP', value: 'TCP', color: 'green', variant: 'solid' },
  { id: 7, name: 'CBT', value: 7, color: 'purple', variant: 'outline' },
  { id: 8, name: 'EGP', value: 8, color: 'purple', variant: 'outline' },
  { id: 9, name: 'IGP', value: 9, color: 'purple', variant: 'outline' },
  { id: 10, name: 'BBN-RCC-MON', value: 10, color: 'purple', variant: 'outline' },
  { id: 11, name: 'NVP-II', value: 11, color: 'purple', variant: 'outline' },
  { id: 12, name: 'PUP', value: 12, color: 'purple', variant: 'outline' },
  { id: 13, name: 'ARGUS (deprecated)', value: 13, color: 'purple', variant: 'outline' },
  { id: 14, name: 'EMCON', value: 14, color: 'purple', variant: 'outline' },
  { id: 15, name: 'XNET', value: 15, color: 'purple', variant: 'outline' },
  { id: 16, name: 'CHAOS', value: 16, color: 'purple', variant: 'outline' },
  { id: 17, name: 'UDP', value: 'UDP', color: 'blue', variant: 'solid' },
  { id: 18, name: 'MUX', value: 18, color: 'purple', variant: 'outline' },
  { id: 19, name: 'DCN-MEAS', value: 19, color: 'purple', variant: 'outline' },
  { id: 20, name: 'HMP', value: 20, color: 'purple', variant: 'outline' },
  { id: 21, name: 'PRM', value: 21, color: 'purple', variant: 'outline' },
  { id: 22, name: 'XNS-IDP', value: 22, color: 'purple', variant: 'outline' },
  { id: 23, name: 'TRUNK-1', value: 23, color: 'purple', variant: 'outline' },
  { id: 24, name: 'TRUNK-2', value: 24, color: 'purple', variant: 'outline' },
  { id: 25, name: 'LEAF-1', value: 25, color: 'purple', variant: 'outline' },
  { id: 26, name: 'LEAF-2', value: 26, color: 'purple', variant: 'outline' },
  { id: 27, name: 'RDP', value: 27, color: 'fuchsia', variant: 'solid' },
  { id: 28, name: 'IRTP', value: 28, color: 'purple', variant: 'outline' },
  { id: 29, name: 'ISO-TP4', value: 29, color: 'purple', variant: 'outline' },
  { id: 30, name: 'NETBLT', value: 30, color: 'purple', variant: 'outline' },
  { id: 31, name: 'MFE-NSP', value: 31, color: 'purple', variant: 'outline' },
  { id: 32, name: 'MERIT-INP', value: 32, color: 'purple', variant: 'outline' },
  { id: 33, name: 'DCCP', value: 33, color: 'purple', variant: 'outline' },
  { id: 34, name: '3PC', value: 34, color: 'purple', variant: 'outline' },
  { id: 35, name: 'IDPR', value: 35, color: 'purple', variant: 'outline' },
  { id: 36, name: 'XTP', value: 36, color: 'purple', variant: 'outline' },
  { id: 37, name: 'DDP', value: 37, color: 'purple', variant: 'outline' },
  { id: 38, name: 'IDPR-CMTP', value: 38, color: 'purple', variant: 'outline' },
  { id: 39, name: 'TP++', value: 39, color: 'purple', variant: 'outline' },
  { id: 40, name: 'IL', value: 40, color: 'purple', variant: 'outline' },
  { id: 41, name: 'IPv6', value: 41, color: 'orange', variant: 'solid' },
  { id: 42, name: 'SDRP', value: 42, color: 'purple', variant: 'outline' },
  { id: 43, name: 'IPv6-Route', value: 43, color: 'orange', variant: 'solid' },
  { id: 44, name: 'IPv6-Frag', value: 44, color: 'orange', variant: 'solid' },
  { id: 45, name: 'IDRP', value: 45, color: 'purple', variant: 'outline' },
  { id: 46, name: 'RSVP', value: 46, color: 'purple', variant: 'outline' },
  { id: 47, name: 'GRE', value: 47, color: 'purple', variant: 'outline' },
  { id: 48, name: 'DSR', value: 48, color: 'purple', variant: 'outline' },
  { id: 49, name: 'BNA', value: 49, color: 'purple', variant: 'outline' },
  { id: 50, name: 'ESP', value: 50, color: 'purple', variant: 'outline' },
  { id: 51, name: 'AH', value: 51, color: 'purple', variant: 'outline' },
  { id: 52, name: 'I-NLSP', value: 52, color: 'purple', variant: 'outline' },
  { id: 53, name: 'SWIPE (deprecated)', value: 53, color: 'purple', variant: 'outline' },
  { id: 54, name: 'NARP', value: 54, color: 'purple', variant: 'outline' },
  { id: 55, name: 'Min-IPv4', value: 55, color: 'purple', variant: 'outline' },
  { id: 56, name: 'TLSP', value: 56, color: 'purple', variant: 'outline' },
  { id: 57, name: 'SKIP', value: 57, color: 'purple', variant: 'outline' },
  { id: 58, name: 'IPv6-ICMP', value: 58, color: 'pink', variant: 'solid' },
  { id: 59, name: 'IPv6-NoNxt', value: 59, color: 'orange', variant: 'solid' },
  { id: 60, name: 'IPv6-Opts', value: 60, color: 'orange', variant: 'solid' }
]

export default protos
