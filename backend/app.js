const csv = require('csv-parser');
const express = require('express');
const fs = require('fs');
const app = express();
const formidable = require('formidable');

const parseCsv = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = []
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error))
    })
}

// endpoint for parsing CSV file
app.post('/api/parse-csv', async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            console.log(err, fields, files.file);

            if (err) {
                return res.status(400).json({ error: err.message });
            }

            parseCsv(files.file.filepath).then(data => {
                res.json(data)
            })
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.listen(3000, () => {
    console.log('Server listening on port 3000')
})