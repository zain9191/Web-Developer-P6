const multer = require('multer');

const MIME_TYPES = { 
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/assets/images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        console.log("extension is " +extension)
        name.split(".")
        name.split(extension)
        console.log("name now is "+name)
        const timestamp = Date.now();
    
        console.log("name is " + name);
    
        const generatedFilename = `${name}_${timestamp}.${extension}`;
        console.log('Generated Filename:', generatedFilename);
    
        // Correctly generate the filename with a single extension
        callback(null, `${name.replace(/\.[^/.]+$/, "")}_${timestamp}.${extension}`);
    }
});

module.exports = multer({ storage }).single('image');
