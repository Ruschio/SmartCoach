export interface IAnalysisRequest {
    code: string
    contractId: string
    tools: Array<string>
}

export interface IAnalysisResults {
    timestamp: number
    contractId: string
    results: {
        [tool: string]: Object
    }
}