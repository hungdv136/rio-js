import { Server } from '../sdk/server';

module.exports = async () => {
  try {
    const mockServer = new Server('http://localhost:8896');
    await mockServer.clearStubs(); // Clean stubs on startup
    console.log('clean all stubs...');
  } catch (error) {
    console.log('setup error: ', error);
  }
};
