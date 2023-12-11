const fs = require('fs');
const readline = require('readline');

class Hand {

  constructor(line) {
    const p1 = line.trim().split(/\s+/g);

    this.handStr = p1[0];
    this.handArray = this.handStr.split('');
    this.handArrayC = this.handArray.map(card => Hand.cardValMap[card]);
    this.cardCountMap = this.handArrayC.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
    }), 0);
    this.maxCardCount = Math.max(...Object.values(this.cardCountMap));
    this.max2CardCount = Object.values(this.cardCountMap).sort((a,b)=>b-a)[1];
    this.maxCard = parseInt(Object.keys(this.cardCountMap).reduce((a, b) => a !== '1' && (this.cardCountMap[a] > this.cardCountMap[b]) ? a : b));
    this.bid = parseInt(p1[1]);

    // process wildcard
    this.wildHandArrayC = this.handArrayC.map((card) => card == 1 ? this.maxCard : card);
    this.wildCardCountMap = this.wildHandArrayC.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
    }), 0);
    this.wildMaxCardCount = Math.max(...Object.values(this.wildCardCountMap));
    this.wildMax2CardCount = Object.values(this.wildCardCountMap).sort((a,b)=>b-a)[1] ?? 0;

  }

  static cardValMap = {
    'A': 14,'K': 13,'Q': 12,'J': 1,'T': 10,'9': 9,'8': 8,'7': 7,'6': 6,'5': 5,'4': 4,'3': 3,'2': 2,
  }

  static handTypeValMap = {
    '5': 5.0,
    '4': 4.0,
    '3,2': 3.5,
    '3': 3.0,
    '2,2': 2.5,
    '2': 2.0,
    '1': 1.0
  }

  handType() {
    let type = '1';

    if (this.maxCardCount >= 4) {
      type = '' + this.maxCardCount;
    } else if (this.maxCardCount == 3 && this.max2CardCount == 2) {
      type = '3,2'
    } else if (this.maxCardCount == 3) {
      type = '3';
    } else if (this.maxCardCount == 2 && this.max2CardCount == 2) {
      type = '2,2';
    } else if (this.maxCardCount == 2) {
      type = '2';
    }

    return type;
  }

  wildHandType() {
    let type = '1';

    if (this.wildMaxCardCount >= 4) {
      type = '' + this.wildMaxCardCount;
    } else if (this.wildMaxCardCount == 3 && this.wildMax2CardCount == 2) {
      type = '3,2'
    } else if (this.wildMaxCardCount == 3) {
      type = '3';
    } else if (this.wildMaxCardCount == 2 && this.wildMax2CardCount == 2) {
      type = '2,2';
    } else if (this.wildMaxCardCount == 2) {
      type = '2';
    }

    return type;
  }

  handTypeValue() {
    return Hand.handTypeValMap[this.handType()];
  }

  wildHandTypeValue() {
    return Hand.handTypeValMap[this.wildHandType()];
  }

}

function getBestHand(line) {
  const hand = new Hand(line);

  return hand;
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

    let hands = [];
  
    for await (const line of rl) {
      console.log(`Line ${line}`);

      let hand = getBestHand(line);

      console.log('Hand type: ' + hand.handType());
      console.log('Hand type value: ' + hand.handTypeValue());

      //console.log(card);
      hands.push(hand);

    }

    
    // sort
    let handSort = hands.sort((a, b) => a.wildHandTypeValue() - b.wildHandTypeValue() 
      || a.handArrayC[0] - b.handArrayC[0]
      || a.handArrayC[1] - b.handArrayC[1]
      || a.handArrayC[2] - b.handArrayC[2]
      || a.handArrayC[3] - b.handArrayC[3]
      || a.handArrayC[4] - b.handArrayC[4]);

    total = hands.reduce((acc, hand, index) => (acc + ((index + 1) * hand.bid)), 0);

    console.log(hands);

    console.log(total);
    //fs.writeFileSync('./data.json', JSON.stringify(filtered, null, 2) , 'utf-8');
    
  }
  
  processLineByLine('input.txt');