const resultContainer = document.getElementById("result");
const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const searchContainer = document.querySelector(".search-box");

// URL da API para buscar dados de refeição
const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Ouvintes de evento para pesquisa e entrada (ao pressionar enter)
searchBtn.addEventListener("click", searchMeal);
searchInput.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        searchMeal();
    }
});

// Lidar com a função de refeição
function searchMeal() {
    const userInput = searchInput.value.trim();
    if (!userInput) {
        resultContainer.innerHTML = `<h3>Campo de entrada não pode estar vazio</h3>`;
        return;
    }
    // Buscar dados de refeição usando API com entrada do usuário
    fetch(apiUrl + userInput).then((response) => response.json()).then((data) => {
        const meal = data.meals[0];
        // Lidar onde nenhuma refeição foi encontrada
        if (!meal) {
            resultContainer.innerHTML = `<h3>Nenhuma refeição encontrada, tente novamente!</h3>`;
            return;
        }
        const ingredients = getIngredients(meal);
        // Gere Html para exibir os dados da refeição
        const recipeHtml = `
            <div class="details">
                <h2>${meal.strMeal}</h2>
                <h4>${meal.strArea}</h4>
            </div>
            <img src=${meal.strMealThumb} alt=${meal.strMeal} />
            <div id="ingre-container">
                <h3>Ingredients:</h3>
                <ul>${ingredients}</ul>
            </div>
            <div id="recipe">
                <button id="hide-recipe">X</button>
                <pre id="instructions">${meal.strInstructions}</pre>
            </div>
            <button id="show-recipe">Ver Receita</button>
        `;
        resultContainer.innerHTML = recipeHtml;

        const hideRecipeBtn = document.getElementById("hide-recipe");
        hideRecipeBtn.addEventListener("click", hideRecipe);
        const showRecipeBtn = document.getElementById("show-recipe");
        showRecipeBtn.addEventListener("click", showRecipe);
        searchContainer.style.opacity = '0';
        searchContainer.style.display = 'none';
    })
        // Lidar com erro
        .catch(() => {
            searchContainer.style.opacity = '1';
            searchContainer.style.display = 'grid';
            resultContainer.innerHTML = `<h3>Erro ao buscar dados!</h3>`;
        });
}

// Gerar html para lista de ingredientes
function getIngredients(meal) {
    let ingreHtml = "";
    // Pode haver no máximo 20 ingredientes
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingreHtml += `<li>${measure} ${ingredient}</li>`;
        }
        // Se o ingrediente não existir, saia do loop
        else {
            break;
        }
    }
    return ingreHtml;
}

// Lidar com mostrar e ocultar receita para uma refeição
function hideRecipe() {
    const recipe = document.getElementById("recipe");
    recipe.style.display = "none";
}
function showRecipe() {
    const recipe = document.getElementById("recipe");
    recipe.style.display = "block";
}