// Define a type for the configuration structure
type ConfigNode = {
  type: string
  name: string
  settings?: { [key: string]: string }
  children?: ConfigNode[]
}

// Function to parse the configuration file into a structured format
function configParser(fileContent: string): ConfigNode[] {
  // Read the file content
  const lines = fileContent.split('\n')

  // Define the result structure
  const config: ConfigNode[] = []
  const stack: ConfigNode[] = []

  // Helper function to create a new node
  const createNode = (type: string, name: string): ConfigNode => ({
    type,
    name,
    settings: {},
    children: []
  })

  // Process each line
  lines.forEach((line) => {
    line = line.trim()
    if (line.startsWith('#') || line === '') {
      // Skip comments and empty lines
      return
    }

    const words = line.split(' ')
    const command = words[0]

    if (command === 'config') {
      // Start a new configuration block
      const name = words.slice(1).join(' ')
      const newNode = createNode('config', name)
      if (stack.length > 0) {
        stack[stack.length - 1].children!.push(newNode)
      } else {
        config.push(newNode)
      }
      stack.push(newNode)
    } else if (command === 'edit') {
      // Start a new edit block inside a configuration block
      const name = words.slice(1).join(' ').replace(/"/g, '')
      const newNode = createNode('edit', name)
      stack[stack.length - 1].children!.push(newNode)
      stack.push(newNode)
    } else if (command === 'set') {
      // Add a setting to the current block
      const key = words[1]
      const value = words.slice(2).join(' ').replace(/"/g, '')
      stack[stack.length - 1].settings![key] = value
    } else if (command === 'next') {
      // End the current edit block
      stack.pop()
    } else if (command === 'end') {
      // End the current configuration block
      stack.pop()
    } else {
      // This handles any nested configurations or unknown commands
      const current = stack[stack.length - 1]
      if (!current.children) {
        current.children = []
      }
      current.children.push({
        type: 'unknown',
        name: line,
        settings: {}
      })
    }
  })

  return config
}

export default configParser
