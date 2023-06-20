const app = require("./app");
const http = require("http");
require("dotenv").config();
const PORT = 5000 || process.env.PORT;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}...`);
});
