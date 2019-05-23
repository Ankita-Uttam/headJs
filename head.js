const parser = require('./parseCliHeadCommand');
const fs = require('fs');

executeParsedCommand(parser.getParsedObject(process.argv.slice(2)));

function executeParsedCommand(parsedObject) {
    let output = null;
    if (parsedObject.option.count) {
        switch (parsedObject.option.type) { // TODO - you might be able to replace this switch condition with an object. Why don't you try that out.
            case 'line':
                parsedObject.files.forEach(filePath => { // TODO - see if you can get rid of the duplicated code
                    output = printLines(parsedObject, filePath);
                });
                break;
            case 'byte':
                parsedObject.files.forEach(filePath => {
                    output = printBytes(parsedObject, filePath);
                });
                break;
        }
    } else if(parsedObject.option.illegalCount) {
        // console.log('head: illegal ', parsedObject.option.type , ' count -- ', parsedObject.option.illegalCount); // TODO - long statement
        output = 'head: illegal ' + parsedObject.option.type + ' count -- ' + parsedObject.option.illegalCount;
    }
    console.log(output);
    return output;
}

function printBytes(parsedObject, filePath) {
    let output = '';

    try {
        let data = fs.readFileSync(filePath, 'utf8');
        output = Buffer.from(data).toString('utf8', 0, parsedObject.option.count);
        // console.log(output);
    } catch(e) {
        // console.log('Error:', e.stack);
        output = e.message;
    }

    return output;

}

/*
SRP - Computation (algorithm) and printing(talking to someone) are 2 things.
      HEAD                        Web Interface / HTML. console.log()
*/


function printLines(parsedObject, filePath) { // TODO - violates SRP. Lets look at things it does
    /*
    1. Load library readline
    2. Read the file
    3. Know when to stop reading the file
    4. Know how to join lines (using \n)
    5. Depends on console to print
    6. Conditionally print the file name too ( I thought we print lines? ) -- name's misleading too.
     */

    let output = '';
    let currentLine = 1;

    try {
        let data = fs.readFileSync(filePath, 'utf8').split('\n');
        while (currentLine <= parsedObject.option.count) {
            output += data[currentLine - 1] + '\n';
            currentLine++;
        }
    } catch(e) {
        // console.log('Error:', e.stack);
        output = e.message;
    }

    // console.log(output);
    return output;
}

function printFileName(filePath) {
    console.log('\n ==> ', filePath, ' <==');
}

function getReadableFileStream(filePath) {
    const fileStream = require('fs');
    const fs = fileStream.createReadStream(filePath);
    fs.on('error' , (error) => {
        console.error(error.message);
    });
    return fs;
}

module.exports = { executeParsedCommand };