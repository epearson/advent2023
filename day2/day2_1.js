/*
* which games would have been possible if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes
*/

const fs = require('fs');
const readline = require('readline');

const bag = [12,13,14];

function test(grab) {
    var pass = true;

    for (let i = 0; i < grab.length; i++) {
        if (bag[i] - grab[i] < 0) {
            pass = false;
            break;
        }
    }

    return pass;
}

function parseGame(line) {
    let game = {
        id: null,
        grabs: []
      };

      var p1 = line.split(':');

      game.id = parseInt(p1[0].replace('Game ', ''));

      var p2 = p1[1].split(';');

      //console.log(p2);

      for (let i = 0; i < p2.length; i++) {
        let p3 = p2[i];
        let p4 = p3.split(',');
        let grab = [0,0,0];

        //console.log(p3);

        for (const p5 of p4) {
            p6 = p5.trim().split(' ');
            let count = parseInt(p6[0]);
            let color = p6[1];
            switch(color) {
                case 'red':
                    grab[0] = count;
                    break;
                case 'green':
                    grab[1] = count;
                    break;
                case 'blue':
                    grab[2] = count;
                    break;
            }
        }

        game.grabs[i] = grab;

      }
      
      return game;

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
  
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      console.log(`Line from file: ${line}`);
      
      let game = parseGame(line);

      console.log(game);

      let pass = true;

      for (let grab of game.grabs) {
        pass = test(grab);

        if (!pass) {
            break;
        }
      }

      if (pass) {
        total = total + game.id;
        console.log('Game passed: ' + total);
      } else {
        console.log('Game Failed.');
      }

    }

    console.log(total);
  }
  
  processLineByLine('input-2-1.txt');