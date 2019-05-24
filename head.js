const parser = require('./parseCliHeadCommand');
const fs = require('fs');
const Console = require('console').Console;

printExecutionResult(process.argv.slice(2));

function getPrinter() {
    return new Console(process.stdout, process.stderr);
}

function printExecutionResult(arguments) {
    const printer = getPrinter();
    printer.log(executeParsedCommand(parser.getParsedObject(arguments)));
}

function executeParsedCommand(parsedObject) {
    let output = '';
    for (let i = 0; i < parsedObject.files.length; i++) {
        const filepath = parsedObject.files[i];
        const fileProperties = getFileProperties(filepath);
        const optionObject = { // TODO: Object naming
            line: getContentByLines(parsedObject.option.count, fileProperties.content.split('\n')),
            byte: getContentByBytes(parsedObject.option.count, fileProperties.content)
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
    // console.log(output);
    return output;
}

function getContentByBytes(size, content) {
    let output = '';

    output += Buffer.from(content).toString('utf8', 0, size);

    return output;
}

function getContentByLines(count, content) {
    let output = '';
    let currentLine = 1;

        while (currentLine < count && currentLine < content.length) {
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