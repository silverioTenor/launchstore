import File from "../models/File";
import FilesManager from "../models/FilesManager";

const factory = {
  async getImages(values) {
    try {
      const fmDB = new FilesManager();
      const fm_id = await fmDB.getID(values);

      const fileDB = new File();
      let photos = await fileDB.getBy({ where: { id: fm_id } });

      if (photos && photos.path) {
        photos.forEach(photo => {
          photos = {
            id: photo.id,
            path: `${photo.path}`.replace("public", "")
          }
        });

        return photos;
      }
    } catch (error) {
      console.log(`Unexpected error in Services getImages: ${error}`);
    }
  },
  async save() { },
  async edit() { },
  async remove() { }
}

export default factory;