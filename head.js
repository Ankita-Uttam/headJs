const parser = require('./parseCliHeadCommand');
const fs = require('fs');

executeParsedCommand(parser.getParsedObject(process.argv.slice(2)));

function printExecutionResult(executionResult, printer) {

}

/*
     Depends on console to print
*/
function executeParsedCommand(parsedObject) {
    let output = '';
    for (let i = 0; i < parsedObject.files.length; i++) {
        const filepath = parsedObject.files[i];
        const fileProperties = getFileProperties(filepath);
        const optionObject = { // TODO: Object naming
            line: getContentByLines(parsedObject, fileProperties),
            byte: getContentByBytes(parsedObject, fileProperties)
        };

        if (fileProperties.validFilepath && parsedObject.option.count) {

            if (parsedObject.files.length > 1)
                output += getFileName(filepath);

                output += optionObject[parsedObject.option.type];

            if (i <= parsedObject.files.length - 2)
                output = addLineFeed(output);

        } else if (parsedObject.option.illegalCount) {
            output += 'head: illegal ' + parsedObject.option.type + ' count -- ' + parsedObject.option.illegalCount;// TODO - long statement
        } else {
            output += fileProperties.content;
        }
    }
    console.log(output);
    return output;
}

function getContentByBytes(parsedObject, fileProperties) {
    let output = '';

    output += Buffer.from(fileProperties.content).toString('utf8', 0, parsedObject.option.count);

    return output;
}

function getContentByLines(parsedObject, fileProperties) {
    let output = '';
    let currentLine = 1;

        const content = fileProperties.content.split('\n');
        while (currentLine < parsedObject.option.count && currentLine < content.length) {
            output += addLineFeed(content[currentLine - 1]);
            currentLine++;
        }
        output += content[currentLine - 1];

    return output;
}

function addLineFeed(value) {
    return value + '\n';
}

function getFileName(filePath) {
    return addLineFeed('==> ' + filePath + ' <==');
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