import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: (require, file, cb) => {
    // cb(null, path.resolve('public', 'img', 'main'));
    cb(null, './public/img/main');
  },
  filename: (require, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  }
});

const fileFilter = (require, file, cb) => {
  const isAccepted = ['image/png', 'image/jpg', 'image/jpeg']
  .find(acceptedFormat => acceptedFormat == file.mimetype)

  return (isAccepted) ? cb(null, true) : cb(null, false);
}

export default multer({
  storage,
  fileFilter
});