import {justifyNumberToTwoDigits} from '../lib';

test("Justify number to two digits test", ()=>{
    expect(justifyNumberToTwoDigits(1)).toBe('01')
    expect(justifyNumberToTwoDigits(0)).toBe('00')
    expect(justifyNumberToTwoDigits(10)).toBe('10')
    expect(justifyNumberToTwoDigits('1')).toBe('01')
});
