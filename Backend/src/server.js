const http = require('http');
const app = require('./app');
const env = require('./config/env');
const { testDbConnection } = require('./config/db');

const PORT = env.port;

const server = http.createServer(app);

async function startServer() {
  try {
    await testDbConnection();

    server.listen(PORT, () => {
      console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('🤕 No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();