const fs = require('fs');
const readline = require('readline');

async function processLineByLine(file) {
    const fileStream = fs.createReadStream(file);
    var total = 0;
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
  
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      console.log(`Line from file: ${line}`);
    
      let p1 = line.substring(line.indexOf(':') + 1);

      let p2 = p1.split('|');

      let winningSet = new Set(p2[0].split(/\s+/g).filter(e => e).map(Number));
      let scratchSet = new Set(p2[1].split(/\s+/g).filter(e => e).map(Number));

      let matches = [...winningSet].filter(x => scratchSet.has(x));
      console.log(matches);
      
      if (matches.length > 0) {
        let score = Math.pow(2, matches.length - 1);
        console.log(score);
        total = total + score;
      }

    }

    console.log(total);
  }
  
  processLineByLine('input-4-1.txt');