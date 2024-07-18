# SmartCoach

SmartCoach is a comprehensive framework designed to support the dynamic evolution of Solidity smart contracts. It leverages advanced capabilities to ensure the continuous monitoring, analysis, and updating of smart contracts, enhancing their security, reliability, and resilience. The project is structured into four main folders: `backend`, `webapp`, `hardhat`, and `smartbugs`.

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
  - [Backend](#backend)
  - [Webapp](#webapp)
  - [Hardhat](#hardhat)
  - [SmartBugs](#smartbugs)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Introduction

SmartCoach aims to provide a structured framework that embodies all phases and activities involved in the smart contract lifecycle. By integrating tools for monitoring, analysis, and updating, SmartCoach supports developers in identifying vulnerabilities, proposing updates, and deploying new versions of smart contracts securely and efficiently.

## Project Structure

### Backend

The `backend` folder contains the server-side code that manages operations such as handling requests, managing data, and interfacing with the blockchain network. It ensures the smooth functioning of the core features of the SmartCoach framework.

### Webapp

The `webapp` folder houses the frontend code, providing an intuitive interface for users to interact with the SmartCoach framework. It enables developers to monitor, analyze, and update smart contracts through a user-friendly web application.

### Hardhat

The `hardhat` folder includes the framework and tools necessary for Solidity development. It provides scripts for compiling, deploying, and testing smart contracts, facilitating a streamlined development process.

### SmartBugs

The `smartbugs` folder contains a standalone tool for smart contract analysis. SmartBugs utilizes various analysis tools to identify vulnerabilities in Solidity contracts, offering a detailed report of potential issues.

## Installation

To install and set up the SmartCoach project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Ruschio/SmartCoach.git
   cd SmartCoach
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Follow the [SmartBugs installation guide](https://github.com/smartbugs/smartbugs?tab=readme-ov-file#installation) to prepare your environment with the required dependencies

## Usage

1. To use the SmartCoach, start the tool application:
   ```bash
   npm run start
   ```
   
2. Then go to [localhost:5173](localhost:5173)

## License

This project is licensed under the MIT License.
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
