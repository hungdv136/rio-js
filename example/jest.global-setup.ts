import { Server } from '../sdk/server';

module.exports = async () => {
  try {
    const mockServer = new Server('http://localhost:8896');
    await mockServer.clearStubs(); // Cleanup stubs
    console.log('cleanup stubs...');
  } catch (error) {
    console.log('setup error: ', error);
  }
};
