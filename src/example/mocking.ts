import axios from 'axios'

// This is the root url of Rio mocking server
// In the real world, Rio will be deployed in a remote server
// You must replace this value by Rio domain in thay case
const mockURL = 'http://localhost:8896'

export function clearStubs() {
    return axios.delete(mockURL + '/reset?namespace=reset_all');
}

export function createStubs(stub: any) {
   return axios.post(mockURL+'/stub/create_many', {stubs: [stub]});
}
