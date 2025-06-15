import Address from '../models/Address.js';
import User from '../models/User.js';
import Product from './../models/Product.js';

import { getImagesWithoutReplace, removeImages, saveFiles } from './../services/fileService.js';
import { formatProducts, formatCpfCnpj, formatCep } from '../../lib/utils.js';

const UserController = {
  async ads(req, res) {
    try {
      const { userID } = req.session.user;

      const productDB = new Product();
      let products = await productDB.getInOrder({ id: userID, column: "user_id" });

      products = await formatProducts({ object: products }, products.length);
      products = await Promise.all(products);

      return res.render("users/ads", { products });

    } catch (error) {
      console.log(`Unexpected error in ADS CONTROLLERS: ${error}`);
    }
  },
  async show(req, res) {
    try {
      const user = req.user;
      const { addr } = req.session;

      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj);
      if (addr) addr.cep = formatCep(addr.cep);

      if (req.query.status == 200) {
        return res.render("users/index", {
          user, addr,
          message: "Operação feita com sucesso!",
          type: "success",
          formFull: true
        });
      } else if (req.query.status == 400) {
        return res.render("users/index", {
          user, addr,
          message: "Falha na operação!",
          type: "error",
          formFull: true
        });
      } else {
        return res.render("users/index", { user, addr, formFull: true });
      }

    } catch (error) {
      console.log(`Unexpected error in SHOW CONTROLLERS: ${error}`);

      return res.render("users/index", {
        message: "Erro inesperado!",
        type: "error",
        formFull: true
      })
    }
  },
  async update(req, res) {
    const { userID } = req.session.user;

    let foundAddress = null;

    try {
      const addrDB = new Address();

      if (req?.body?.cep) {
        let { cep, street, complement, district, locale, uf } = req.body;
        const state = locale;
        cep = req.body.cep.replace(/\D/g, "");
        
        foundAddress = await addrDB.get({ id: cep, column: "cep" });
      
        if (foundAddress?.length <= 0) {
          const addrID = await addrDB.create({ cep, street, complement, district, state, uf });
          req.session.addr = { id: addrID, cep, street, complement, district, state, uf };

        } else {
          req.session.addr = { id: foundAddress[0].id, cep, street, complement, district, state, uf };

          await addrDB.update(
            { id: cep, column: 'cep' },
            { cep, street, complement, district, state, uf }
          );
        }
      }


      if (req?.user?.allowUpdate) {
        const userDB = new User();
        await userDB.update(req.user.val, req.user.fields);
      }

      if (req?.updatedFiles) {
        saveFiles(req.updatedFiles, { user_id: userID });
      }

      return res.redirect(`users/profile/${userID}?status=200`);

    } catch (error) {
      console.error(`Failed to save. error: ${error}`);

      return res.redirect(`users/profile/${userID}?status=400`);
    }
  },
  async delete(req, res) {
    let { id } = req.body;
    id = Number(id);

    async function removeLocalPhotos(id, column) {
      const photos = await getImagesWithoutReplace({ id, column });
      let removedPhotos = [];

      for (let i = 0; i <= photos.length; i++) {
        removedPhotos.push(photos.indexOf(photos[i]));
      }

      removedPhotos = removedPhotos.toString();

      await removeImages(removedPhotos, photos);
    }

    try {
      await removeLocalPhotos(id, "user_id");

      const productDB = new Product();
      const products = await productDB.get({ id, column: "user_id" });

      for (const product of products) {
        await removeLocalPhotos(product.id, "product_id");
      }

      const userDB = new User();
      await userDB.delete({ id, column: "id" });

      req.session.destroy();

      return res.redirect("/session/login?status=200");

    } catch (error) {
      console.log(`Unexpected error in DELETE CONTROLLERS: ${error}`);
    }
  },
}

export default UserController;