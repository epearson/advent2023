const fs = require('fs');
const readline = require('readline');

function getSecondLargest(nums) {
  return nums.sort((a,b)=>b-a)[1];
 }

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
      let aHandC = [...aHand].map(ch => {return parseInt(ch.replace('A', 14).replace('K', 13).replace('Q', 12) 
      .replace('J', 11).replace('T', 10))});
      let theSortedHandC = [...aHandC].sort((a, b) => b - a); // desc
      let theHandCounts = theSortedHandC.reduce((acc, value) => ({
            ...acc,
            [value]: (acc[value] || 0) + 1
        }), 0);
      let theHandTotals = Object.values(theHandCounts).reduce((acc, value) => (acc + value), 0);
      let theUniqueCardCount = Object.keys(theHandCounts).length;

      let card = {
        hand: aHand,
        handC: aHandC,
        sortedHandC: theSortedHandC,
        uniqueCardCount: theUniqueCardCount,
        handCounts: theHandCounts,
        handTotals: theHandTotals,
        maxKinds: Math.max(...Object.values(theHandCounts)),
        secondMaxKind: getSecondLargest(Object.values(theHandCounts)),
        bid: parseInt(p2[1]),
      }

      //console.log(card);
      cards.push(card);

    }

    // sort
    let cardSort = cards.sort((a, b) => a.maxKinds - b.maxKinds 
      || a.secondMaxKind - b.secondMaxKind
      || a.handC[0] - b.handC[0]
      || a.handC[1] - b.handC[1]
      || a.handC[2] - b.handC[2]
      || a.handC[3] - b.handC[3]
      || a.handC[4] - b.handC[4]);

    console.log(cards);

    total = cards.reduce((acc, card, index) => (acc + ((index + 1) * card.bid)), 0);

    console.log(total);
  }
  
  processLineByLine('input.txt');