const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");

let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";            //default filter value
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const loadImage = () => {
    let file = fileInput.files[0];                      //getting user selecetd file
    if(!file) return;                                   //return if user hasn't selected any file
    previewImg.src = URL.createObjectURL(file);         //passing file URL as preview img src
    previewImg.addEventListener("load", () => {         
        resetFilterBtn.click();                         //reset the filter values if user select new image
        document.querySelector(".container").classList.remove("disable");         //removing disable class from container once user selects image
    });
}

const applyFilter = () => {                                //applying selected filters to the image
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

filterOptions.forEach(option => {                         //adding click event listner to all filter buttons
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;         //changing filter name in the filter info

        if(option.id === "brightness") {                //storing a particular filter value to a particular filter
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        } else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {                            //update the filter value according to the slider value
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if(selectedFilter.id === "brightness") {            //if selected filter is brightness, pass the slider value as value of brightness
        brightness = filterSlider.value;
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {           //adding click event listener to all rotate/flip buttons
        if(option.id === "left") {
            rotate -= 90;
        } else if(option.id === "right") {
            rotate += 90;
        } else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

const resetFilter = () => {                           //resetting all variable value to its default value
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");      //creating canvas element
    const ctx = canvas.getContext("2d");                  //canvas.getContext return a drawing context on the canvas
    canvas.width = previewImg.naturalWidth;               //setting canvas width to actual image width
    canvas.height = previewImg.naturalHeight;             //setting canvas height to actual image height
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;  //applying user selected filters to this canvas image
    ctx.translate(canvas.width / 2, canvas.height / 2);    //translating canvas from center
    if(rotate !== 0) {                                     //applying user selected rotate to this canvas image
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);              //applying user selected flips to this canvas image
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);       //drawImage provides different ways to draw an image onto the canvas
    
    const link = document.createElement("a");             //creating download link with <a> 
    link.download = "image.jpg";                          //passing <a> tag download value to "image.jpg"
    link.href = canvas.toDataURL();                       //passing <a> tag href value to canvas data url  //toDataURL returns a data URL containing a representation of image
    link.click();                                         //clicking <a> tag so the image download
}

filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());