import {add} from './lib';

test('Add function testing', ()=>{
    expect(add(3, 4)).toBe(7)
    expect(add('1', '2')).toBe(3)
    expect(add(null, null)).toBe(0)
    expect(add(undefined, undefined)).toBe(NaN)
});