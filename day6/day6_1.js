const fs = require('fs');
const readline = require('readline');

// https://stackoverflow.com/questions/33454438/quadratic-equation-solver-in-javascript
function quad(a, b, c) {
    var result = (-1 * b + Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
    var result2 = (-1 * b - Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
    return [result, result2];
}

async function processLineByLine(file) {
    const fileStream = fs.createReadStream(file);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    let times = [];
    let distances = [];
  
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      console.log(`Line from file: ${line}`);
    
      p1 = line.split(':');

      if(p1[0].trim() == 'Time') {
        times = p1[1].trim().split(/\s+/).map(Number);
        console.log(times);
      } else {
        distances = p1[1].trim().split(/\s+/).map(Number);
        console.log(distances);
      }

    }

    let total = 1;

    for (let i = 0; i < times.length; i++) {
        let tmax = times[i];
        let dmin = distances[i];
        console.log(`time ${tmax}, distance ${dmin}`);

        let result = quad(-1,tmax,-1*dmin);

        console.log(result);

        let start = Number.isInteger(result[0]) ? result[0] + 1 : Math.ceil(result[0]);
        let end = Number.isInteger(result[1]) ? result[1] - 1 : Math.floor(result[1]);

        console.log(`${start}, ${end}`);

        total = total * (end - start + 1);

    }

    console.log(total);
  }
  
  processLineByLine('input.txt');