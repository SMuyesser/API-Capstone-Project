var RecipeRequest_URL = 'https://food2fork-api-proxy.glitch.me/get';
var SearchRequest_URL = 'https://food2fork-api-proxy.glitch.me/search';

//array to hold selected ingredients
var selected = []; 

//show nav after leaving homepage and remove homepage buttons
$('body').on('click', 'button#recipe-search, button#ingredient-search', function(event) {
  $('nav').removeClass('hidden');
  $('div.home-container').addClass('hidden');
});

//show recipe search page
$('body').on('click', 'button#recipe-search', function(event) {
  $('#title-searchbar').removeClass('hidden');
  $('div.js-seach-results').removeClass('hidden');
});

//show ingredient search page
$('body').on('click', 'button#ingredient-search', function(event) {
  $('.ingredient-selector').removeClass('hidden');
  $('div#current-ingredients-section').removeClass('hidden');
  $('button#confirm-ingredients').removeClass('hidden');
});

//nav home button
$('nav').on('click', 'button#nav-home', function(event) {
  $('nav').addClass('hidden');
  $('div.home-container').removeClass('hidden');
  $('#title-searchbar').addClass('hidden');
  $('div.js-seach-results').addClass('hidden');
  $('.ingredient-selector').addClass('hidden');
  $('div#current-ingredients-section').addClass('hidden');
  $('div#change-ingredients').addClass('hidden');
  $('div#recipe-search-buttons').addClass('hidden');
  $('#back-to-top').addClass('hidden');
  $('p#click-recImage-text').addClass('hidden');
  $('p#click-ingImage-text').addClass('hidden');
  var curIngredients = $('div#current-ingredients')
  $('.selected-button').removeClass('selected-button');
  curIngredients.children().remove();
  selected.length=0; 
  clearResults();
});

//nav recipe search button
$('nav').on('click', 'button#nav-search-recipes', function(event) {
  $('.ingredient-selector').addClass('hidden');
  $('div#current-ingredients-section').addClass('hidden');  
  $('div#change-ingredients').addClass('hidden');
  $('#back-to-top').addClass('hidden');
  $('div#recipe-search-buttons').addClass('hidden');
  $('p#click-recImage-text').addClass('hidden');
  $('p#click-ingImage-text').addClass('hidden');
  $('#title-searchbar').removeClass('hidden');
  $('div.js-seach-results').removeClass('hidden');
  var curIngredients = $('div#current-ingredients')
  $('.selected-button').removeClass('selected-button');
  curIngredients.children().remove();
  selected.length=0; 
  clearResults();
});

//nav ingredient search button
$('nav').on('click', 'button#nav-ingredient-search', function(event) {
  $('.ingredient-selector').removeClass('hidden');
  $('div#current-ingredients-section').removeClass('hidden');
  $('button#confirm-ingredients').removeClass('hidden');
  $('#title-searchbar').addClass('hidden');
  $('div.js-seach-results').addClass('hidden');
  $('div#change-ingredients').addClass('hidden');
  $('#back-to-top').addClass('hidden');
  $('div#recipe-search-buttons').addClass('hidden');
  $('p#click-ingImage-text').addClass('hidden');
  $('p#click-recImage-text').addClass('hidden');
  var curIngredients = $('div#current-ingredients')
  $('.selected-button').removeClass('selected-button');
  curIngredients.children().remove();
  selected.length=0; 
  clearResults();
});

//change button color and add ingredient to selected array on click, remove and change color back if clicked again
$('div.ingredient-list').on('click', 'button', function(event) { 
  var curIngredients = $('div#current-ingredients');
  var ingredientVal = $(this).val();
  //regex below replaces spaces in ingredientVal with '-' to ensure propper format for the id
  var ingredientId = ingredientVal.replace(/\s+/g, '-');
  if (!$(this).hasClass('selected-button')) {
    $(this).addClass('selected-button');
    if (ingredientVal=="NaN") {
      return selected;
    } else {
      selected.push(ingredientVal);
      curIngredients.append('<p id=' + ingredientId + '>' + ingredientVal + '</p>'); 
    }
  } else {
    $(this).removeClass('selected-button');
    var removeItemIndex = selected.indexOf(ingredientVal);
    selected.splice(removeItemIndex, 1); 
    var removeIngredient = '"#' + ingredientVal + '"';
    console.log(removeIngredient);
    curIngredients.children().remove('#'+ingredientId);
  }
  return selected;
});

