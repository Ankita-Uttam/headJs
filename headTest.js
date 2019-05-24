const assert = require('assert');
const head = require('./head');
const optionType = require('./optionType');

describe('test head behavior', () => {
    let parsedObject = {
        files: ['files/file1.txt'],
        option: {
            type: null,
            count: 0,
            illegalCount: null
        }
    };
    it ('test default case', ()  => {
        parsedObject.option.type = optionType.Line;
        parsedObject.option.count = 10;
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject), '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
    });
    it ("test 15 lines of input file", ()  => {
        parsedObject.option.type = optionType.Line;
        parsedObject.option.count = 15;
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject),
            '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15');
    });
    it ("test 50 lines of input file", ()  => {
        parsedObject.option.type = optionType.Line;
        parsedObject.option.count = 50;
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject),
            '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20');
    });
    it ('test 10 bytes of input file', ()  => {
        parsedObject.option.type = optionType.Byte;
        parsedObject.option.count = 10;
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject), '1\n2\n3\n4\n5\n');
    });
    it ("test 25 bytes of input file", ()  => {
        parsedObject.option.type = optionType.Byte;
        parsedObject.option.count = 25;
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject),
            '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n1');
    });
    it ("test 500 bytes of input file", ()  => {
        parsedObject.option.type = optionType.Byte;
        parsedObject.option.count = 500;
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject),
            '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20');
    });
    it ("test 'n' lines of input file", ()  => {
        parsedObject.option.type = optionType.Line;
        parsedObject.option.count = Number.NaN;
        parsedObject.option.illegalCount = 'n';
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject), 'head: illegal line count -- n');
    });
    it ("test 'n' bytes of input file", ()  => {
        parsedObject.option.type = optionType.Byte;
        parsedObject.option.count = Number.NaN;
        parsedObject.option.illegalCount = 'n';
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject), 'head: illegal byte count -- n');
    });
    it ("test 5 lines of invalid file", () => {
        parsedObject.files = ['invalid.txt'];
        parsedObject.option.type = optionType.Line;
        parsedObject.option.count = 5;
        parsedObject.option.illegalCount = null;
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject), "ENOENT: no such file or directory, open 'invalid.txt'");
    });
    it ("test 5 bytes of invalid file", () => {
        parsedObject.files = ['invalid.txt'];
        parsedObject.option.type = optionType.Byte;
        parsedObject.option.count = 5;
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject), "ENOENT: no such file or directory, open 'invalid.txt'");
    });
    it ("test invalid bytes of invalid file", () => {
        parsedObject.files = ['invalid.txt'];
        parsedObject.option.type = optionType.Byte;
        parsedObject.option.count = Number.NaN;
        parsedObject.option.illegalCount = 'x';
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject), 'head: illegal byte count -- x');
    });
    it ("test invalid lines of invalid file", () => {
        parsedObject.files = ['invalid.txt'];
        parsedObject.option.type = optionType.Line;
        parsedObject.option.count = Number.NaN;
        parsedObject.option.illegalCount = 'x';
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject), 'head: illegal line count -- x');
    });
    it ("test default configuration with invalid file", () => {
        parsedObject.files = ['invalid.txt'];
        parsedObject.option.type = optionType.Line;
        parsedObject.option.count = 10;
        parsedObject.option.illegalCount = null;
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject), "ENOENT: no such file or directory, open 'invalid.txt'");
    });
    it ("test default configuration with invalid/valid file combo", () => {
        parsedObject.files = ['files/file1.txt','invalid.txt'];
        parsedObject.option.type = optionType.Line;
        parsedObject.option.count = 10;
        assert.deepStrictEqual(head.executeParsedCommand(parsedObject),
            "==> files/file1.txt <==\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\nENOENT: no such file or directory, open 'invalid.txt'");
    });
});