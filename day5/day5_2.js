const fs = require('fs');
const readline = require('readline');

function doMap(seed, mapper) {
    let mValue = seed;

    for (let range of mapper) {
        if (seed >= range[1] && seed <= range[1] + range[2]) {
            //console.log(range);

            mValue = range[0] + (seed - range[1]);

            break;
        }
    }

    //console.log('mValue: ' + mValue);

    return mValue;
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
  
    let lineIndex = 0;
    let seedMapIndex = 0;
    let currentMapName = null;

    let seedMap = {
        seeds: null,
        mappings: {},
    };

    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      console.log(`Line from file: ${line}`);
    
        if (line.trim().length > 0 && line.trim().match(/^\D.*/)) {
            let p1 = line.split(':');

            currentMapName = p1[0].trim();

            if (currentMapName == 'seeds') {
                seedMap.seeds = p1[1].trim().split(/\s+/).map(Number);
            } else {
                seedMap.mappings[currentMapName] = {};
                seedMap.mappings[currentMapName].ranges = [];
                seedMap.mappings[currentMapName].converted = {};
            }
            
        } else if (line.trim().match(/^\d.*/)) { // if the line starts with a number
            let p1 = line.trim().split(/\s+/).map(Number);
            //console.log(p1);
            seedMap.mappings[currentMapName].ranges.push(p1);
            
        } else {
            // treat the empty line as a delimiter
            seedMapIndex++;
        }

      lineIndex++;
    }

    let sts = seedMap.mappings['seed-to-soil map'].ranges;
    let stf = seedMap.mappings['soil-to-fertilizer map'].ranges;
    let ftw = seedMap.mappings['fertilizer-to-water map'].ranges;
    let wtl = seedMap.mappings['water-to-light map'].ranges;
    let ltt = seedMap.mappings['light-to-temperature map'].ranges;
    let tth = seedMap.mappings['temperature-to-humidity map'].ranges;
    let htl = seedMap.mappings['humidity-to-location map'].ranges;

    let lowLoc = null;

    for (let i = 0; i < seedMap.seeds.length; i+=2) {
        const seedStart = seedMap.seeds[i];
        const seedLength = seedMap.seeds[i + 1];

        console.log('Seed start: ' + seedStart + ', length: ' + seedLength);

        for (let seed = seedStart; seed < (seedStart + seedLength); seed++) {

            //console.log('Seed: ' + seed);

            let mValue = doMap(doMap(doMap(doMap(doMap(doMap(doMap(seed, sts), stf), ftw), wtl), ltt), tth), htl);

            //console.log('location: ' + mValue);

            if (lowLoc == null) {
                lowLoc = mValue;
            } else if (mValue < lowLoc) {
                lowLoc = mValue;
            }
        }
    }

    console.log(lowLoc);
  }
  
  processLineByLine('input.txt');