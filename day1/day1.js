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
    
      var numbersStr = line.replace(/\D/g,'');

      if (numbersStr.length == 1) {
        numbersStr = numbersStr + numbersStr;
      }

      console.log(numbersStr);
      var number = Number(numbersStr[0] + numbersStr.slice(-1));

      console.log(number);

      total = total + number;

    }

    console.log(total);
  }
  
  processLineByLine('input.txt');