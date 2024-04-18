const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, callback) => {

    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    console.log(file.originalname);
    const name = file.originalname.replace(' ', '_').split('.')[0];
    console.log(name);
    callback(null, name + Date.now());
  }
});

module.exports = multer({ storage }).single('image');