//submit ingredient search button
$('body').on('click', 'button#confirm-ingredients', function getSearchFromApi(event) {
  $('div#initialLoadingProgress').removeClass('hidden');
  $('button#confirm-ingredients').addClass('hidden');
  $('.ingredient-selector').addClass('hidden');
  $('div#change-ingredients').removeClass('hidden');
  var searchTerm = selected.toString();
  var query = {
    q: searchTerm,
  }
  $.getJSON(SearchRequest_URL, query, function(data) {
    if (data.count === 0) {
      $('p#click-ingImage-text').html('No Recipes Found').removeClass('hidden');
      $('button#show-more-ingRecipe-btn').addClass('hidden');
    } else {
      var displayElem = $('.js-search-results');
      var ingRecipes = data.recipes.map(function(recipe) {
        var elem = $('.js-result-template').children().clone();
        var imageUrl = recipe.image_url;
        var sourceUrl = recipe.source_url;
        var recipeName = recipe.title;
        elem.find('h5').html(recipeName);
        elem.find('img').attr('src', imageUrl);
        elem.find('a').attr('href', sourceUrl);
        return elem;
      })
      $('p#click-ingImage-text').html('Click an image below to see the recipe.').removeClass('hidden');
      $('button#show-more-ingRecipe-btn').removeClass('hidden');
      displayElem.html(ingRecipes);
    }
      $('div#initialLoadingProgress').addClass('hidden');
  });
});

//change ingredients if search returns undesired results
$('body').on('click', 'button#change-ingredient-btn', function(event) {
  $('.ingredient-selector').removeClass('hidden');
  $('div#current-ingredients-section').removeClass('hidden');
  $('button#confirm-ingredients').removeClass('hidden');
  $('div#change-ingredients').addClass('hidden');
  $('p#click-ingImage-text').addClass('hidden');
  clearResults();
});

//resets current ingredient selection
$('body').on('click', 'button#reset', function(event) {
  var curIngredients = $('div#current-ingredients')
  $('.selected-button').removeClass('selected-button');
  curIngredients.children().remove();
  selected.length=0; 
});

//food2fork recipe search api
function getSearchFromApi(searchTerm, callback) {
  var query = {
    q: searchTerm,
  }
  $.getJSON(SearchRequest_URL, query, callback);
}

//show more recipes
var page=1;
$('body').on('click', 'button#show-more-recipe-btn', function(event) {
  $('div.moreLoadingProgress').removeClass('hidden');
  var searchTerm = $('#title-searchbar').find('.js-query').val();
  page += 1;
  var query = {
    q: searchTerm,
    page: page,
  }
  $.getJSON(SearchRequest_URL, query, function(data) {
    var displayElem = $('.js-search-results');
    var recipes = data.recipes.map(function(recipe) {
      var elem = $('.js-result-template').children().clone();
      var imageUrl = recipe.image_url;
      var sourceUrl = recipe.source_url;
      var recipeName = recipe.title;
      elem.find('h5').html(recipeName);
      elem.find('img').attr('src', imageUrl);
      elem.find('a').attr('href', sourceUrl);
      return elem;
    });
    displayElem.append(recipes);
    $('div.moreLoadingProgress').addClass('hidden');
  });
})

//show more ingredient search recipes
$('body').on('click', 'button#show-more-ingRecipe-btn', function(event) {
  $('div.moreLoadingProgress').removeClass('hidden');
  var searchTerm = selected.toString();
  page += 1;
  var query = {
    q: searchTerm,
    page: page,
  }
  $.getJSON(SearchRequest_URL, query, function(data) {
    var displayElem = $('.js-search-results');
    var recipes = data.recipes.map(function(recipe) {
      var elem = $('.js-result-template').children().clone();
      var imageUrl = recipe.image_url;
      var sourceUrl = recipe.source_url;
      var recipeName = recipe.title;
      elem.find('h5').html(recipeName);
      elem.find('img').attr('src', imageUrl);
      elem.find('a').attr('href', sourceUrl);
      return elem;
    });
    displayElem.append(recipes);
    $('div.moreLoadingProgress').addClass('hidden');
  });
})

//display search results
function displaySearchData(data) {
  var displayElem = $('.js-search-results');
  if (data.count === 0) {
    $('p#click-recImage-text').addClass('hidden');
    $('div#recipe-search-buttons').addClass('hidden');
    var searchFor = $('.js-query').val();
    var noResults = "<h2>No recipes for " + searchFor + " were found.  How about trying to find a different recipe?</h2>"
    $('div.js-search-results').append(noResults);
  } else {
    var recipes = data.recipes.map(function(recipe) {
      var elem = $('.js-result-template').children().clone();
      var imageUrl = recipe.image_url;
      var sourceUrl = recipe.source_url;
      var recipeName = recipe.title;
      elem.find('h5').html(recipeName);
      elem.find('img').attr('src', imageUrl);
      elem.find('a').attr('href', sourceUrl);
      return elem;
    });
    displayElem.html(recipes);
    $('p#click-recImage-text').removeClass('hidden');
    $('div#recipe-search-buttons').removeClass('hidden');
  }
  $('div#initialLoadingProgress').addClass('hidden');
}

function clearResults() {
    $('.js-search-results').empty();
 }

function watchSubmit() {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    clearResults();
    var query = $(this).find('.js-query').val();
    $('div#initialLoadingProgress').removeClass('hidden');
    getSearchFromApi(query, displaySearchData);
  });
}

$(function() {
    watchSubmit();
});
