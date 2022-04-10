import 'jest-extended'
import type { InitialOptionsTsJest } from 'ts-jest/dist/types'
import { config } from 'dotenv'

const conf: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all'],
  // moduleNameMapper: {
  //   '^db/(.*)$': '<rootDir>/db/$1',
  //   '^models/(.*)$': '<rootDir>/models/$1',
  // },
  globals: {
    'ts-jest': {
      // ts-jest configuration goes here
    },
  },
}

if (process.env.NODE_ENV !== 'production') {
  config()
}

export default conf
