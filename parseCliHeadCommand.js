const DEFAULT_COUNT = 10;
const BYTE_IDENTIFIER = '-c';
const LINE_IDENTIFIER = '-n';
const LINE = 'line';
const BYTE = 'byte';

getParsedObject = (arguments) => {
    const parsedObject = {
        files: [],
        option: {
            type: null,
            illegalCount: null,
            count: 0
        }
    };

    parsedObject.option.type = getParsedOptionType(arguments[0]);
    parseRemainingArguments(parsedObject, arguments);

    return parsedObject;
};

function parseRemainingArguments(parsedObject , arguments) {
    let countArgument = null; // TODO - wrong scope
    let fileStartIndex = 0;
    if (parsedObject.option.type) {
        if (arguments[0].endsWith(LINE_IDENTIFIER) || arguments[0].endsWith(BYTE_IDENTIFIER)) { // TODO - long conditions. Give them names.
            countArgument = arguments[1];
            parsedObject.option.count = Number(countArgument);
            fileStartIndex = 2;
        } else if (parsedObject.option.type === LINE && !arguments[0].startsWith(LINE_IDENTIFIER)) {
            countArgument = arguments[0].substring(1, arguments[0].length);
            parsedObject.option.count = Number(countArgument);
            fileStartIndex = 1;
        } else {
            countArgument = arguments[0].substring(2, arguments[0].length);
            parsedObject.option.count = Number(countArgument);
            fileStartIndex = 1;
        }

        if (!parsedObject.option.count) {
            parsedObject.option.illegalCount = countArgument;
        }
    } else {
        parsedObject.option.type = LINE;
        parsedObject.option.count = DEFAULT_COUNT;
    }

    parsedObject.files = arguments.slice(fileStartIndex);

}

function getParsedOptionType(argument) {
    let type = null;
    if (argument.startsWith(LINE_IDENTIFIER)) {
        type = LINE;
    } else if (argument.startsWith(BYTE_IDENTIFIER)) {
        type = BYTE;
    } else if (argument.startsWith("-") && Number(arguments[0].substring(1, 2))) {
        type = LINE;
    }
    return type;
}

module.exports = { getParsedObject, BYTE, LINE };