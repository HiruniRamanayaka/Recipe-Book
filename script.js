document.getElementById("search-btn").addEventListener("click", fetchRecipes);
document.getElementById("category-select").addEventListener("change", fetchRecipesByCategory);

async function fetchRecipes() {
    const query = document.getElementById("search").value.trim();
    const recipeContainer = document.getElementById("recipe-container");

    if (query === "") {
        alert("Please enter a recipe name.");
        return;
    }

    recipeContainer.innerHTML = "<p>Loading...</p>";
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        recipeContainer.innerHTML = "";

        if (data.meals) {
            data.meals.forEach(meal => {
                const recipeHTML = `
                    <div class="recipe">
                        <h2>${meal.strMeal}</h2>
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="100%">
                        <p><strong>Category:</strong> ${meal.strCategory}</p>
                        <button onclick="showFullRecipe('${meal.idMeal}')">View Full Recipe</button>
                    </div>
                `;
                recipeContainer.innerHTML += recipeHTML;
            });
        } else {
            recipeContainer.innerHTML = "<p>No recipes found.</p>";
        }
    } catch (error) {
        alert("Error fetching recipes.");
        console.error(error);
    }
}

async function showFullRecipe(mealId) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const recipeContainer = document.getElementById("full-recipe");
    const overlay = document.getElementById("overlay");

    try {
        const response = await fetch(url);
        const data = await response.json();
        const meal = data.meals[0];

        recipeContainer.innerHTML = `
            <button class="close-btn" onclick="closeFullRecipe()">X</button>
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <p><strong>Instructions:</strong></p>
            <p>${meal.strInstructions}</p>
            <p><strong>Ingredients:</strong></p>
            <ul>
                ${Object.keys(meal)
                    .filter(key => key.startsWith("strIngredient") && meal[key])
                    .map(key => `<li>${meal[key]} - ${meal[`strMeasure${key.slice(13)}`]}</li>`)
                    .join("")}
            </ul>`;
        recipeContainer.style.display = "block";
        overlay.style.display = "block";
    } catch (error) {
        alert("Error fetching full recipe details.");
    }
}

function closeFullRecipe() {
    document.getElementById("full-recipe").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

async function fetchCategories() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    try {
        const response = await fetch(url);
        const data = await response.json();
        const categorySelect = document.getElementById("category-select");

        data.categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.strCategory;
            option.textContent = category.strCategory;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        alert("Error fetching categories.");
    }
}

async function fetchRecipesByCategory() {
    const category = document.getElementById("category-select").value;
    const recipeContainer = document.getElementById("recipe-container");

    if (category === "") {
        fetchRecipes();
        return;
    }

    recipeContainer.innerHTML = "<p>Loading...</p>";
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        recipeContainer.innerHTML = "";

        if (data.meals) {
            data.meals.forEach(meal => {
                const recipeHTML = `
                    <div class="recipe">
                        <h2>${meal.strMeal}</h2>
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="100%">
                        <button onclick="showFullRecipe('${meal.idMeal}')">View Full Recipe</button>
                    </div>
                `;
                recipeContainer.innerHTML += recipeHTML;
            });
        } else {
            recipeContainer.innerHTML = "<p>No recipes found.</p>";
        }
    } catch (error) {
        alert("Error fetching recipes.");
    }
}

// Load categories when the page loads
fetchCategories();
