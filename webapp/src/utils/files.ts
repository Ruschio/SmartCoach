const readFile = (file: File): Promise<string> => {
  const reader = new FileReader()
  reader.readAsText(file)
  return new Promise((resolve, reject) => {
    reader.addEventListener('load', () =>
      reader.result ? resolve(reader.result.toString()) : reject(null)
    )
  })
}

export { readFile }
