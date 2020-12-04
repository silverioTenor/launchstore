import fs from 'fs';
import FilesManager from "../models/FilesManager";

export async function getImages(values) {
  try {
    const fmDB = new FilesManager();
    const photos = await fmDB.getFiles(values);

    let images = [];
    let count = 0;

    if (photos && photos.path) {
      photos.path.forEach(photo => {
        photo = {
          id: count,
          path: `${photo}`.replace("public", ""),
          fileID: photos.id
        }

        images.push(photo);
        count++
      });
    }

    return images;

  } catch (error) {
    console.log(`Unexpected error in Services getImages: ${error}`);
  }
}

export function removeImages(removedPhotos, photos) {
  removedPhotos = removedPhotos.split(",");
  const lastIndex = removedPhotos.length - 1;
  removedPhotos.splice(lastIndex, 1);
  
  removedPhotos = removedPhotos.map(photo => Number(photo));
  let removed = [];

  for (const i of removedPhotos) {
    removed.push(photos[i]);
  }

  removed.forEach(photo => {
    if (fs.existsSync(photo)) fs.unlinkSync(photo);
  });

  for (const p of removedPhotos) {
    photos.splice(photos.indexOf(photos[p]), 1);
  }

  return photos;
}

export async function prepareToUpdate(reqBody, reqFiles, tableIdentifier) {
  let updatedFiles = [];
  let values = [];
  let toSave = "";

  const fmDB = new FilesManager();
  let photos = await fmDB.getFiles(tableIdentifier);

  if (reqBody.removedPhotos) {

    if (photos && photos.path) {
      updatedFiles = removeImages(reqBody.removedPhotos, photos.path);

      if (!reqFiles || reqFiles.length <= 0) {
        values = [photos.id, updatedFiles];
        toSave = values;
      }
    }
  }

  if (reqFiles && reqFiles.length > 0) {
    const images = reqFiles.map(file => file.path);

    if (updatedFiles.length > 0) {
      updatedFiles = [...images, ...updatedFiles];
      values = [photos.id, updatedFiles];
      toSave = values;

    } else {
      updatedFiles = [...images, ...photos.path];
      values = [photos.id, updatedFiles];
      toSave = values;
    }
  }

  return toSave;
}