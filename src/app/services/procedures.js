import fs from 'fs';

import FilesManager from "../models/FilesManager";
import File from '../models/File';

export async function getImages(values) {
  try {
    const fmDB = new FilesManager();
    const photos = await fmDB.getFiles(values);

    let images = [];
    let count = 0;

    if (photos?.path) {
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

export async function getImagesWithoutReplace(values) {
  try {
    const fmDB = new FilesManager();
    let photos = await fmDB.getFiles(values);

    if (photos && photos.path) {
      photos = photos.path.map(photo => photo);
    }

    return photos;

  } catch (error) {
    console.log(`Unexpected error in Services getImagesWithoutReplace: ${error}`);
  }
}

export async function prepareToUpdate(reqBody, reqFiles, tableIdentifier) {
  let updatedFiles = [];
  let values = [];
  let toSave = false;

  try {
    const fmDB = new FilesManager();
    let photos = await fmDB.getFiles(tableIdentifier);

    if (photos?.path) {
      if (reqBody.removedPhotos) {

        updatedFiles = removeImages(reqBody.removedPhotos, photos.path);

        if (!reqFiles || reqFiles.length <= 0) {
          values = [photos.id, updatedFiles];
          toSave = { values, save: false };
        }
      }

      if (reqFiles?.length > 0) {
        const images = reqFiles.map(file => file.path);

        if (updatedFiles.length > 0) {
          updatedFiles = [...images, ...updatedFiles];
          values = [photos.id, updatedFiles];
          toSave = { values, save: false };

        } else {
          updatedFiles = [...images, ...photos.path];
          values = [photos.id, updatedFiles];
          toSave = { values, save: false };
        }
      }

    } else {
      if (reqFiles?.length > 0) {
        const images = reqFiles.map(file => file.path);

        toSave = {
          values: [0, images],
          save: true
        };
      }
    }

    return toSave;

  } catch (error) {
    console.log(`Unexpected error in Services prepareToUpdate: ${error}`);
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

export async function saveFiles(reqUpdatedFiles, column) {
  try {
    if (reqUpdatedFiles.save != undefined) {
      const { values } = reqUpdatedFiles;

      if (!reqUpdatedFiles.save) {
        const fileDB = new File();
        await fileDB.update([values[0], values[1]]);

      } else {
        const fmDB = new FilesManager();
        const fmID = await fmDB.create(column);

        const fileDB = new File();
        await fileDB.create([values[1], fmID]);
      }
    }
  } catch (error) {
    console.log(`Unexpected error in Procedures saveFiles: ${error}`);
  }
}