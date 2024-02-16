const multer = require('multer');

const MIME_TYPES = { 
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'assets/images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        const nameWithoutExtension = name.split('.').slice(0, -1).join('.');
        const timestamp = Date.now();
        const generatedFilename = `${nameWithoutExtension}_${timestamp}.${extension}`;
        callback(null, generatedFilename);
    
    }
});

module.exports = multer({ storage }).single('image');
