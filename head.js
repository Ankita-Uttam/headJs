const parser = require('./parseCliHeadCommand');
const fs = require('fs');

executeParsedCommand(parser.getParsedObject(process.argv.slice(2)));

function executeParsedCommand(parsedObject) {
    let output = '';
    parsedObject.files.forEach(filepath => {

        const fileProperties = getFileProperties(filepath);

        if (fileProperties.validFilepath && parsedObject.files.length > 1)
            output += printFileName(filepath);

        if (parsedObject.option.count) {
            switch (parsedObject.option.type) { // TODO - you might be able to replace this switch condition with an object. Why don't you try that out.
                case 'line':
                    output += printLines(parsedObject, fileProperties);
                    break;
                case 'byte':
                    output += printBytes(parsedObject, fileProperties);
                    break;
            }
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
    // const fileProperties = getFileProperties(filePath);

    if (fileProperties.validFilepath) {

        // if (fileProperties.validFilepath && parsedObject.files.length > 1)
        //     output += printFileName(filePath);

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