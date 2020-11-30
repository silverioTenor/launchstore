import File from "../models/File";
import FilesManager from "../models/FilesManager";

const factory = {
  async getImages(values) {
    try {
      const fmDB = new FilesManager();
      const fm_id = await fmDB.get(values);
      
      const files_manager_id = fm_id.id;

      const fileDB = new File();
      let photos = await fileDB.getBy({ where: { files_manager_id } });

      if (photos && photos.path) {
        photos.path.forEach(photo => {
          let count = 1;

          photos = {
            id: count,
            path: `${photo}`.replace("public", "")
          }

          count++;
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