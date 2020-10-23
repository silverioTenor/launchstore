// ==============================================================================
// ================================= ARROW MENU =================================
// ==============================================================================

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

// ==============================================================================
// =================================== CHECKED ==================================
// ==============================================================================

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

  // ================================== PRICE =================================


}

// ==============================================================================
// ================================ CHANGE IMAGE ================================
// ==============================================================================

if (document.querySelector('.small-view')) {
  const bigImage = document.querySelector('.big-view > img');
  const containersImages = document.querySelectorAll('.small');

  for (const container of containersImages) {

    container.addEventListener("click", (event) => {
      const { target } = event;

      containersImages.forEach(small => small.classList.remove('active'));

      bigImage.src = target.src;
      container.classList.add('active');
    });
  }
}

// ==============================================================================
// ==============================================================================

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
  uploadLimit: 8,
  preview: document.querySelector('#photos-preview'),
  handleFileInput(event) {
    const { files: fileList } = event.target;

    if (PhotosUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const divContainer = PhotosUpload.divConstructor(image);
        PhotosUpload.preview.appendChild(divContainer);
      };

      reader.readAsDataURL(file);
    });
  },
  hasLimit(event) {
    const { files: fileList } = event.target;
    const { uploadLimit } = PhotosUpload;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`);

      event.preventDefault();
      return true;
    }

    return false;
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
    const photoDiv = event.target.parentNode;
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);

    photoDiv.remove();
  }
}