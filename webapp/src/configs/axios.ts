import axios from 'axios'

const backendAXIOS = axios.create({
  baseURL: 'http://localhost:3000'
})

export { backendAXIOS }
