import { useEffect, useState } from 'react';
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
import Regisers from './Registers'


const Memory = () => {

    const [CPURegisters, setCPURegisters] = useState(new Map([
        ['a', new Uint8Array(1)],

    ]));

    const test = () => {
        Regisers.getRegister16('a', 'f');
    }

    return (
        <>
            <h1>A: {CPURegisters.get('sp')[0].toString(16)}</h1>
            
        </>
    );
};

export default Memory;