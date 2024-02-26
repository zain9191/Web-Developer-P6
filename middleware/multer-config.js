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

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(new Error('Only image files are allowed'));
    }
};

module.exports = multer({ storage, fileFilter }).single('image');
