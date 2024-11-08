export function exportAsJson(data: unknown, filename: string): Promise<void> {
  return new Promise<void>(resolve => {
    const file = new Blob([JSON.stringify(data)], { type: 'application/json' })

    const a = document.createElement('a')
    const url = URL.createObjectURL(file)
    a.href = url
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    setTimeout(function () {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      resolve()
    }, 0)
  })
}
