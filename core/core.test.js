const core = require('./core');

const testObj = new core('123456');
// const testObj = new core('123456');
// validation test

test('test with normal secret', () => {
  expect(testObj.validateSecret('123456')).toBe(true);
});

test('test without 6 symbol', () => {
    expect(() => testObj.validateSecret('adas')).toThrow(new Error('must be 6 symbol'));
    });

test('test with value not include range', () => {
    expect(() => testObj.validateSecret('asxcv2')).toThrow(new Error('error range'));
    });
    

test('test without uniq value', () => {
    expect(() => testObj.validateSecret('223456')).toThrow(new Error('must be uniq value'));
  });

test('check secret 3 and 1', () => {
    expect(testObj.checkSecret('1abc23')).toEqual({
        cow: 3,
        ox: 1
    });
});

test('check end game', () => {
    expect(testObj.checkSecret('123456')).toEqual(true);
});
