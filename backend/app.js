const csv = require('csv-parser');
const express = require('express');
const fs = require('fs');
const app = express();
const formidable = require('formidable');

app.post('/api/parse-csv', async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            console.log(err, fields, files.file);

            if (err) {
                return res.status(400).json({ error: err.message });
            }

            console.log(files.file.filepath);

            fs.createReadStream(files.file.filepath)
                .pipe(csv(
                    // {
                    //     mapValues: ({ header, index, value, separator, quote, raw }) => value.toLowerCase()
                    // }
                ))
                .on('data', (data) => {
                    const id = Date.now().toString(36);
                    // console.log(data)
                    // const valueStringify = JSON.stringify({ ...data, id  });
                    const valueStringify = JSON.stringify({ ...data  });

                    res.write(valueStringify);
                });
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.listen(3000, () => {
    console.log('Server listening on port 3000')
})