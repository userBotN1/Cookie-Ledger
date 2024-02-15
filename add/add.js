const slides = document.querySelectorAll(".slides > div");
let categoryIndex = 0;
console.log(slides);
function initializeCategory() {
  slides[categoryIndex].classList.add("displayCategory");
}

function showCategory(categoryDesc) {
  if (0 <= categoryIndex && categoryIndex < slides.length) {
    slides.forEach((slide) => {
      slide.classList.remove("displayCategory");
    });

    slides[categoryIndex].classList.add("displayCategory");
    categoryTitle.textContent = categoryDesc;
  }
}

function prevCategory() {
  categoryIndex--;
  showCategory("Expenditure");
}

function nextCategory() {
  categoryIndex++;
  showCategory("Income");
}

const categoryTitle = document.querySelector(".header__title");
const leftBtn = document.querySelector(".header__left-btn");
const rightBtn = document.querySelector(".header__right-btn");

leftBtn.addEventListener("click", prevCategory);
rightBtn.addEventListener("click", nextCategory);
document.addEventListener("DOMContentLoaded", initializeCategory);
