let startX;
let scrollLeft;

function sliderActive(event) {
    event.preventDefault();
    startX = event.pageX - PRESETS_BLOCK.offsetLeft;
    scrollLeft = PRESETS_BLOCK.scrollLeft;
    PRESETS_BLOCK.classList.add("active");
    PRESETS_BLOCK.addEventListener("mousemove", sliderDrag);
}

function sliderOff() {
    PRESETS_BLOCK.classList.remove("active");
    PRESETS_BLOCK.removeEventListener("mousemove", sliderDrag);
}

function sliderDrag(event) {
    const x = event.pageX - PRESETS_BLOCK.offsetLeft;
    const walk = x - startX;
    PRESETS_BLOCK.scrollLeft = scrollLeft - walk;
}

PRESETS_BLOCK.addEventListener("mouseup", sliderOff);
PRESETS_BLOCK.addEventListener("mouseleave", sliderOff);
PRESETS_BLOCK.addEventListener("dragstart", sliderActive);
