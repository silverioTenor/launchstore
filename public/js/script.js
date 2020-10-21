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
// ============================ FORMAT FIELD NUMERIC ============================
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

// ================================= ADD FIELDS =================================

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