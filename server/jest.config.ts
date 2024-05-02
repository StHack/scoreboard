import 'jest-extended'
import { config } from 'dotenv'
import { JestConfigWithTsJest } from 'ts-jest/dist/types.js'

const conf: JestConfigWithTsJest = {
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
