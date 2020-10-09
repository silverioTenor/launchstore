// ==============================================================================
// ================================= ARROW MENU =================================
// ==============================================================================

const links = document.querySelectorAll('.menu a');
const container = document.querySelector('.submenu-container');

for (const link of links) {

    link.addEventListener("mouseover", () => {
        const arrow = link.querySelector('i');

        if (arrow.classList.contains("fa-caret-down")) {
            arrow.classList.remove("fa-caret-down");
            arrow.classList.add("fa-caret-up");

            container.classList.add("visible");
        }
    });

    link.addEventListener("mouseout", () => {
        const arrow = link.querySelector('i');
        
        if (arrow.classList.contains("fa-caret-up")) {
            arrow.classList.remove("fa-caret-up");
            arrow.classList.add("fa-caret-down");

        }
        container.classList.remove("visible");
    });
    
}