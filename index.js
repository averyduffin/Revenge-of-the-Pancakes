import fs from 'fs'
import readline from 'readline'

import path from 'path'
const outputDir = 'output'
const outFilePath = path.join(__dirname, `${outputDir}/${process.argv[2]}.output`)
const fullOutputPath = path.join(__dirname, `${outputDir}`);

if (!fs.existsSync(fullOutputPath)){
    fs.mkdirSync(fullOutputPath);
}

fs.unlink(outFilePath, () => {
    const readInterface = readline.createInterface({  
        input: fs.createReadStream(path.join(__dirname, `test-cases/${process.argv[2]}.in`)),
        console: false
    });

    let totalCases = 0
    let caseNumber = 0
    let totalData = ''

    const calculateFlips = (pancakes) => {
        let flipCounter = 0
        let prev = pancakes[0]
        for(let letter of pancakes) {
            if(prev !== letter) {
                flipCounter++;
                prev = letter;
            }
        }
        if(pancakes[pancakes.length -1] === '-') flipCounter++;
        return flipCounter;
    }

    readInterface.on('line', (line) => {
        if(caseNumber === 0) {
            totalCases = Number(line);
            if(!totalCases || totalCases < 0 ) throw new Error("Invalid File Format"); // just in case the file is in an incorrect format
        }
        else if(caseNumber <= totalCases) { // in the rare chance that there are more cases then specified
            const data = `Case #${caseNumber}: ${calculateFlips(line)}`
            console.log(data);
            totalData = `${totalData}${data}\n`
        }
        caseNumber++;
    });

    readInterface.on('close', () => {
        fs.appendFile(outFilePath, totalData, (err) => {
            if (err) {
                return console.log('Unable to write to file');
            }
        })
    });
});
