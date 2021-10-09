export const Categories = [
  'backdoor',
  'crypto',
  'forensic',
  'hardware',
  'network',
  'pwn',
  'reverse',
  'shellcode',
  'web',
  'misc',
  'recon',
  'game',
] as const

export type Category = typeof Categories[number]
