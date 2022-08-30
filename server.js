const os = require('os');
const cluster = require('cluster');
const express = require('express');
const EXPRESS_PORT = process.env.EXPRESS_PORT || 8000;

const app = express();

function delay(duration) {
   //block the event loop for {duration} milliseconds
   const startTime = Date.now();
   while(Date.now() - startTime < duration) {
      //block the event loop
   }
}

app.get('/', (req, res) => {
   res.send('Home Page Loaded');
});

app.get('/delay', (req, res) => {
   delay(9000);
   res.send('Delay Page Loaded');
});

app.listen(EXPRESS_PORT, () => {
   console.log(`Listening on API_PORT: ${EXPRESS_PORT} ...`);
});

async function startServer() {
   //Master process spawns child processes to run API
   if(cluster.isMaster) {
      //Detect number of CPUs and create child processes
      const NUM_CPUS = os.cpus().length;
      console.log(`Server has ${NUM_CPUS} logical processors.`);
      for(let cpu = 0; cpu < NUM_CPUS; cpu++) {
         console.log(`Initializing process: ${cpu}`);
         cluster.fork();
      }
   } else {
      //Child processes run API server
      app.listen(EXPRESS_PORT, () => {
         console.log(`Listening on API_PORT: ${EXPRESS_PORT} ...`);
      });
   }
}

//startServer();
