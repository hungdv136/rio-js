import axios from 'axios';

// Mock server
export class Server {
  private rootURL: string;

  constructor(rootURL: string) {
    this.rootURL = rootURL;
  }

  // Clear all stubs in remote server by namespace
  // Default: reset_all namespace
  clearStubs(namespace = 'reset_all') {
    return axios.delete(this.rootURL + '/reset?namespace=' + namespace);
  }

  createStub(stub: any) {
    return axios.post(this.rootURL + '/stub/create_many', { stubs: [stub] });
  }

  getIncomingRequests() {
    return axios.post(this.rootURL + '/stub/incoming_request/list');
  }
}
