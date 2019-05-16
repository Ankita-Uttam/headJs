module.exports.getParsedObject = (arguments) => {
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
    let countArgument = null;
    let fileStartIndex = 0;
    if (parsedObject.option.type) {
        if (arguments[0].endsWith("-n") || arguments[0].endsWith("-c")) {
            countArgument = arguments[1];
            parsedObject.option.count = Number(countArgument);
            fileStartIndex = 2;
        } else if (parsedObject.option.type === 'line' && !arguments[0].startsWith("-n")) {
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
        parsedObject.option.type = 'line';
        parsedObject.option.count = 10;
    }

    parsedObject.files = arguments.slice(fileStartIndex);

}

function getParsedOptionType(argument) {
    let type = null;
    if (argument.startsWith("-n")) {
        type = 'line';
    } else if (argument.startsWith("-c")) {
        type = 'byte';
    } else if (argument.startsWith("-") && Number(arguments[0].substring(1, 2))) {
        type = 'line';
    }
    return type;
}