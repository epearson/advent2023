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

            var destRangeStart = p1[0];
            var srcRangeStart = p1[1];
            var rangeLen = p1[2];

            //console.log('range: ' + srcRangeStart);

            for (let i = 0; i < rangeLen; i++) {
                seedMap.mappings[currentMapName].converted[srcRangeStart + i] = destRangeStart + i;
            }
            
        } else {
            // treat the empty line as a delimiter
            seedMapIndex++;
        }

      lineIndex++;
    }

    let sts = seedMap.mappings['seed-to-soil map'].converted;
    let stf = seedMap.mappings['soil-to-fertilizer map'].converted;
    let ftw = seedMap.mappings['fertilizer-to-water map'].converted;
    let wtl = seedMap.mappings['water-to-light map'].converted;
    let ltt = seedMap.mappings['light-to-temperature map'].converted;
    let tth = seedMap.mappings['temperature-to-humidity map'].converted;
    let htl = seedMap.mappings['humidity-to-location map'].converted;

    let locations = [];
    
    let lowLoc = null;

    // for each seed
    for (let i = 0; i < seedMap.seeds.length; i++) {
        let seed = seedMap.seeds[i];
        let soil = sts['' + seed] ?? seed;
        let fertilizer = stf['' + soil] ?? soil;
        let water = ftw['' + fertilizer] ?? fertilizer;
        let light = wtl['' + water] ?? water;
        let temperature = ltt['' + light] ?? light;
        let humidity = tth['' + temperature] ?? temperature;
        let location = htl['' + humidity] ?? humidity;

        locations.push(location);

        if (lowLoc == null) {
            lowLoc = location;
        } else if (location < lowLoc) {
            lowLoc = location;
        }
        
    }

    console.log(locations);

    //console.dir(seedMap, { depth: null });
    console.log(lowLoc);
  }
  
  processLineByLine('input.txt');