// Function to parse the configuration file into a structured format
import type { ConfigNode, RulesMap } from '~/types'

function configParser(fileContent: string): [ConfigNode[], RulesMap] {
  // Read the file content
  const lines = fileContent.split('\n')
  const rulesMap: RulesMap = {}

  // Define the result structure
  const config: ConfigNode[] = []
  const stack: ConfigNode[] = []
  let key = 0

  // Helper function to create a new node
  const createNode = (type: string, name: string, value: string): ConfigNode => ({
    key: key++,
    type,
    name,
    value,
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
      const name = words[1]
      const value = words.slice(2).join(' ')
      const newNode = createNode('config', name, value)
      if (stack.length > 0) {
        stack[stack.length - 1].children!.push(newNode)
      } else {
        config.push(newNode)
      }
      stack.push(newNode)
    } else if (command === 'edit') {
      // Start a new edit block inside a configuration block
      // const name = words.slice(1).join(' ').replace(/"/g, '')
      const name = words[1]
      const value = words.slice(2).join(' ')
      const newNode = createNode('edit', name, value)
      stack[stack.length - 1].children!.push(newNode)
      stack.push(newNode)
    } else if (command === 'set') {
      // Add a setting to the current block (Uncomment the following 2 lines to move the set command to settings node)
      // const key = words[1]
      // stack[stack.length - 1].settings![key] = words.slice(2).join(' ').replace(/"/g, '')

      // Add a setting to the current block (Uncomment the following 2 lines to move the set command to children node)
      // const name = words.slice(1).join(' ')
      const name = words[1]
      const value = words.slice(2).join(' ')
      const newNode = createNode('set', name, value)
      delete newNode.children
      let curFlag = ''
      if (value && name === 'signature') {
        let attackId = -1
        let sigName = ''
        const regex = /(--name) *\\*"([^"\\]*)\\*" *;|(--attack_id) ([0-9]+) *;/gm
        let m
        while ((m = regex.exec(value)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++
          }

          // The result can be accessed through the `m`-variable.
          m.forEach((match) => {
            if (match) {
              if (match === '--attack_id') {
                curFlag = 'attack_id'
              } else if (match === '--name') {
                curFlag = 'name'
              } else {
                if (curFlag === 'attack_id' && match) {
                  attackId = parseInt(match)
                  curFlag = ''
                } else if (curFlag === 'name') {
                  sigName = match
                  curFlag = ''
                }
              }
            }
          })
        }
        rulesMap[attackId] = [sigName, value]
      }
      stack[stack.length - 1].children!.push(newNode)
    } else if (command === 'next') {
      // End the current edit block
      if (stack[stack.length - 1].children.length === 0) {
        delete stack[stack.length - 1].children
      }
      stack.pop()
    } else if (command === 'end') {
      // End the current configuration block
      if (stack[stack.length - 1].children.length === 0) {
        delete stack[stack.length - 1].children
      }
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

  config.sort((a, b) => {
    let result = a.type.localeCompare(b.type)
    if (!result) {
      result = a.name.localeCompare(b.name)
    }
    return result
  })
  return [config, rulesMap]
}

export default configParser
