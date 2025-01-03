import { useEffect, useState } from 'react';
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
import Regisers from './Registers'

/*
GB Memory map- 

Interrupt Enable Register
--------------------------- FFFF
Internal RAM
--------------------------- FF80
Empty but unusable for I/O
--------------------------- FF4C
I/O ports
--------------------------- FF00
Empty but unusable for I/O
--------------------------- FEA0
Sprite Attrib Memory (OAM)
--------------------------- FE00
Echo of 8kB Internal RAM
--------------------------- E000
8kB Internal RAM
--------------------------- C000
8kB switchable RAM bank
--------------------------- A000
8kB Video RAM
--------------------------- 8000 --
16kB switchable ROM bank |
--------------------------- 4000 |= 32kB Cartrigbe
16kB ROM bank #0 |
--------------------------- 0000 --
* NOTE: b = bit, B = byte
*/

const GB_RAM_BYTE_COUNT = 65536; // Same as FFFF
const MIN_RAM_ADDRS = 0x0000;
const MAX_RAM_ADDRS = 0xFFFF;

const Memory = () => {
    // Init Memory of 64KB (65536/0xFFFF bytes)
    const [memory, setMemory] = useState(new Uint8Array(GB_RAM_BYTE_COUNT).fill(0x00));

    const validateRamRange = (address) => {
        return address >= MIN_RAM_ADDRS && address <= MAX_RAM_ADDRS;
    }

    const readMemory = (address) => {
        if (validateRamRange(address)) {
            return memory[address];
        } else {
            throw new Error('Invalid Memory Address: ', address);
        }
    }

    const readMemAs8HexString = (address) => {
        let value = readMemory(address);
        return value.toString(16).padStart(2, '0');
    }

    const enforce8bitPrecision = (value) => {
        return value & 0xFF;
    }

    const writeMemory = (address, value) => {
        let value8 = enforce8bitPrecision(value);
        if (validateRamRange(address)) {
            const newMem = [...memory];
            newMem[address] = value8;

            if ((address >= 0xE000 && address <= 0xFE00) || (address >= 0xC000 && address <= 0xDE00)) {
                echoInternalRam(address, value8, newMem);
            }

            setMemory(newMem);

        } else {
            throw new Error('Invalid Memory Address: ', address);
        }
    }

    // E000-FE00 is an echo of C000-DE00, so writing to one updates the other. 
    const echoInternalRam = (address, value, memory) => {
        let modifier = address > 0xDE00 ? -0x2000 : 0x2000;
        memory[address + modifier] = value;
    }

    const writeMemoryDemo = () => {
        const newMem = [...memory];
        for (let i = 0; i < newMem.length; i++) { 

            if (i % 2 === 0) {
                newMem[i] = 0x01;
            } else {
                newMem[i] = 0xFF;
            }           
        }
        setMemory(newMem);
    }

    const clearMemory = () => {
        const newMem = new Uint8Array(GB_RAM_BYTE_COUNT).fill(0x00);
        setMemory(newMem);
    }

    return (
        <>
            <table>
                <th>Memory Readout</th>
                <tr>
                    <td>0x0000: {readMemAs8HexString(0x0000)}</td>
                    <td>0xA1A2: {readMemAs8HexString(0xA1A2)}</td>
                </tr>
                <tr>
                    <td>0xFFFF: {readMemAs8HexString(0xFFFF)}</td>
                    <td>0xEFFF: {readMemAs8HexString(0xEFFF)}</td>
                </tr>
                <tr>
                    <td>0xE001: { readMemAs8HexString(0xE001) }</td>
                    <td>Echo 0xC001: {readMemAs8HexString(0xC001)}</td>
                </tr>
            </table>

            <button onClick={() => writeMemoryDemo()}>set Mem</button>
            <button onClick={() => clearMemory()}>clear mem</button>
            <button onClick={() => writeMemory(0xE001, ( readMemory(0xE001) + 0x01))}>Increment E001</button>
            
        </>
    );
};

export default Memory;

