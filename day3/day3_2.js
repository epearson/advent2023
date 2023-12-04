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
  
    let yIndex = 0;

    let parts = [];
    let touchMap = {};
    let lineArray = [];
    let gearMap = {};

    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      console.log(`Line from file: ${line}`);
      
      lineArray.push(line);

      //let p = line.split(/\D+/).filter(Boolean);

      //parts = parts.concat(p);

      //console.log(parts);

      let symbols = Array.from(line.matchAll(/\*/gi));

      for (let symbol of symbols) {
        let coord = symbol.index + ',' + yIndex;
        console.log('Coord: ' + coord);

        touchMap[(symbol.index + 1) + ',' + yIndex] = coord;
        touchMap[(symbol.index - 1) + ',' + yIndex] = coord;
        touchMap[(symbol.index + 1) + ',' + (yIndex + 1)] = coord;
        touchMap[(symbol.index - 1) + ',' + (yIndex - 1)] = coord;
        touchMap[(symbol.index + 1) + ',' + (yIndex - 1)] = coord;
        touchMap[(symbol.index - 1) + ',' + (yIndex + 1)] = coord;
        touchMap[symbol.index + ',' + (yIndex + 1)] = coord;
        touchMap[symbol.index + ',' + (yIndex - 1)] = coord;
        
        gearMap[coord] = [];
      }

      //console.log(symbols);

      yIndex = yIndex + 1;

    }

    for (let i = 0; i < lineArray.length; i++) {
        let line = lineArray[i];
        console.log(line);

        let numbers = Array.from(line.matchAll(/[0-9]/gi));

      let prevNumIndex = 0;
      let prevNumIsTouching = false;
      let numberStr = '';
      let isTouching = false;
      let letLastGearCoord = null;
      

      for (let j = 0; j < numbers.length; j++) {
        let number = numbers[j];
        console.log(number);
        let xyIndex = number.index + ',' + i;
        

        if (prevNumIndex + 1 == number.index) {
            numberStr = numberStr + number;
        } else {
            // if a new number and the last was touching, add to parts
            if (isTouching) {
                console.log('Adding to parts: ' + numberStr);
                gearMap[letLastGearCoord].push(parseInt(numberStr));
                parts.push(parseInt(numberStr));
            }


            numberStr = number;
            isTouching = false;
            prevNumIsTouching = false;
        }

        //console.log('Number String: ' + numberStr);

        if (!prevNumIsTouching) {
            
          
            isTouching = touchMap[xyIndex] ? true : false;
            prevNumIsTouching = isTouching;



            if (isTouching) {
              letLastGearCoord = touchMap[xyIndex];  
            }
        } else {
            //prevNumIsTouching = false; // reset
        }

        console.log(isTouching);

        prevNumIndex = number.index;

        // if last, and touching, add to parts
        if (j == numbers.length - 1 && isTouching) {
          gearMap[letLastGearCoord].push(parseInt(numberStr));
            parts.push(parseInt(numberStr));
        }
      }
    }

    console.log(parts);
    console.log(gearMap);
    //console.log(touchMap);
    total = Object.values(gearMap).reduce(
      (acc, curr) => curr.length == 2 ? acc + curr[0] * curr[1] : acc,
      0,
    );

    console.log(total);
  }
  
  processLineByLine('input-3-1.txt');