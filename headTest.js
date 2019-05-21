const assert = require('assert');
const head = require('./head');

describe('test head', () => {
    it ('test default case', ()  => {
        assert.deepStrictEqual(head.executeParsedCommand({
            files: ['files/file1.txt'],
            option: {
                type: 'line',
                count: 10,
                illegalCount: null
            }
        }), '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
    });
});