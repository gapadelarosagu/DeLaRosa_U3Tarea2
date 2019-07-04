const app = require('../server'); //esta el express ya configurado
const config = require('../_config');

const server = require('http').Server(app);

const port = config.PORT;

server.listen(port);

console.log(`Server is running on port ${port}`);
