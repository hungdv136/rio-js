import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs/promises';

export type Proto = {
  name:    string;
  file_id:  string,
  methods: string[];
  types:  string[];
}

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

  async uploadFile(path: string): Promise<string> {
    // TODO: Use stream to support uploading a large file
    const file = await fs.readFile(path);
    const form = new FormData();
    form.append('file', file, path);

    const response = await axios.post(this.rootURL + '/stub/upload', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    return response.data.data.file_id;
  }

  // upload a proto compressed file
  // compress all protos at the root with the same structure before upload
  async uploadProto(name:string, path: string): Promise<Proto> {
    const file = await fs.readFile(path);
    const form = new FormData();
    form.append('name', name);
    form.append('file', file, name);

    const response = await axios.post(this.rootURL + '/proto/upload', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    return response.data.data.proto;
  }
}
