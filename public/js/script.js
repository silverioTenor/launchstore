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