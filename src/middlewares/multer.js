const multer =  require('multer');

const storage = multer.diskStorage({
  destination: (require, file, cb) => {
    cb(null,'./public/img');
  },
  filename: (require, file, cb) => {
    cb(lnull, `${Date.now().toString()}-${file.originalname}`);
  }
});

const fileFilter = (require, file, cb) => {
  const isAccepted = ['image/png', 'image/jpg', 'image/jpeg']
  .find(acceptedFormat => acceptedFormat == file.mimetype)

  if (isAccepted) return cb(null, true);

  return cb(null, false);
}

module.exports = multer({
  storage,
  fileFilter
});