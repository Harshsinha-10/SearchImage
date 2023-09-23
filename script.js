const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input")
const lightBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".close-icon");
const downloadImgBtn = lightBox.querySelector(".uil-import");

const apiKey = "rbuJz2Y4rjRgEnE3i1w016EHZbEkyQvoG8W3GuVfTntEt6ispyb8PUOc"
const perPage = 20;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download"));
}


// showLightbox
const showLightbox = (name, img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show")
    document.body.style.overflow = "hidden";
}

// hidelightBox
const hidelightBox = () => {
    lightBox.classList.remove("show");
}


const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
        <img onclick="showLightbox('${img.photographer}', '${img.src.large2x}')" src="${img.src.large2x}" alt="img">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                <i class="uil uil-import"></i>
            </button>
        </div>
    </li>`
    ).join("");
}

const getImages = (apiURL) => {
    loadMoreBtn.innerText = "Loading Images...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");

    })
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL
    getImages(apiURL);
}


const loadSearchImages = (e) => {
    if (e.target.value == "") return searchTerm = null;
    if (e.key == "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);

    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hidelightBox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));