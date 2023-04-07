const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/appError');
const { errUploadImage } = require('../constants/customErrorMessage');

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${req.user.id}-${uuidv4()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(400, errUploadImage), false);
  }
};

const uploadUserAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single('avatarURL');

module.exports = uploadUserAvatar;
