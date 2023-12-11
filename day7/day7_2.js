const fs = require('fs');
const readline = require('readline');

function convertCardToNum(ch) {
  return ch.replaceAll('A', 14).replaceAll('K', 13).replaceAll('Q', 12) 
  .replaceAll('J', 1).replaceAll('T', 10);
}

function convertNumToCard(num) {
  return (num + '').replaceAll(14, 'A').replaceAll(13, 'K').replaceAll(12, 'Q') 
    .replaceAll(10, 'T').replaceAll(1, 'J');
}

function getSecondLargest(nums) {
  return nums.sort((a,b)=>b-a)[1];
 }

function getBestHand(line) {
  let card = buildCard(line);

  if (!line.match('J')) {
    card.original = card.hand;
    return card;
  } else {
    let originalHand = card.hand;
    let originalHandC = [...card.handC];
    let jCount = card.handCounts['1'];
    let highCard = parseInt(card.sortedHandC[0]);
    let secondHighCard = parseInt(card.sortedHandC[0]);
    console.log(`High card: ${highCard}`);
    let maxCountCard = Object.keys(card.handCounts).reduce((a, b) => card.handCounts[a] > card.handCounts[b] ? a : b);
    console.log(maxCountCard);
    let maxMatched = card.handCounts[maxCountCard];

    console.log(`max matched: ${maxMatched}`)

    if (maxMatched == 5) {
      card = buildCard(line.replaceAll('J', 'A'));
    } else if (maxMatched == 4) {
      if (jCount == 4) {
        card = buildCard(line.replaceAll('J', 'A'));
      } else {
        card = buildCard(line.replaceAll('J', convertNumToCard(maxCountCard)));
      }
    } else if (maxMatched == 3) {
      if (jCount == 3) {
        card = buildCard(line.replaceAll('J', convertNumToCard(highCard)));
      } else {
        card = buildCard(line.replaceAll('J', convertNumToCard(maxCountCard)));
      }
    } else if (maxMatched == 2) {
      if (jCount == 2) {
        if (card.uniqueCardCount > 3) { // there isn't another pair
          card = buildCard(line.replaceAll('J', convertNumToCard(highCard)));
        } else { // there is another pair
          let pairNotJ = Object.keys(card.handCounts).reduce((a, b) => card.handCounts[a] > card.handCounts[b] && a != '1' ? a : b);
          card = buildCard(line.replaceAll('J', convertNumToCard(pairNotJ)));
        }
      } else {
        card = buildCard(line.replaceAll('J', convertNumToCard(maxCountCard)));
      }
    } else if (highCard != 'J') {
      card = buildCard(line.replaceAll('J', convertNumToCard(highCard)));
    } else {
      card = buildCard(line.replaceAll('J', convertNumToCard(secondHighCard)));
    }

    

    card.original = originalHand;
    card.handC = originalHandC;

    console.log(card);

    return card;
  }
}

function buildCard(line) {
  // Each line in input.txt will be successively available here as `line`.
  console.log(`Line from file: ${line}`);
        
  let p2 = line.split(/\s+/g);

  let aHand = p2[0];
  let aHandC = [...aHand].map(ch => {return convertCardToNum(ch)});
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
  return card;
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
      
      let card = getBestHand(line);

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

    //console.log(cards.filter(a => a.original.match('J')));

    let filtered = cards.map((curr, index, arr) => ({hand: curr.hand, orig: curr.original}));
    console.log(cards.map((curr, index, arr) => ({hand: curr.hand, orig: curr.original})));
      //.filter(a => a.orig.matchAll('J')));

    //total = cards.reduce((acc, card, index) => (acc + ((index + 1) * card.bid)), 0);

    for (let i = 0; i < cards.length; i++) {
      console.log(`${total} + (${cards[i].bid} * ${i + 1})`)
      total = total + (cards[i].bid * (i+1));
    }

    console.log(total);
    fs.writeFileSync('./data.json', JSON.stringify(filtered, null, 2) , 'utf-8');
  }
  
  processLineByLine('input.txt');