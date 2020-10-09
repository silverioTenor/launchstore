// ==============================================================================
// ================================= ARROW MENU =================================
// ==============================================================================

const links = document.querySelectorAll('.menu .sub');
// const container = document.querySelector('.submenu-container');

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