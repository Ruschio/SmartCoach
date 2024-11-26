const axios = require('axios')
const solc = require('solc')

// Remove comments from code
const removeComments = (code: string): string => {
    // Regular expression to match comments (// ... and /* ... */)
    const commentsRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm

    // Replace comments with empty string
    let codeWithoutComments = code.replace(commentsRegex, '')
    return codeWithoutComments
}

// Get all solidity releases from online endpoint
const getAllVersions = async () => {
    const binariesListUrl = 'https://binaries.soliditylang.org/bin/list.json'
    return await axios.get(binariesListUrl)
        .then((res: any) => res.data)
        .catch((err: any) => null)
}

// Get specific solidity releases from online endpoint
const getRemoteVersion = (version: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        solc.loadRemoteVersion(version, (err: any, solcSnapshot: any) => err ? reject(err) : resolve(solcSnapshot))
    })
}

// Convert solidity version from string to array of numbers
const parseVersion = (versionString: string): number[] => {
    return versionString
        .split('.')
        .map(part => parseInt(part))
}

// Compare two solidity versions and returns:
//  = 0 if are equal
//  > 0 if v1 is greater than v2
//  < 0 if v2 is greater than v2
const compareVersions = (v1: number[], v2: number[]): number => {
    if (v1.length != v2.length) return v1.length - v2.length
    let equal = 0
    for (let i = 0; i < v1.length && equal === 0; i++) {
        equal = v1[i] - v2[i]
    }
    return equal
}

// Detect the highest common solidity version in the code
function detectVersion(contractSource: string, availableVersions: string[]): string | null {
    // Remove all possible comments from contract code
    contractSource = removeComments(contractSource)
    
    // Find all pragma solidity version occurences (=x.x.x, <x.x.x, <=x.x.x, >x.x.x, >=x.x.x, ^x.x.x, >x.x.x <y.y.y)
    
    const firstRegex = /pragma\s+solidity\s+([<>]?=?|\^|~)\s*(\d+\.\d+\.\d+)/g
    const secondRegex = /pragma\s+solidity\s+[[>]=?]*\s*\d+\.\d+\.\d+\s+([<]=?)\s*(\d+\.\d+\.\d+)/g
    const matches = [...contractSource.matchAll(firstRegex), ...contractSource.matchAll(secondRegex)]
    
    // Find the highest common solidity version for compilation
    let highestVersion: string | null = null
    for (const versionString of availableVersions) {
        const version = parseVersion(versionString)
        if (highestVersion == null || compareVersions(parseVersion(highestVersion), version) < 0) {
            let valid = true
            for (let i = 0; i < matches.length && valid; i++) {
                const sign = matches[i][1]
                const ver = parseVersion(matches[i][2])

                if (sign == '=' && compareVersions(version, ver) != 0) valid = false
                else if (sign == '>' && compareVersions(version, ver) <= 0) valid = false
                else if (sign == '>=' && compareVersions(version, ver) < 0) valid = false
                else if (sign == '<' && compareVersions(version, ver) >= 0) valid = false
                else if (sign == '<=' && compareVersions(version, ver) > 0) valid = false
                else if (sign == '^' && (compareVersions(version, ver) < 0 || version[version.length-2] > ver[ver.length-2])) valid = false
            }
            if (valid) highestVersion = versionString
        }
    }
    
    return highestVersion
}

/* const availableVersions: SolidityVersions = {
    "0.8.6": "soljson-v0.8.6+commit.11564f7e.js",
    "0.8.5": "soljson-v0.8.5+commit.a4f2e591.js",
    "0.8.4": "soljson-v0.8.4+commit.c7e474f2.js",
    "0.8.3": "soljson-v0.8.3+commit.8d00100c.js",
    "0.8.2": "soljson-v0.8.2+commit.661d1103.js",
    "0.8.1": "soljson-v0.8.1+commit.df193b15.js",
    "0.8.0": "soljson-v0.8.0+commit.c7dfd78e.js",
    "0.7.6": "soljson-v0.7.6+commit.7338295f.js",
    "0.7.5": "soljson-v0.7.5+commit.eb77ed08.js",
    // Other available versions...
};

// Example usage
const testPragmas: string = `
    // Contract source code here
    pragma solidity >= 0.7.0 =< 0.8.0;
    pragma solidity >= 0.7.1 >= 0.8.0;
    pragma solidity >= 0.7.2 <= 0.8.0;
    pragma solidity >= 0.7.3 = 0.8.0 <= 0.8.1;
    pragma solidity >= 0.7.4 ^ 0.8.0;
    pragma solidity ^   0.7.5 0.8.0;
    pragma solidity ^=   0.7.6 0.8.0;
    pragma solidity ^=   0.8.0 < 0.8.0;
    pragma solidity <   0.8.1;
    pragma solidity <=   0.8.2;
    pragma solidity <=   0.8. ;
    pragma solidity >=   0.8.4 ;
    pragma solidity >   0.8.5;
`;

const test = `pragma solidity     =     <          0.6.6;
pragma solidity ^0.7.0"` */

/* const detectVersion = (code: string): string | null => {
    // Regular expression to match pragma version (pragma solidity ...)
    const pragmaRegex = /pragma solidity\s*(?:=|>=|<=|>|<|\^)?\s*(\d+\.\d+\.\d+)/
    // /pragma solidity\s*(>=|<=|>|<|=|\^)?\s*(\d+\.\d+\.\d+)/

    // Remove comments and match first solidity version
    const match = pragmaRegex.exec(removeComments(code));
    return match ? match[1] : null;
} */

/* detectVersion(test, Object.keys(availableVersions)); */

export {
    getAllVersions,
    getRemoteVersion,
    compareVersions,
    parseVersion,
    detectVersion
}