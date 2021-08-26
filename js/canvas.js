class Canvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.img = new Image();
        this.img.setAttribute("crossOrigin", "anonymous");
        this.img.onload = () => {
            this.canvas.width = this.img.width;
            this.canvas.height = this.img.height;
            this.ctx.drawImage(this.img, 0, 0);
        };
    }

    loadImage(src) {
        this.img.src = src;
    }

    applyFilters(filters) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let sumFilters = "";
        for (const key in filters) {
            sumFilters += `${key}(${filters[key]})`;
        }
        this.ctx.filter = sumFilters;
        this.ctx.drawImage(this.img, 0, 0);
    }

    downloadImage() {
        const link = document.createElement("a");
        link.download = "image.png";
        link.href = this.canvas.toDataURL();
        link.click();
        link.delete;
    }
}
