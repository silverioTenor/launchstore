import FilesManager from "../models/FilesManager";

const factory = {
  async getImages(values) {
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
  },
  async save() { },
  async edit() { },
  async remove() { }
}

export default factory;