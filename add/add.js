/* --------------- DATA PROCESSING --------------- */
class Category {
  constructor(e) {
    this.emoji = categories[e].emoji;
    this.categoryName = e;
    this.isExpenditure = categories[e].isExpenditure;
  }
}

/* --------------- INTERFACE --------------- */
class UI {
  constructor() {
    const categoriesArr = Object.keys(categories);
    const categoryData = [];
    for (const e of categoriesArr) {
      const temp = new Category(e);
      categoryData.push(temp);
    }

    this.categoryData = categoryData;
    this.createCategoryHTML();
  }

  /**
   * Generate HTML content
   */
  createCategoryHTML() {
    // Seperate expenditure and income into two arrays
    const expenditureArr = [];
    const incomeArr = [];
    this.categoryData.forEach((category) => {
      if (category.isExpenditure == true) {
        expenditureArr.push(category);
      } else {
        incomeArr.push(category);
      }
    });

    // Generate HTML content for categories in expenditure
    let expenditureTemplate = `<div class="main-container__expenditure">`;
    expenditureArr.forEach((category) => {
      const oneCategory = `
        <div class="category-container">
            <button class="category-container__btn">
                <span class="category-container__btn-emoji">${category.emoji}</span>
            </button>
            <span class="category-container__desc">${category.categoryName}</span>
        </div>`;
      expenditureTemplate += oneCategory;
    });
    expenditureTemplate += `</div>`;

    // Generate HTML content for categories in income
    let incomeTemplate = `<div class="main-container__income">`;
    incomeArr.forEach((category) => {
      const oneCategory = `
        <div class="category-container">
            <button class="category-container__btn">
                <span class="category-container__btn-emoji">${category.emoji}</span>
            </button>
            <span class="category-container__desc">${category.categoryName}</span>
        </div>`;
      incomeTemplate += oneCategory;
    });
    incomeTemplate += `</div>`;

    // Coalesce
    document.querySelector(".slides").innerHTML =
      expenditureTemplate + incomeTemplate;
  }
}
const ui = new UI();

/* --------------- INTERACTION --------------- */
const slides = document.querySelectorAll(".slides > div");
let categoryIndex = 0;
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
