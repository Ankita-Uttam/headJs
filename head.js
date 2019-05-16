executeParsedCommand(getParsedObject());

function getArguments() {
    const [,, ...arguments] = process.argv; // TODO - understand the syntax, array destructing. Also, its cryptic usage, see if you can get something more readable/understandable
    return arguments;
}

function getParsedObject() {
    const parsedObject = {
        files: [],
        option: {
            type: null,
            count: 0
        }
    };

    let fileStartIndex = 0;
    let arguments = getArguments();

    if (arguments[0].startsWith("-n")) {
        parsedObject.option.type = 'line';
    } else if (arguments[0].startsWith("-c")) {
        parsedObject.option.type = 'byte';
    } else if (arguments[0].startsWith("-") && Number(arguments[0].substring(1, arguments[0].length))) {
        parsedObject.option.type = 'line';
    }

    if (parsedObject.option.type) {
        if (arguments[0].endsWith("-n") || arguments[0].endsWith("-c")) {
            parsedObject.option.count = Number(arguments[1]);
            fileStartIndex = 2;
        } else if (arguments[0].startsWith("-") && !(arguments[0].startsWith("-n") || arguments[0].startsWith("-c"))) {
            parsedObject.option.count = Number(arguments[0].substring(1, arguments[0].length));
            fileStartIndex = 1;
        } else {
            parsedObject.option.count = Number(arguments[0].substring(2, arguments[0].length));
            fileStartIndex = 1;
        }
    } else {
        parsedObject.option.type = 'line';
        parsedObject.option.count = 10;
    }

    for (let i = fileStartIndex; i < arguments.length; i++) { // TODO - make imperative declarative
        parsedObject.files.push(arguments[i]);
    }

    return parsedObject;
}

function executeParsedCommand(parsedObject) {
    switch(parsedObject.option.type){
        case 'line':
            if (parsedObject.option.count) {
                parsedObject.files.forEach(fileName => {
                    printLines(parsedObject, fileName);
                });
            }
            break;
        case 'byte':
            if (parsedObject.option.count) {
                parsedObject.files.forEach(fileName => {
                    printBytes(parsedObject, fileName);
                });
            }
            break;
    }
}

function printBytes(parsedObject, fileName) {
    const readable = getReadableFileStream(fileName);
    readable.on('data', (chunk) => {
        console.log('chunk size: ', chunk.length);
        if (readable.bytesRead < parsedObject.option.count)
            console.log(chunk);
    }).setEncoding('utf8');
}

function printLines(parsedObject, fileName) {
    const readLine = require('readline');
    const rl = readLine.createInterface({
        input: getReadableFileStream(fileName),
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
        printFileName(fileName);
        console.log(data);
    });
}

function  printFileName(fileName) {
    console.log('\n ==> ', fileName, ' <==');
}

function getReadableFileStream(fileName) {
    const fileStream = require('fs');
    fs = fileStream.createReadStream(fileName);
    fs.on('error' , (error) => {
        // console.log('error has occured');
        console.error(error.message);
        return;
    });
    return fs;
}
