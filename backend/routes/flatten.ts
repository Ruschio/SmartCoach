import { execSync, exec } from "child_process"
import { IFlattenRequest, IFlattenResults } from "../models/Flatten"

const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

// Endpoint for flattening request
router.post('/', (req: {body: IFlattenRequest}, res: any) => {
    const contractName = req.body.contractName // Main contract name
    const sources = req.body.code // Solidity files
    const sourceNames = Object.keys(sources) // Source names
    const timestamp = Date.now() // Project temp id
    const hardhatPath = '../hardhat/contracts' // Hardhat contracts folder
    const projectPath = `${hardhatPath}/${timestamp}` // Project folder
    const remappings = req.body.remappings?.filter(item => item.includes("=")).map(item => item.split("=")) // Divide remappings

    // Source paths
    const sourcePaths = sourceNames.reduce((map: {[name: string]: string}, name: string) => {
        map[name] = projectPath.replace(/\/?$/, '/') + name.replace(/^\/?/, '').replace(/(?:\.sol)?$/, '.sol').replace('node_modules/', 'nodemodules/')
        return map
    }, {})

    const importRegex = new RegExp(`(?<=import(.|\n)*["']).*(?=["'].*;)`, 'g') // Regex to match all import
    const pathRegex = new RegExp(`[A-Za-z0-9@].*`) // Regex to extract absolute path from import

    // Modify imports and create files
    for (const source in sources) {
        let sourceCode = sources[source] // Source code
        const sourcePath = sourcePaths[source] // Source path
        const imports = sourceCode.match(importRegex) // Get all import from source code
        
        imports?.forEach(imp => {
            const pathMatch = imp.match(pathRegex)
            if (pathMatch) {
                // Search possible remapping for the given path
                const remap = remappings?.find(([prefix]) => pathMatch[0].startsWith(prefix))
                const importPath = remap ? pathMatch[0].replace(remap[0], remap[1]) : pathMatch[0]
                const nameRegex = new RegExp(`(?<=^|\/)${importPath}`)
                const p = sourceNames.find(name => (nameRegex.test(name)))
                if (p) {
                    // Update imports with relative paths
                    const relativePath = path.relative(sourcePath, sourcePaths[p]).replace(/^(\.\.\/)/, './')
                    sourceCode = sourceCode.replace(imp, relativePath)
                }
            }
        })

        // Create file and push solidity source code
        execSync(`mkdir -p $(dirname ${sourcePath}) && touch ${sourcePath} && printf '%s\n' "${sourceCode.replace(/"/g, '\\"')}" > ${sourcePath}`, { stdio : 'pipe' })
    }

    // Execute contract flattening with HardHat framework
    let contractPath
    const contractRegex = new RegExp(`(?:^|\/)${contractName}\.sol$`)
    for (const source in sources) if (contractRegex.test(source)) contractPath = source.replace(/(?:\.sol)?$/, '.sol')
    contractPath = projectPath.replace(/\/?$/, '/') + contractPath?.replace(/^\/?/, '')
    const flatPath = projectPath.replace(/\/?$/, '/') + 'Flattened.sol'
    const execFlatten = `cd ../hardhat && npx hardhat flatten ${contractPath} > ${flatPath}`
    console.log(`Starting contract flattening: ${execFlatten}`)
    exec(execFlatten, (error: any, stdout: any, stderr: any) => {
        if (stderr) console.error(stderr)
        if (error) return res.status(500).send('Error while flattening the contract')
        const code = fs.readFileSync(flatPath, 'utf8')
        const response: IFlattenResults = {
            contractName,
            code
        }
        // Remove project files once completed
        exec(`rm -rf ${projectPath}`)
        return res.status(200).json(response).send()
    })
})

module.exports = router