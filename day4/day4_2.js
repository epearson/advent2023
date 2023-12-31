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
      //console.log(`Line from file: ${line}`);
    
      let p1 = line.substring(line.indexOf(':') + 1);

      let p2 = p1.split('|');

      let winningSet = new Set(p2[0].split(/\s+/g).filter(e => e).map(Number));
      let scratchSet = new Set(p2[1].split(/\s+/g).filter(e => e).map(Number));

      let matches = [...winningSet].filter(x => scratchSet.has(x));
      //console.log('# Matches: ' + matches.length);

      cards.push({
            numMatches: matches.length,
            cardCount: 1
        });

    }

    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];

        if (card.numMatches > 0) {
            for (let j = 1; j <= card.numMatches; j++) {
                if (i + j < cards.length) {
                    cards[i + j].cardCount = cards[i + j].cardCount + card.cardCount;
                } else {
                    break;
                }
            }
        }
    }

    //console.log(cards);

    total = cards.reduce(
        (acc, curr) => acc + curr.cardCount,
        0,
      );

    console.log(total);
    console.log(Date.now() - startTime);
  }
  
  let startTime = Date.now();
  processLineByLine('input.txt');