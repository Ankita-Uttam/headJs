const assert = require('assert');
const describe = require('describe()');
const head = require('./head');

describe('test something', () => {
    it ('test empty string', ()  => {
        assert.deepStrictEqual(head.executeParsedCommand({}), '');
    });
});