import axios from 'axios'

// This is the root url of Rio of the mocking server
// In the real world test suites, Rio will be deployed in a server
// It can be accessible by other modules
const mockURL = 'http://localhost:8896'

export function clearStubs() {
    return axios.delete(mockURL + '/reset?namespace=reset_all');
}

export function createStubs(stub: any) {
   return axios.post(mockURL+'/stub/create_many', {stubs: [stub]});
}