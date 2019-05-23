const parser = require('./parseCliHeadCommand');
const fs = require('fs');

executeParsedCommand(parser.getParsedObject(process.argv.slice(2)));

function executeParsedCommand(parsedObject) {
    let output = '';
    parsedObject.files.forEach(filepath => {

        const fileProperties = getFileProperties(filepath);
        const optionObject = { // TODO: Object naming
            'line' : printLines(parsedObject, fileProperties),
            'byte' : printBytes(parsedObject, fileProperties)
        };

        if (fileProperties.validFilepath && parsedObject.files.length > 1)
            output += printFileName(filepath);

        if (parsedObject.option.count) {
            output += optionObject[parsedObject.option.type];
        } else if (parsedObject.option.illegalCount) {
            output += 'head: illegal ' + parsedObject.option.type + ' count -- ' + parsedObject.option.illegalCount;// TODO - long statement
        }
    });
    console.log(output);
    return output;
}

function printBytes(parsedObject, fileProperties) {
    let output = '';

    if (fileProperties.validFilepath) {
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


function printLines(parsedObject, fileProperties) { // TODO - violates SRP. Lets look at things it does
    /*
    4. Know how to join lines (using \n)
    5. Depends on console to print
    6. Conditionally print the file name too ( I thought we print lines? ) -- name's misleading too.
     */

    let output = '';
    let currentLine = 1;

    if (fileProperties.validFilepath) {
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