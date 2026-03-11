import fs from 'fs'
import XLSX from 'xlsx'
import csv from 'csv-parser'

const csvToJson = (filePath) =>{
    const result = [];
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data',(data)=>result.push(data))
    .on("end" , ()=> {
    })
}

const xlsxToJson = (filePath) =>  {
    const workBook = XLSX.readFile(filePath)

    const sheetName = workBook.SheetNames[0]
    const sheet = workBook.Sheets[sheetName]

    const data = XLSX.utils.sheet_to_json(sheet);

    return data;
}

const parseFileToJson = async function (extension, filePath) {
    let data ;


    if(extension === ".csv") {
      data = await  csvToJson(filePath)
    }else if (extension === ".xlsx") {
       data = await xlsxToJson(filePath)
    }

    return data;
}

export default parseFileToJson;
