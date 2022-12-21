import { writable } from 'svelte/store';


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

    while(true) {
        cursorOpen = str.indexOf('{', cursorClose);
        cursorClose = str.indexOf('}', cursorClose + 1);

        const res = str.slice(cursorOpen, cursorClose + 1);
        console.log("-",res.replace(/(?:\s)/ig,''),"-")
        try {
            yield JSON.parse(res);
        } catch(e) {
            console.log(e)
            return {}
        }
    }
}

// export const data = writable(new Array(20+1).fill(new Array(26)));
export const data = writable([[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
  ]);

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
                for (const res of parseChunk(chunk)) {
                    console.log(res);
                    // @ts-ignore
                    data.update(arr => [...arr, res]);
                }
            }
        })

    } catch (err) {
        console.error(err);
        throw err;
    }
}