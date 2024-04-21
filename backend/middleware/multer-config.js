const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, callback) => {

    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    console.log(file.originalname);
    const name = file.originalname.replace(' ', '_');
    const extension = name.split(".")[1];
    const newName = name.split(".")[0];
    callback(null, newName + Date.now() +"." + extension);
  }
});

module.exports = multer({ storage }).single('image');