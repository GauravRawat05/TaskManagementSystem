import path from 'path'
import fs from 'fs'
import multer from 'multer';
import ApiError from '../utils/ApiError.js';


// -------------- Directories ---------------
const pulicDir = path.join(process.cwd(),"public");
const imageDir = path.join(pulicDir, "images");
const uploadExcelDir = path.join(pulicDir, "uploadExcelFiles");
const downLoadExcelDir = path.join(pulicDir, "downLoadExcelFile");


// -------------- create if doesn't exsits ---------------

[pulicDir,imageDir,uploadExcelDir,downLoadExcelDir].forEach((dir)=>{
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive : true})
    }
})

// -------------- FIle storage ---------------
const uploadFileStorage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null, uploadExcelDir)
    },

    filename : (req,file,cb) => {
        const uniSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
        const cleanName = file.originalname.replace(/\s+g/, "_")

        cb(null, `${uniSuffix}-${cleanName}`)
    }
})

// -------------- Image storage ---------------
const imageStorage = multer.diskStorage({
  destination : (req,file,cb) => {
        cb(null, imageDir)
  },
  filename : (req,file,cb) => {
        const uniSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
        const cleanName = file.originalname.replace(/\s+g/, "_")

        cb(null, `${uniSuffix}-${cleanName}`)
    }
})


// -------------- File filter ---------------

const fileFilter = (req,file,cb) => {
  //  const allowedExtensions = [".csv", ".xls", ".xlsx"];

   const allowedExtensions = [
    "text/csv",
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
];

    if(allowedExtensions.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new ApiError(400, "only csv and excel file can allowed "), false)
    }
}



// -------------- upload Middlewares ---------------

const uploadFile = multer({
    storage : uploadFileStorage,
    fileFilter,
    limits : {
      fileSize : 5 * 1024 * 1024
    }
})

const uploadImage = multer({
    storage : imageStorage,
    limits : {
      fileSize : 5 * 1024 * 1024
    }
})


export {
  uploadFile,
  uploadImage
}
