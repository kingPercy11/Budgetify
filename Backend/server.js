const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});