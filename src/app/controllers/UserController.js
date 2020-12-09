import { hash } from 'bcryptjs';

import Address from '../models/Address';
import User from '../models/User';
import Product from './../models/Product';

import { getImagesWithoutReplace, removeImages, saveFiles } from './../services/procedures';
import { formatCpfCnpj, formatCep } from '../../lib/utils';

const UserController = {
  registerForm(req, res) {
    if (req.query.status == 400) {
      return res.render("users/register", {
        message: "Erro inesperado!",
        type: "error",
        formFull: false
      });
    }
  },
  async post(req, res) {
    try {
      let { name, email, password, cpf_cnpj } = req.body;

      password = await hash(password, 8);
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

      const values = { name, email, password, cpf_cnpj };

      const userDB = new User();
      await userDB.create(values);

      return res.redirect("/users/login");

    } catch (error) {
      console.error(error);

      return res.redirect("users/register?status=400");
    }
  },
  async show(req, res) {
    try {
      let { user, addr } = req;

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
      console.error(error);

      return res.render("users/index", {
        message: "Erro inesperado!",
        type: "error",
        formFull: true
      })
    }
  },
  async update(req, res) {
    const { userID: id } = req.session.user;

    try {
      const addrDB = new Address();
      await addrDB.update(req.addr.val, req.addr.fields);

      const userDB = new User();
      await userDB.update(req.user.val, req.user.fields);

      saveFiles(req.updatedFiles, { user_id: id });

      return res.redirect(`users/show/${id}?status=200`);

    } catch (error) {
      console.error(`Failed to save. error: ${error}`);

      return res.redirect(`users/show/${id}?status=400`);
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

      return res.redirect("/users/login?status=200");

    } catch (error) {
      console.log(`Unexpected error in DELETE CONTROLLERS: ${error}`);
    }
  },
}

export default UserController;