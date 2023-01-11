// import { writable } from 'svelte/store';
import { stateTableMatrix, stateCoordinates, inputStore } from '../../lib/data/stores';

let data;
stateTableMatrix.subscribe(value => {
    console.log(value);
    data = value;
});

let input;
inputStore.subscribe(value => {
    console.log(value);
    input = value;
});

function readChunks(reader: ReadableStreamDefaultReader<Uint8Array>) {
    return {
        async* [Symbol.asyncIterator]() {
            let readResult = await reader.read();
            while (!readResult.done) {
                yield readResult.value;
                readResult = await reader.read();
            }
        },
    };
}

function* parseChunk(chunk: Uint8Array) {
    const str = new TextDecoder().decode(chunk);

    let cursorOpen = 0;
    let cursorClose = 0;

    let i = 0;
    while(true) {
        console.log(i,str)
        cursorOpen = str.indexOf('{', cursorClose) //? str.indexOf('{', cursorClose) : str.indexOf('[', cursorClose);
        cursorClose = str.indexOf('}', cursorOpen + 1) //? str.indexOf('}', cursorOpen + 1) : str.indexOf(']', cursorOpen + 1);

        const res = str.slice(cursorOpen, cursorClose + 1);
        console.log(cursorOpen,cursorClose +1)
        console.log(res)
        console.log("-",str.replace(/(\r)/ig,','),"-")
        try {
            console.log(JSON.parse(res))
            yield JSON.parse(res);
        } catch(e) {
            console.log(e)
            return {}
        }
        i++
    }
}

export function importCSV (files: FileList) {
    try {
        const formData = new FormData()
        formData.append('file', files[0])
        const requestOptions = {
            method: 'POST',
            body: formData
        };

        fetch('/api/parse-csv', requestOptions).then(async (response) => {
            const reader = response.body!.getReader();
            for await (const chunk of readChunks(reader)) {
                console.log(chunk)
                let stringNum = 1;
                let newData = []
                for (const res of parseChunk(chunk)) {
                    console.log(res);
                    const arrString = []
                    // @ts-ignore

                    for (const [key, value] of Object.entries(res)) {
                        // console.log(`${key}: ${value}`);
                        if(key !== "id") {
                            arrString.push(value);
                        }
                    }
                    newData = [...newData, arrString]
                    
                    // console.log($data)
                    stringNum++
                }

                const start = stateCoordinates.get().select[0];

                for(let j=0; j < newData.length; j++ ) {
                    for(let k=0; k < newData.length; k++ ) {
                        // stateTableMatrix.setElement = {x: start[0] + k, y: start[1] + j - 1, value: newData[j][k]};
                        data.setElement(start[0] + k, start[1] + j - 1, newData[j][k]);
                        // stateTableMatrix.set({x: start[0] + k, y: start[1] + j - 1, value: newData[j][k]});
                    }
                }
                inputStore.set(newData[0][0]);
                stateTableMatrix.update(data => data);
            }
        })

    } catch (err) {
        console.error(err);
        throw err;
    }
}