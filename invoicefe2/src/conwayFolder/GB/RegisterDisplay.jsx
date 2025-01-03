import { useEffect, useState } from 'react';
import Registers from './Registers'

const RegisterDisplay = () => {

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
            <button onClick={() => setRegister('a', CPURegisters.get('a')[0] + 1)}>Increment A</button>

        </>
    );
};

export default RegisterDisplay;