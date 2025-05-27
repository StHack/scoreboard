import {
  Achievement,
  Attempt,
  Challenge,
  Message,
  Reward,
  TimestampedServerActivityStatistics,
  User,
} from '@sthack/scoreboard-common'
import { useEffect, useState } from 'react'

export enum BackupDataType {
  achievements = 'achievements',
  attempts = 'attempts',
  challenges = 'challenges',
  // files = 'files',
  messages = 'messages',
  rewards = 'rewards',
  serveractivitystatistics = 'serveractivitystatistics',
  users = 'users',
}

export type BackupDataTypeMap = {
  [BackupDataType.achievements]: Achievement[]
  [BackupDataType.attempts]: Attempt[]
  [BackupDataType.challenges]: Challenge[]
  // [BackupDataType.files]: Record<string, unknown>[]
  [BackupDataType.messages]: Message[]
  [BackupDataType.rewards]: Reward[]
  [BackupDataType.serveractivitystatistics]: TimestampedServerActivityStatistics[]
  [BackupDataType.users]: User[]
}

export type useBackupDataReturn<T> = {
  data?: T
  loading: boolean
  error?: Error
}
export function useBackupData<K extends BackupDataType>(
  year: number,
  type: K,
): useBackupDataReturn<BackupDataTypeMap[K]> {
  const [data, setData] = useState<BackupDataTypeMap[K]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (isNaN(year) || !Object.values(BackupDataType).includes(type)) {
      setData([])
      setLoading(false)
      setError(new Error('Invalid year or backup type'))
      return
    }

    setLoading(true)
    setError(undefined)
    fetch(`${import.meta.env.BASE_URL}backups/${year}/${type}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(raw => setData(deserializeMongo(raw) as BackupDataTypeMap[K]))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [year, type])

  return { data, loading, error }
}

function deserializeMongo(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(item => deserializeMongo(item))
  }

  if (obj && typeof obj === 'object') {
    // $oid
    if ('$oid' in obj && typeof obj['$oid'] === 'string') {
      return obj['$oid']
    }

    // $date
    if ('$date' in obj && typeof obj['$date'] === 'string') {
      return new Date(obj['$date'])
    }
    // Recursively process all properties
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(obj)) {
      result[key] = deserializeMongo((obj as Record<string, unknown>)[key])
    }

    return result
  }

  return obj
}
