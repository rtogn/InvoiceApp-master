import React, { useState } from 'react';
import opCodeData from './Opcodes.json';

function Dissassembler() {
    const [opCodes, setOpcodes] = useState(opCodeData);
    const [baseFile, setBaseFile] = useState(null);
    const [fileData, setFileData] = useState(null);

    const handleSetBaseFile = (e) => {
        setBaseFile(e.target.files[0]);
        
    }

    const handleLoadRom = () => {
        readFileBinary(baseFile)
    }


    const generateTextOutput = (content) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.downloald = 'rom-output.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const decimalToHex = (b) => {
        return b.toString(16).padStart(2, '0').toUpperCase();
    };

    const getInstruction = (opCode) => {
        const instruction = opCodes.unprefixed["0x" + opCode];
/*        console.log(opCode);*/
        if (instruction) {
            //console.log(instruction.mnemonic);
            //console.log(instruction.bytes);
            return {
                mnemonic: instruction.mnemonic,
                bytes: instruction.bytes,
                operands: instruction.operands
            };
        } else {
            console.log("Invalid OP, must be immediate value")
            return opCode;
        }

    }

    const readFileBinary = (event) => {
        const file = baseFile; //event.target.files[0];
        //console.log(event.target.files);
        const reader = new FileReader();
        const blob = new Blob([file], { type: file.type });

        let output = "";
        let row = 0
        reader.onload = (e) => {
            const byteArray = new Uint8Array(e.target.result); // Get bytes in decimal format in a single array

            for (let i = 0; i < byteArray.length; i++) {
                const hex = decimalToHex(byteArray[i]); //byteArray[i].toString(16).padStart(2, '0').toUpperCase();
                const instruction = getInstruction(hex);
                let operands = "";

                if (instruction.operands["0"]) {
                    operands += instruction.operands["0"].name;
                }
                if (instruction.operands["1"]) {
                    operands += ', ' + instruction.operands["1"].name;
                }
                   
                let instructionBuffer = decimalToHex(row) + " " + instruction.mnemonic + " " + operands;

                // Get next j bytes if instruction has a size > 1
                if (instruction.bytes > 1) {
                    instructionBuffer += " [";
                    for (let j = 0; j < (instruction.bytes - 1); j++) {
                        i++;
                        instructionBuffer +=  " " + decimalToHex(byteArray[i]);
                        row++;
                    }
                    instructionBuffer += " ]";
                }


                //console.log(instructionBuffer);
                output += instructionBuffer + '\n';
                row++;
            }
            setFileData(output);
            //console.log(fileData);
            generateTextOutput(output);
            //const hexString = byteArray.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
            //setFileData(hexString);
        };

        reader.readAsArrayBuffer(blob);  // reader.onload will be called here
    };

    return (
        <>
            <input type="file" onChange={handleSetBaseFile} />
            <button onClick={handleLoadRom}>Load Rom</button>
            {fileData && <p>File read as hex: {fileData}</p>}
        </>
    );
}

export default Dissassembler;