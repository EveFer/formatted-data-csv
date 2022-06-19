const express = require('express')
const fs = require("fs");
const { parse } = require("csv-parse");

const app = express()

app.get('/', (request, response) => {
    let allData = []
    const data = fs.readFileSync('./lots_lagunas_EB.csv', 'utf8')

    const headers =  data.slice(0, data.indexOf('\n')).split(',')
    
    fs.createReadStream("./lots_lagunas_EB.csv")
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        const object = headers.reduce((accum, header, index) => {
            header = header.replace(/[\r\n]/gm, '')
            header = header.trim()
            let value = row[index].replace(/[\r\n]/gm, '').trim().toLowerCase()
            if(!isNaN(Number(value))) value = Number(value)
            accum[header] = value
            return accum
        }, {})
        allData = [...allData, object]
      })
      .on("end", function () {
        console.log("finished");
        response.json({
            data: allData
        })
      })
      .on("error", function (error) {
        console.log(error.message);
      });
})

app.listen(8080, () => {
    console.log('Server listening')
})



