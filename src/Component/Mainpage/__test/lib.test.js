import {justifyNumberToTwoDigits, formatDate} from '../lib';

test("Justify number to two digits test", ()=>{
    expect(justifyNumberToTwoDigits(1)).toBe('01')
    expect(justifyNumberToTwoDigits(0)).toBe('00')
    expect(justifyNumberToTwoDigits(10)).toBe('10')
    expect(justifyNumberToTwoDigits('1')).toBe('01')
});

test("Format Date test", ()=>{
    expect(formatDate('Wed Mar 15 2020 08:00:00 GMT+0800 (CST)')).toEqual({date: '15', month: 'March', year: 2020});
    expect(formatDate('Wed Mar 1 2020 08:00:00 GMT+0800 (CST)')).toEqual({date: '01', month: 'March', year: 2020});
    expect(formatDate(1597043661755)).toEqual({date: '10', month: 'August', year: 2020});
})