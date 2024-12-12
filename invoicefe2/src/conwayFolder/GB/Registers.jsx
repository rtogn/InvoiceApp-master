import { useEffect, useState } from 'react';
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
// To hex: .toString(2).padStart(8, '0')
// To Binary: .toString(16)
/* 
JS BitWise Operations
Operator	Name	Description
&	AND	Sets each bit to 1 if both bits are 1
|	OR	Sets each bit to 1 if one of two bits is 1
^	XOR	Sets each bit to 1 if only one of two bits is 1
~	NOT	Inverts all the bits
<<	Zero fill left shift	Shifts left by pushing zeros in from the right and let the leftmost bits fall off
>>	Signed right shift	Shifts right by pushing copies of the leftmost bit in from the left, and let the rightmost bits fall off
>>>	Zero fill right shift	Shifts right by pushing zeros in from the left, and let the rightmost bits fall off
*/
const Register = () => {

    const [CPURegisters, setCPURegisters] = useState(new Map([
        // States are normally set to these defaults explicitly by the boot rom
        ['a', new Uint8Array([0x01])],
        ['b', new Uint8Array([0x00])],
        ['c', new Uint8Array([0x13])],
        ['d', new Uint8Array([0x00])],
        ['e', new Uint8Array([0xD8])],
        ['f', new Uint8Array([0xB0])], // Flag register. ZNHC0000 Zero, Subtract, Half-Carry, Carry, blank x4. Initial state 10110000 or 0xB0.
        ['h', new Uint8Array([0x01])],
        ['l', new Uint8Array([0x4D])],
        ['sp', new Uint16Array([0xFFFE])], // 16bit Stack Pointer init to 0xFFFE
        ['pc', new Uint16Array([0x0100])], // 16bit Program Counter init to 0x0100
    ]));

    useEffect(() => {
        //clearRegisters();
    }, []); 

    //const clearRegisters = () => {
    //    const newRegisters = new Map(CPURegisters);
    //    newRegisters.forEach((value, key) => {
    //        value[0] = 0x00;
    //    });
    //    setCPURegisters(newRegisters);
    //};
 
    const setRegister = (key, value) => {
        const newRegisters = new Map(CPURegisters);
        if (newRegisters.has(key)) {
            newRegisters.get(key)[0] = value;
            setCPURegisters(newRegisters);
        }
    };

    const getRegister = (key) => {
        console.log(CPURegisters.get(key)[0].toString(2).padStart(8, '0'));
        return CPURegisters.get(key)[0];
    };

    const getRegister16 = (register1, register2, bigEdian = false) => {
        // In GB Architecture, Little Edian is more commonly used and is thus the default setting of this function. 
        let reg16 = new Uint16Array(1);
        if (bigEdian) {
            // Big Edian (left to right)
            reg16[0] = (CPURegisters.get(register1)[0] << 8) | CPURegisters.get(register2)[0];
        } else {
            // Little Edian (right to left)
            reg16[0] = (CPURegisters.get(register2)[0] << 8) | CPURegisters.get(register1)[0];
        }
        return reg16;
    }

    // Functions for setting and getting bits of flag register
    const setFlagBit = (key, bitPos, value) => {
        //assert(bitPos >= 0 && bitPos <= 7, 'Given bit position ${bitPos} not in 8 bit range');
        //assert(value >= 0x00 && value <= 0x01, 'Given value is not a bit');

        // Shift target bit value n steps where n is the target position between 0,7 and combine with or to target register value.
        // Example: Register is 10100000, value is 1, target is bit 6. 00000001 << 6 == 01000000. 101000000 | 01000000 == [11100000]
        const newValue = CPURegisters.get(key)[0] | (value << bitPos);
        setRegister(key, newValue);
        return newValue;
    }

    const getFlagBit = (key, bitPos) => {
        //assert(bitPos >= 0 && bitPos <= 7, 'Given bit position ${bitPos} not in 8 bit range');
        const registerValue = CPURegisters.get(key)[0];
        const mask = (0x01 << bitPos); // set mask bit to target bit position
        const result = ((registerValue & mask) >> bitPos); // Apply mask and return retreieved result to 0th position
        return result; // Result will be 0x00 or 0x01
    }

    const testFunctions = () => {
        // 10110000
        console.log(getRegister16('e', 'c', false)[0].toString(16));
    }

    const getRegisterValueString = (key, precision = 16) => {
        // Pad from left to display leading 0s depending on length of value.
        let padStart = 2;
        if (precision === 8) {
            padStart = 8;
        } else if (key.length > 1) {
            padStart = 4;
        }

        return CPURegisters.get(key)[0].toString(precision).padStart(padStart, '0');

    } 

    return (
        <>
            <table>
                <tr>
                    <td>A: {getRegisterValueString('a')}</td>
                    <td>F: {getRegisterValueString('f')}</td>
                </tr>
                <tr>
                    <td>B: {getRegisterValueString('b')}</td>
                    <td>C: {getRegisterValueString('c')}</td>
                </tr>
                <tr>
                    <td>D: {getRegisterValueString('d')}</td>
                    <td>E: {getRegisterValueString('e')}</td>
                </tr>
                <tr>
                    <td>H: {getRegisterValueString('h')}</td>
                    <td>L: {getRegisterValueString('l')}</td>
                </tr>
                <tr>
                    <td>SP: {getRegisterValueString('sp')}</td>
                    <td>PC: {getRegisterValueString('pc')}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>Flags Z: {getFlagBit('f', 7)} S: {getFlagBit('f', 6)} H: {getFlagBit('f', 5)} C: {getFlagBit('f', 4)}</td>
                </tr>
            </table>


            <button onClick={() => getRegister('f')}>set</button>
            <button onClick={() => testFunctions()}>test</button>
            <button onClick={() => setRegister('a', CPURegisters.get('a')[0] + 1)}>Moop</button>

        </>
    );
};

export default Register;