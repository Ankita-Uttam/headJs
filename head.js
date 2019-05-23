const parser = require('./parseCliHeadCommand');
const fs = require('fs');

executeParsedCommand(parser.getParsedObject(process.argv.slice(2)));

function executeParsedCommand(parsedObject) {
    let output = '';
    if (parsedObject.option.count) {
        switch (parsedObject.option.type) { // TODO - you might be able to replace this switch condition with an object. Why don't you try that out.
            case 'line':
                parsedObject.files.forEach(filePath => { // TODO - see if you can get rid of the duplicated code
                    output += printLines(parsedObject, filePath);
                });
                break;
            case 'byte':
                parsedObject.files.forEach(filePath => {
                    output += printBytes(parsedObject, filePath);
                });
                break;
        }
    } else if (parsedObject.option.illegalCount) {
        output = 'head: illegal ' + parsedObject.option.type + ' count -- ' + parsedObject.option.illegalCount;// TODO - long statement
    }
    console.log(output);
    return output;
}

function printBytes(parsedObject, filePath) {
    let output = '';
    const fileProperties = getFileProperties(filePath);

    if (fileProperties.validFilepath) {
        if (parsedObject.files.length > 1)
            output += printFileName(filePath);
        output += Buffer.from(fileProperties.content).toString('utf8', 0, parsedObject.option.count);
    } else {
        output += fileProperties.content;
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
    let fileProperties = getFileProperties(filePath);

    if (fileProperties.validFilepath) {

        if (fileProperties.validFilepath && parsedObject.files.length > 1)
            output += printFileName(filePath);

        const content = fileProperties.content.split('\n');
        while (currentLine <= parsedObject.option.count && currentLine <= content.length) {
            output += content[currentLine - 1] + '\n';
            currentLine++;
        }
    } else {
        output += fileProperties.content;
    }

    return output;
}

function printFileName(filePath) {
    return '\n==> ' + filePath + ' <==\n';
}

function getFileProperties(filepath) {
    const properties = {
        validFilepath: true,
        content: null
    };
    try {
        properties.content = fs.readFileSync(filepath, 'utf8');
    } catch (err) {
        properties.validFilepath = false;
        properties.content = err.message;
    }
    return properties;
}

module.exports = {executeParsedCommand};