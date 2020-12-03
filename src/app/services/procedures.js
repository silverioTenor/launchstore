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
    photos.splice(photos.indexOf(removed[p]), 1);
  }

  return photos;
}