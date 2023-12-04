const fs = require('fs');
const readline = require('readline');

const intStrMap = {
    //'0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    //'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,

}

function getMatches(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
      matches.push(match[index]);
    }
    return matches;
  }

async function processLineByLine(file) {
    const fileStream = fs.createReadStream(file);
    var total = 0;
    var counter = 1;
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
        var logStr = counter + ', ' + line;
        //console.log('line#: ' + counter);
      // Each line in input.txt will be successively available here as `line`.
      //console.log(`Line from file: ${line}`);
    
      const regex = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/gmi;
      //const regex = /(\d|one|two|three|four|five|six|seven|eight|nine)/gmi;
        let match = Array.from(line.matchAll(regex));
        //console.log(match);
        //match = getMatches(line, regex, 1);

        var numbersStr = '';
        //console.log('matches: ' + match.length);
        //console.log(match);
        //console.log('First match: ' + match[0]);
        //console.log('Last match: ' + match[match.length-1]);

        logStr = logStr + ', ' + match[0][1] + ', ' + match[match.length-1][1];

      numbersStr = intStrMap[match[0][1]] + '' + intStrMap[match[match.length-1][1]];

      //console.log(numbersStr);

      var number = Number(numbersStr);

      logStr = logStr + ', ' + number;

      //console.log(number);

      total = total + number;

      //console.log('curr total: ' + total);
      logStr = logStr + ', ' + total;
      console.log(logStr);

      counter = counter + 1;

    }

    console.log(total);
  }
  
  processLineByLine('input.txt');

  //day1: 54390
  //day2: 54305 --wrong, too big