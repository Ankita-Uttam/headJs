const assert = require('assert');
const parser = require('./parseCliHeadCommand');

// TODO - describe blocks.

describe('test head behavior', () => {
    it('should return parsed command for writing 10 lines of file1.txt', () => { // TODO - I would include the sense of 'default' here.
        const parsedCommand = parser.getParsedObject(['files/file1.txt']);
        assert.deepStrictEqual(parsedCommand.option.count, 10);
        assert.deepStrictEqual(parsedCommand.files.length, 1);
        assert.deepStrictEqual(parsedCommand.option.type, 'line');
        assert.deepStrictEqual(parsedCommand.files[0], 'files/file1.txt');
    });

    it('should return parsed command for writing 10 bytes of file1.txt', () => {
        const parsedCommand = parser.getParsedObject(['-c', '10', 'files/file1.txt']);
        assert.deepStrictEqual(parsedCommand.option.count, 10);
        assert.deepStrictEqual(parsedCommand.files.length, 1);
        assert.deepStrictEqual(parsedCommand.option.type, 'byte');
        assert.deepStrictEqual(parsedCommand.files[0], 'files/file1.txt');
    });

    it('should return parsed command for writing 5 lines of file1.txt', () => {
        const parsedCommand = parser.getParsedObject(['-5', 'files/file1.txt']);
        assert.deepStrictEqual(parsedCommand.option.count, 5);
        assert.deepStrictEqual(parsedCommand.files.length, 1);
        assert.deepStrictEqual(parsedCommand.option.type, 'line');
        assert.deepStrictEqual(parsedCommand.files[0], 'files/file1.txt');
    });

    it('should return parsed command for writing 5 lines of file1.txt', () => {
        const parsedCommand = parser.getParsedObject(['-n5', 'files/file1.txt']);
        assert.deepStrictEqual(parsedCommand.option.count, 5);
        assert.deepStrictEqual(parsedCommand.files.length, 1);
        assert.deepStrictEqual(parsedCommand.option.type, 'line');
        assert.deepStrictEqual(parsedCommand.files[0], 'files/file1.txt');
    });

    it('should return parsed command for writing 5 lines of file1.txt', () => {
        const parsedCommand = parser.getParsedObject(['-n', '5', 'files/file1.txt']);
        assert.deepStrictEqual(parsedCommand.option.count, 5);
        assert.deepStrictEqual(parsedCommand.files.length, 1);
        assert.deepStrictEqual(parsedCommand.option.type, 'line');
        assert.deepStrictEqual(parsedCommand.files[0], 'files/file1.txt');
    });

    it('should return all arguments as files in parsed command', () => {
        const parsedCommand = parser.getParsedObject(['-', '5', 'files/file1.txt']);
        assert.deepStrictEqual(parsedCommand.option.count, 10);
        assert.deepStrictEqual(parsedCommand.files.length, 3);
        assert.deepStrictEqual(parsedCommand.option.type, 'line');
        assert.deepStrictEqual(parsedCommand.files[0], '-');
    });

    it('should return parsed command for writing 5 bytes of file1.txt', () => {
        const parsedCommand = parser.getParsedObject(['-c5', 'files/file1.txt']);
        assert.deepStrictEqual(parsedCommand.option.count, 5);
        assert.deepStrictEqual(parsedCommand.files.length, 1);
        assert.deepStrictEqual(parsedCommand.option.type, 'byte');
        assert.deepStrictEqual(parsedCommand.files[0], 'files/file1.txt');
    });

    it('should return NaN as count in parsed command', () => {
        const parsedCommand = parser.getParsedObject(['-c', 'n', 'files/file1.txt']);
        assert.deepStrictEqual(isNaN(parsedCommand.option.count), true);
        assert.deepStrictEqual(parsedCommand.files.length, 1);
        assert.deepStrictEqual(parsedCommand.option.type, 'byte');
        assert.deepStrictEqual(parsedCommand.files[0], 'files/file1.txt');
        assert.deepStrictEqual(parsedCommand.option.illegalCount, 'n');
    });

    it('should return NaN as count in parsed command', () => {
        const parsedCommand = parser.getParsedObject(['-cn', 'files/file1.txt']);
        assert.deepStrictEqual(isNaN(parsedCommand.option.count), true);
        assert.deepStrictEqual(parsedCommand.files.length, 1);
        assert.deepStrictEqual(parsedCommand.option.type, 'byte');
        assert.deepStrictEqual(parsedCommand.files[0], 'files/file1.txt');
        assert.deepStrictEqual(parsedCommand.option.illegalCount, 'n');
    });

    it('should return NaN as count in parsed command', () => {
        const parsedCommand = parser.getParsedObject(['-n', 'c', 'files/file1.txt']);
        assert.deepStrictEqual(isNaN(parsedCommand.option.count), true);
        assert.deepStrictEqual(parsedCommand.files.length, 1);
        assert.deepStrictEqual(parsedCommand.option.type, 'line');
        assert.deepStrictEqual(parsedCommand.files[0], 'files/file1.txt');
        assert.deepStrictEqual(parsedCommand.option.illegalCount, 'c');
    });

    it('should return NaN as count in parsed command', () => {
        const parsedCommand = parser.getParsedObject(['-nc', 'n', 'files/file1.txt']);
        assert.deepStrictEqual(isNaN(parsedCommand.option.count), true);
        assert.deepStrictEqual(parsedCommand.files.length, 2);
        assert.deepStrictEqual(parsedCommand.option.type, 'line');
        assert.deepStrictEqual(parsedCommand.files[0], 'n');
        assert.deepStrictEqual(parsedCommand.option.illegalCount, 'c');
    });
});