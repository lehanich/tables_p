export const importCSV = (files) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const formData = new FormData()
        formData.append('file', files[0])
        const requestOptions = {
            method: 'POST',
            body: formData
        };

        fetch('/api/parse-csv', requestOptions).then((response) => {
            console.log(response);
        });
    } catch (err) {
        throw err;
    }
}