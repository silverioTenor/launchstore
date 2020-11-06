// ================================= ARROW MENU =================================
const links = document.querySelectorAll('.menu .sub');

for (const link of links) {
  const submenu = link.querySelector('.subPhone-container');

  link.addEventListener("mouseover", () => {
    const arrow = link.querySelector('i');

    if (arrow.classList.contains("fa-caret-down")) {
      arrow.classList.remove("fa-caret-down");
      arrow.classList.add("fa-caret-up");

      submenu.classList.add("visible");
    }
  });

  link.addEventListener("mouseout", () => {
    const arrow = link.querySelector('i');

    if (arrow.classList.contains("fa-caret-up")) {
      arrow.classList.remove("fa-caret-up");
      arrow.classList.add("fa-caret-down");

    }
    submenu.classList.remove("visible");
  });

}

// =================================== CHECKED ==================================

if (document.querySelector('.container-checked')) {

  const checkbox = document.querySelectorAll('.box-checked');

  for (const check of checkbox) {

    check.addEventListener("click", () => {
      const inputElement = check.querySelector('input');
      let isChecked = inputElement.attributes.item(2);

      for (const c of checkbox) {
        c.querySelector('input').attributes.item(2).textContent = "";

        c.classList.remove('hover');
      }

      if (isChecked.textContent != "checked") {
        check.classList.add('hover');
        isChecked.textContent = "checked";
      }
    });
  }


}

const Mask = {
  apply(input, func) {
    setTimeout(() => {
      input.value = Mask[func](input.value);
    }, 1);
  },
  formatBRL(value) {
    value = value.replace(/\D/g, "");

    return new Intl.NumberFormat("pt-br", {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  },
  cpfCnpj(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 14) {
      value = value.slice(0, -1);
    }

    if (value.length < 12) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1-$2");

    } else {
      value = value.replace(/(\d{2})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }

    return value;
  },
  cepFormat(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 8) {
      value = value.slice(0, -1);
    }

    if (value.length < 9) {
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return value;
  }
}

const AddFields = {
  fieldConstructor() {
    const images = document.querySelector('#images');
    const imageContainer = document.querySelectorAll('.image');

    // Relaiza um clone do último ingrediente adicionado
    const newField = imageContainer[imageContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";

    images.appendChild(newField);

  },
  newField() {
    AddFields.fieldConstructor();
  }
}

const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  files: [],
  main(event, uploadLimit) {
    const { files: fileList } = event.target;

    PhotosUpload.input = event.target;

    if (PhotosUpload.hasLimit(event, uploadLimit)) return

    Array.from(fileList).forEach(file => {
      PhotosUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const divContainer = PhotosUpload.divConstructor(image);
        PhotosUpload.preview.appendChild(divContainer);
      };

      reader.readAsDataURL(file);
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  hasLimit(event, uploadLimit) {
    const { input, preview } = PhotosUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`);

      event.preventDefault();
      return true;
    }

    const photosDiv = [];

    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "photo") {
        photosDiv.push(item);
      }
    });

    const totalPhotos = fileList.length + photosDiv.length;

    if (totalPhotos > uploadLimit) {
      alert("Limite máximo atingido!");
      event.preventDefault();

      return true;
    }

    return false;
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  divConstructor(image) {
    const divContainer = document.createElement('div');

    divContainer.classList.add('photo');
    divContainer.onclick = PhotosUpload.removePhoto;
    divContainer.appendChild(image);
    divContainer.appendChild(PhotosUpload.createRemoveButton());

    return divContainer;
  },
  createRemoveButton() {
    const button = document.createElement('i');

    button.classList.add('material-icons');
    button.innerHTML = "close";

    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode; // <div class="photo">
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);

    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    photoDiv.remove();
  },
  countRemovedPhotos(event) {
    const photoContainer = event.target.parentNode;
    const removedPhoto = document.querySelector('input[name="removedPhotos"]');

    if (removedPhoto) removedPhoto.value += `${photoContainer.id},`;
  }
}

const ImageGallery = {
  bigView: document.querySelector('.big-view > img'),
  previews: document.querySelectorAll('.small'),
  setImage(event) {
    const { target } = event;

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
    target.parentNode.classList.add('active');

    ImageGallery.bigView.src = target.src;
  }
}

const Lightbox = {
  modal: document.querySelector('.lightbox-modal'),
  open(event) {
    const { target } = event;

    Lightbox.modal.classList.add('active-modal');
    Lightbox.modal.querySelector('img').src = target.src;
  },
  close() {
    Lightbox.modal.classList.remove('active-modal');
  }
}

const Address = {
  cep: document.querySelector('#cep'),
  async get() {
    let search = Address.cep.value.replace("-", "");

    if (search.length !== 8) return;

    const options = {
      method: 'GET',
      mode: 'cors',
      cache: 'default'
    }

    try {
      let response = await fetch(`https://viacep.com.br/ws/${search}/json/`, options);
      const data = await response.json();

      Address.fillFields(data);

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  },
  fillFields(data) {
    const street = document.querySelector('#street');
    street.value = data.logradouro;

    const complement = document.querySelector('#complement');
    complement.value = data.complemento;

    const district = document.querySelector('#district');
    district.value = data.bairro;

    const locale = document.querySelector('#locale');
    locale.value = data.localidade;

    const uf = document.querySelector('#uf');
    uf.value = data.uf;
  }
}

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input);

    let results = Validate[func](input.value);
    input.value = results.value;

    if (results.error) {
      Validate.displayError(input, results.error);
    }
  },
  displayError(input, error) {
    const divContainer = document.createElement('small');

    divContainer.classList.add('error');
    divContainer.innerHTML = error;

    input.parentNode.appendChild(divContainer);
    input.focus();
  },
  clearErrors(input) {
    const divError = input.parentNode.querySelector('.error');

    if (divError) divError.remove();
  },
  isEmail(value) {
    let error = null;

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value.match(mailFormat)) error = "E-mail inválido.";

    return {
      error,
      value
    }
  },
  isCpfAndCnpj(value) {
    let error = null;

    const cleanValues = value.replace(/\D/g, "");

    if (cleanValues.length > 11 && cleanValues.length !== 14) {
      error = "CNPJ inválido.";
    }
    else if (cleanValues.length < 11) {
      error = "CPF inválido.";
    }

    return {
      error,
      value
    }
  },
  isCep(value) {
    let error = null;

    const cleanValues = value.replace(/\D/g, "");

    if (cleanValues.length !== 8) {
      error = "CEP inválido.";
    }

    return {
      error,
      value
    }
  },
}