const FILTERS = document.querySelector(".filters");
const BTN_FULLSCREEN = document.querySelector(".fullscreen");
const BTN_RESET = document.querySelector(".btn-reset");
const BTN_SAVE = document.querySelector(".btn-save");
const BTN_NEXT = document.querySelector(".btn-next");
const FILE_IMPUT = document.getElementById("fileLoad");
const CSS_STYLE = document.documentElement.style;
const IMAGE = document.getElementById("image");
const PRESETS_BLOCK = document.querySelector(".presets");
const PRESETS = document.querySelectorAll(".presets__img");
const IMAGES_DIR =
    "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";
const DEFAULT_FILTERS = {
    blur: "0px",
    invert: "0%",
    sepia: "0%",
    saturate: "100%",
    "hue-rotate": "0deg",
    contrast: "100%",
    brightness: "100%",
    grayscale: "0%",
};
let imageNumber = 1;

const CANVAS = new Canvas(document.querySelector("canvas"));
CANVAS.loadImage(IMAGE.src);
resetFilters();

function handleInputChange(event) {
    const range = event.target;
    if (!range.matches("input[type=range]")) return;

    const output = document.querySelector(`output[name=${range.name}]`);
    output.innerHTML = range.value;

    const suffix = range.dataset.sizing;
    CSS_STYLE.setProperty(`--${range.name}`, range.value + suffix);
}

function applyFilters() {
    const filters = {};
    for (const key in DEFAULT_FILTERS) {
        let filterValue =
            CSS_STYLE.getPropertyValue(`--${key}`) || DEFAULT_FILTERS[key];
        if (key === "blur") {
            const coefficient = IMAGE.naturalHeight / IMAGE.height;
            filterValue = filterValue.match(/\d+/) * coefficient + "px";
        }
        filters[key] = filterValue;
    }
    CANVAS.applyFilters(filters);
}

function saveImage() {
    const filters = {};
    for (const key in DEFAULT_FILTERS) {
        let filterValue =
            CSS_STYLE.getPropertyValue(`--${key}`) || DEFAULT_FILTERS[key];
        if (key === "blur") {
            const coefficient = IMAGE.naturalHeight / IMAGE.height;
            filterValue = filterValue.match(/\d+/) * coefficient + "px";
        }
        filters[key] = filterValue;
    }
    CANVAS.applyFilters(filters);
    CANVAS.downloadImage();
}

function hideImages() {
    IMAGE.style.opacity = 0;
    PRESETS.forEach((img) => {
        img.style.opacity = 0;
    });
}

function showImages() {
    IMAGE.style.opacity = 1;
    PRESETS.forEach((img) => {
        img.style.opacity = 1;
    });
}

function changeImage() {
    const hour = new Date().getHours();
    let daytime;
    switch (true) {
        case hour >= 6 && hour < 12:
            daytime = "morning";
            break;
        case hour >= 12 && hour < 18:
            daytime = "day";
            break;
        case hour >= 18 && hour < 24:
            daytime = "evening";
            break;
        case hour < 6:
            daytime = "night";
            break;
    }

    imageNumber++;
    if (imageNumber > 20) imageNumber = 1;
    if (imageNumber < 10) imageNumber = "0" + imageNumber;

    hideImages();

    IMAGE.src = `${IMAGES_DIR}/${daytime}/${imageNumber}.jpg`;
    IMAGE.onload = () => {
        CANVAS.loadImage(IMAGE.src);
        PRESETS.forEach((img) => (img.src = IMAGE.src));
        showImages();
    };
}

function loadImage() {
    const file = FILE_IMPUT.files[0];
    if (!file) return;
    const reader = new FileReader();

    hideImages();

    reader.onload = () => {
        IMAGE.src = reader.result;
        CANVAS.loadImage(IMAGE.src);
        PRESETS.forEach((img) => (img.src = IMAGE.src));
        showImages();
    };
    reader.readAsDataURL(file);
    // reset fileinput
    FILE_IMPUT.value = "";
}

function applyPreset(event) {
    if (!event.target.matches(".presets__img")) return;
    let filters = {};
    if (event.target.style["filter"]) {
        event.target.style["filter"].split(" ")?.forEach((el) => {
            filters[el.match(/^[a-zA-Z\-]+/)] = el.match(/\d+[^\)]+/)?.pop();
        });
    } else {
        filters = DEFAULT_FILTERS;
    }
    setFilters(filters);
}

function setFilters(filters) {
    filters = { ...DEFAULT_FILTERS, ...filters };
    for (const key in filters) {
        CSS_STYLE.setProperty(`--${key}`, filters[key]);
        const range = document.querySelector(`input[name=${key}]`);
        const output = document.querySelector(`output[name=${key}]`);
        range.value = filters[key].match(/\d+/);
        output.value = range.value;
    }
}

function resetFilters() {
    setFilters(DEFAULT_FILTERS);
}

/*  FullScreen */
function toggleFullScreen() {
    const fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElemen ||
        document.webkitFullscreenElement;

    if (fullscreenElement) {
        deactivateFullscreen();
    } else {
        activateFullscreen(document.documentElement);
    }
}

function activateFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function deactivateFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

FILTERS.addEventListener("input", handleInputChange);
BTN_FULLSCREEN.addEventListener("click", toggleFullScreen);
BTN_RESET.addEventListener("click", resetFilters);
BTN_SAVE.addEventListener("click", saveImage);
BTN_NEXT.addEventListener("click", changeImage);
FILE_IMPUT.addEventListener("change", loadImage);
PRESETS_BLOCK.addEventListener("click", applyPreset);
