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
export const importCSV = (files) => {
    // eslint-disable-next-line no-useless-catch
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
                console.log(chunk);
            }
        })

    } catch (err) {
        console.error(err);
        throw err;
    }
}