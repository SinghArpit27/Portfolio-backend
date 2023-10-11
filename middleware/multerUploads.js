import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';


// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Profile Picture Multer Code
const imageUpload = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname, '../public/profilePicturesUploads'));
    },

    filename:function(req,file,cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
export const upload = multer({ storage: imageUpload });



// Profile Picture Multer Code
const projectAvatarUpload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.join(__dirname, '../public/projectsAvtarUploads'));
  },

  filename:function(req,file,cb){
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
  }
});
export const projectAvatar = multer({ storage: projectAvatarUpload });