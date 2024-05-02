export type SerializedError = { error: string }

export type Callback<T> = (arg: T) => void
export type CallbackOrError<T> = Callback<T | SerializedError>
