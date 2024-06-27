import { getAllVersions, detectVersion, getRemoteVersion } from "../utils/solidity"
import { ICompileRequest, ICompileResults } from "../models/Compile"
import { SolidityVersions } from "../models/SolidityVersions"

const express = require('express')
const router = express.Router()

// Endpoint for compilation request
router.post('/', async (req: {body: ICompileRequest}, res: any) => {
    const code = req.body.code
    const contract = 'contract.sol'
    const releases = await getAllVersions()
    if (!releases) return res.status(500).send('Cannot retrieve remote solidity compiler')
    
    // Detect correct solidity version to compile the contract
    const availableVersions = Object.keys(releases.releases as SolidityVersions)
    const solVersion = detectVersion(code, availableVersions)
    if (!solVersion) return res.status(500).send('Cannot detect a valid solidity version')
    
    // Regular expression to exclude possible "soljson-" and ".js" in string
    const versionRegex = /soljson-(.*?)(?=.js)/
    let solRelease = releases.releases[solVersion]
    const match = solRelease.match(versionRegex)
    solRelease = match ? match[1] : solRelease

    // Get correct solidity release from remote
    const solcV = await getRemoteVersion(solRelease).then(v => v).catch(err => null)
    if (!solcV) return res.status(500).send('Cannot retrieve solidity release from remote')

    // Input for solc compilation
    const input = JSON.stringify({
        language: 'Solidity',
        sources: {
            [contract]: {
                content: code
            }
        },
        settings: {
            viaIR: true,
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    })
    // Compile contract with correct solc version
    console.log(`Starting contract compilation`)
    const compiledContract = JSON.parse(solcV.compile(input))
    if (!compiledContract.contracts) return res.status(500).send('Error while compiling the contract')
    const contractName = Object.keys(compiledContract.contracts[contract])[0]
    const results = compiledContract.contracts[contract][contractName]
    const abi = results.abi
    const bytecode = results.evm.bytecode.object
    const response: ICompileResults = {
        abi,
        bytecode,
        code,
        solidity: solVersion
    }
    return res.status(200).json(response).send()
})

module.exports = router