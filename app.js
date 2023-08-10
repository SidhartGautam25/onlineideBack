const express = require('express');
const fs=require('fs');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
//const redis = require('redis');


const app = express();
const PORT = 3000;

app.use(bodyParser.text());
//const redisClient = redis.createClient();




function isValidPython(code) {
    
    const pythonCodeRegex = /^[a-zA-Z0-9\s\+\-\*\/%=\(\),;\[\]\{\}_]+$/;
  
    
    return pythonCodeRegex.test(code);
  }



app.post('/execute', (req, res) => {
    const pythonCode = req.body;


    //redisClient.get(pythonCode, (err, cachedResult) => {
       // if (err) {
         // console.error('Redis error:', err);
       // }

       // if (cachedResult) {
            
          //  res.json({ output: cachedResult });
       //   }
        //  else {



  
    
    const scriptPath = './script.py';
    fs.writeFileSync(scriptPath, pythonCode);
  
    
    const currentDirectory = __dirname;
    console.log(currentDirectory);
  
    
    const command = `docker run --rm  --cpus 0.5 --memory 256M --network none --read-only --pids-limit 50 -v ${currentDirectory}:/app python:latest python /app/${scriptPath}`;
    const time=3000;
  
    const program=exec(command, { timeout: time } ,(error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
     // redisClient.setex(pythonCode, 60 * 5, stdout);
      res.json({ output: stdout, error: stderr });
    });

    program.on('timeout', () => {
        execution.kill(); // Kill the process if it exceeds the timeout
        res.status(500).json({ error: 'Time Limit Excedded' });
      });





//}
  //  })
  });



app.listen(PORT, () => {
    console.log(__dirname)
  console.log(`Server is running on port ${PORT}`);
});
