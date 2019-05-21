let parser = require('./parseCliHeadCommand');

executeParsedCommand(parser.getParsedObject(process.argv.slice(2)));

function executeParsedCommand(parsedObject) {
    if (parsedObject.option.count) {
        switch (parsedObject.option.type) { // TODO - you might be able to replace this switch condition with an object. Why don't you try that out.
            case 'line':
                    parsedObject.files.forEach(filePath => { // TODO - see if you can get rid of the duplicated code
                        printLines(parsedObject, filePath);
                    });
                break;
            case 'byte':
                    parsedObject.files.forEach(filePath => {
                        printBytes(parsedObject, filePath);
                    });
                break;
        }
    } else if(parsedObject.option.illegalCount) {
        console.log('head: illegal ', parsedObject.option.type , ' count -- ', parsedObject.option.illegalCount); // TODO - long statement
    }
}

function printBytes(parsedObject, filePath) {
    const readable = getReadableFileStream(filePath);
    readable.on('data', (chunk) => {
        if (parsedObject.files.length > 1) {
            printFileName(filePath);
        }
        console.log(chunk.toString('utf8', 0, parsedObject.option.count));
    });
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
    const readLine = require('readline'); // TODO - I am not sure what I feel about doing requires within methods. Vs top level requires. Explicit dependencies are better than implicit dependencies.
    const rl = readLine.createInterface({
        input: getReadableFileStream(filePath),
        crlfDelay: Infinity
    });

    let currentLine = 1;
    let data = '';

    rl.on('line' , (line) => { // TODO - check performace on a really large file (~1.5GB, 20GB) and compare it with head implemented in bash.
        if (currentLine > parsedObject.option.count)
            return;
        data += line + '\n';
        currentLine++;
    }).on('close', () => {
        if (parsedObject.files.length > 1) {
            printFileName(filePath);
        }
        console.log(data);
    });
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

