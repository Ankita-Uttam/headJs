let parser = require('./parseCliHeadCommand');

executeParsedCommand(parser.getParsedObject(process.argv.slice(2)));

function executeParsedCommand(parsedObject) {
    if (parsedObject.option.count) {
        switch (parsedObject.option.type) {
            case 'line':
                    parsedObject.files.forEach(filePath => {
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
        console.log('head: illegal ', parsedObject.option.type , ' count -- ', parsedObject.option.illegalCount);
    }
}

function printBytes(parsedObject, filePath) {
    const readable = getReadableFileStream(filePath);
    readable.on('data', (chunk) => {
        console.log('chunk size: ', chunk.length);
        if (readable.bytesRead < parsedObject.option.count)
            console.log(chunk);
    }).setEncoding('utf8');
}

function printLines(parsedObject, filePath) {
    const readLine = require('readline');
    const rl = readLine.createInterface({
        input: getReadableFileStream(filePath),
        crlfDelay: Infinity
    });

    let currentLine = 1;
    let data = '';

    rl.on('line' , (line) => {
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

function  printFileName(filePath) {
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

