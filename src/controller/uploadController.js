const multer = require("multer");

const multerConfig = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, 'bookstore_frontend/public/assets/images/');
    },
    filename: (req, file, callback)=>{
        const ext = file.mimetype.split("/")[1];
        callback(null, file.originalname);
        // callback(null, `image-${Date.now()}.${ext}`);
    }
});

const isImage = (req, file, callback)=>{
    if(file.mimetype.startsWith('image')){
        callback(null,true);
    }else{
        callback(new Error ('Only Images are Allowed'));
    }
}
const upload = multer({
    storage:multerConfig,
    fileFilter:isImage
});

exports.uploadImage = upload.single('photo');

exports.upload = (req, res)=>{
    console.log(req.file);
    res.status(200).json({
        success:"Image Uploaded Sucessfully"
    })
}