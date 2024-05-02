export const Categories = [
  'backdoor',
  'crypto',
  'forensic',
  'game',
  'hardware',
  'misc',
  'network',
  'progra',
  'pwn',
  'recon',
  'reverse',
  'shellcode',
  'web',
] as const

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Category = (typeof Categories)[number] | string
