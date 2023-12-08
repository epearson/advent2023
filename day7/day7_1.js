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

    let cards = [];
  
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      console.log(`Line from file: ${line}`);
    
      let p2 = line.split(/\s+/g);

      let aHand = p2[0];
      let aHandC = [...p2[0]].map(ch => {return parseInt(ch.replace('A', 14).replace('K', 13).replace('Q', 12) 
      .replace('J', 11).replace('T', 10))});
      let theSortedHandC = aHandC.sort((a, b) => b - a); // desc
      let theHandCounts = theSortedHandC.reduce((acc, value) => ({
            ...acc,
            [value]: (acc[value] || 0) + 1
        }), 0);
      let theHandTotals = Object.values(theHandCounts).reduce((acc, value) => (acc + value), 0);

      let card = {
        hand: aHand,
        handC: aHandC,
        sortedHandC: theSortedHandC,
        handCounts: theHandCounts,
        handTotals: theHandTotals,
        bid: parseInt(p2[1]),
      }

      console.log(card);

    }

    console.log(total);
  }
  
  processLineByLine('sample.txt');