import { execSync, exec } from "child_process"
import { IAnalysisRequest, IAnalysisResults } from "../models/Analysis"

const express = require('express')
const router = express.Router()
const fs = require('fs')

// Endpoint for analysis request
router.post('/', async (req: {body: IAnalysisRequest}, res: any) => {
    const timestamp = Date.now() // Analysis timestamp
    const resultsDir = `analysis/${timestamp.toString()}` // Path of results' directory
    const logsDir = `analysis/logs/${timestamp.toString()}.log` // Path of logs' directory
    const contractId = req.body.contractId // Contract identifier
    const contractPath = `${resultsDir}/${contractId}.sol` // Contract sol file name
    const contractCode = req.body.code.replace(/"/g, '\\"') // Add backslash before double quotes
    const analysisTools = req.body.tools // List of selected tools

    // Create solidity file with contract code
    execSync(`mkdir -p $(dirname ${contractPath}) && touch ${contractPath}`, { stdio : 'pipe' })
    execSync(`printf '%s\n' "${contractCode}" > ${contractPath}`, { stdio : 'pipe' })
    
    // Execute analysis with SmartBugs framework
    const execAnalysis = `../smartbugs/smartbugs -t ${analysisTools.join(" ")} -f ${contractPath} --runid ${timestamp.toString()} --results '${resultsDir}/$TOOL' --log ${logsDir} --json`
    console.log(`Starting analysis: ${execAnalysis}`)
    exec(execAnalysis, (error: any, stdout: any, stderr: any) => {
        if (stdout) console.log(`stdout: ${stdout}`)
        if (stderr) console.error(`stderr: ${stderr}`)
        if (error) {
            console.error(`exec error: ${error}`)
            return res.status(500).send('Error executing command')
        }
        const results = new Map<string, any>()
        for (const toolName of analysisTools) {
            const resultsFile = `${resultsDir}/${toolName}/result.json`
            const analysis = fs.readFileSync(resultsFile)
            results.set(toolName, JSON.parse(analysis))
        }
        const response: IAnalysisResults = {
            timestamp,
            contractId,
            results: Object.fromEntries(results)
        }
        return res.status(200).json(response).send()
    })
})

module.exports = router