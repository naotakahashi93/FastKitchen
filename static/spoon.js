const BASE_URL = "http://127.0.0.1:5000";

let your_ingredients = new Set()
// $("#checkedoff-arr").attr("value",Array.from(your_ingredients))

let user_favorites = new Set()


// function getYourIngredients(){
//     for (let i =0; i< $("#checkedoff-ings").children().length; i++){ 
//         your_ingredients.push($($("#checkedoff-ings").children()[i]).text())
//     }
// return your_ingredients}


function choiceHTML(choice){ // function for creating each individual cupcake markup
    return `
    <ul id=${choice} class="choice">
    ${$("#logoutuser").length ? favebtn() : ""}
    <input type="checkbox" id=${choice} name="ingredients" value=${choice}>
    <label for=${choice}>${choice}</label>
    </ul>
 `
    }

// this is the function that takes in a category name and calls the endpoint to generate the checklist
async function ingredients(name){ 
const response = await axios.get(`${BASE_URL}/ingredients/${name}`)
$("#category-section").empty() // we gotta clear out the section first if there is anything in it
$("#category-title").empty() // same with clearing out the category title section
// $("#category-section").append(response.data.form.hidden) // adding the hidden tag in the html for CSRF
for (let choices of response.data.ingredients){ // we then loop over each ingredient in that category 
        let choice = choiceHTML(choices) // create the markup (the checkbox) for that ingredient
        $("#category-section").append(choice) // and add it to the category section 
    };
}

// fucntion to load local storage so the checkboxes and ingredients list dont reset 
function loadLocalStorage(){
    
    for (let key in Object.keys(localStorage)){ // loop over all keys in local storage
        // console.log(Object.keys(localStorage)[key]) // get the names of the keys AKA the ingredient names
        chekedstorage = localStorage.getItem(`${Object.keys(localStorage)[key]}`) // this variable gets the value (true or false) of the keys in local storage
        // $(`label:contains(${Object.keys(localStorage)[key]})`).parent().find('input').attr("checked", chekedstorage) // we are then assgining true or false value to the checkmark of that ingredient from local storage 
        for(let i=0; i<$("label").length; i++){ // now we have to loop over each label on the page
            if($($("label")[i]).text() == Object.keys(localStorage)[key]){ // check to see if the text of that label has the same text as the key in local storage
                $($("label")[i]).parent().find('input').attr("checked", chekedstorage) // if it does then we mark that as checked

            }
            if (Object.keys(localStorage)[key].startsWith("fave")){ // if the keys in the localstorage start with "fave"
                if (`fave_${$($("label")[i]).text()}` === `${Object.keys(localStorage)[key]}`){ // and if the label text on the page match the key in local storage
                $($("button#faveiconbtn")[i]).addClass("fa-solid fa-bookmark")}// we are assigning a solid bookmark tag to remember that it was bookmarked
                // appendFavetoUserPage()
            }
        }
        if (Object.keys(localStorage)[key] !== "debug" && !Object.keys(localStorage)[key].startsWith("fave")){ // this is to stop the "debug" key (defaulted in localstorage) from rendering and to stop the keys that start with "fave_" from being added to the list
            $("#checkedoff-ings").append(`<li class="haveingredients" id="${Object.keys(localStorage)[key]}">${Object.keys(localStorage)[key]}</li>`) // we are taking the keys from local storage (AKA the ingredients that are checked off) and adding it to the "#checkedoff-ings" 
            your_ingredients.add(Object.keys(localStorage)[key])
        }
}

}

// function appendFavetoUserPage(){ // the fucntion to call when we open the user profile page
//     for (let key in Object.keys(localStorage)){ // looping over all the keys in localstorage
//         if (Object.keys(localStorage)[key].startsWith("fave")){
//     // $("#favorite-ings").append(`<li class="faveings" id="${Object.keys(localStorage)[key]}">${Object.keys(localStorage)[key]}</li>`) 
//     user_favorites.add(Object.keys(localStorage)[key]) // add the 
//     $("#user-fave-ings").attr("value", Array.from(user_favorites))
// }      
// }
// }

function faveList(){
    let fave_ing_arr =  Array.from(user_favorites)
    for (let ing in fave_ing_arr){
        let eachFaveIng = choiceHTML(fave_ing_arr[ing])
        $("#category-section").append(eachFaveIng)
    }
    $("#user-fave-ings").attr("value", fave_ing_arr)
}


function favebtn(){ // just a function to create the favorite button which we call when the user is logged in (aka when we can see there is a logout button)
    user = $("#userid-hidden").text()
    return `
  <button id="faveiconbtn" class='fa-regular fa-bookmark'></button>`; // 

}

$(document).on("click", ".fa-regular.fa-bookmark", function(e){
    // console.log("e tartgett", e.target)
    const targetBtn = e.target; // first we assign the event target to tartgetBtn (the favorite this button)
    const btnUl = $(targetBtn).closest("ul"); // we assign the closest li to the favorite this button we clicked
    const btnText = $(btnUl).text(); // we get the id of the li for the button we clicked which is the story id
    const name = btnText.trim();
    // console.log("BTNIDDDDD",name)
    if($(e.target).hasClass("fa-solid")){ // REMOVE FAVE- if the fave button already has a solid bookmark icon 
        $(this).removeClass().addClass("fa-regular fa-bookmark") // we remove that class
        localStorage.removeItem(`fave_${name}`) 
        user_favorites.delete(`fave_${name}`)
        $("#each-fave-ings").attr("value", `fave_${name}`)
        removeFave(`fave_${name}`)
    }
else{ // ADD FAVE - else if the fave button does is not solid we make it solid on click and add to favorites
    user = $("#userid-hidden").text()
    $(e.target).removeClass("fa-regular.fa-bookmark").addClass("fa-solid fa-bookmark")
    localStorage.setItem(`fave_${name}`, "true")
    user_favorites.add(`fave_${name}`)
    $("#each-fave-ings").attr("value", `fave_${name}`)
    addFave(`fave_${name}`)
    }}
    )


async function addFave(ingid){ 
    // user = $("#userid-hidden").text()
       const response = await axios.post(`${BASE_URL}/addfave/${ingid}`)
    //   console.log(response)
 }


async function removeFave(ingid){ 
    // user = $("#userid-hidden").text()
       const response = await axios.post(`${BASE_URL}/removefave/${ingid}`)
    //   console.log(response)
 }

// this is the onclikc fucntion to generate the ingredient list per category
$(document).on("click", ".category-btn", async function(){  //***only working on second click ***/
        loadDBfavetoLocalStorage()
        // $("#user-faves").show()
        $("#user-fave-use-only").hide()
        $("#checkedoff-ings").empty() // clearning the "#checkedoff-ings" everytime so we can add it again when we load local storage
        $("#checkedoff-ings").append("<button type='submit' id='getrecipes'>Get Recipes!</button>") 
        // console.log(e.target);
        // let $category = $(e.target).closest("btn");
        // console.log("ccc", $category);
        $("#checkedoff-arr").attr("value",Array.from(your_ingredients))
        let name = $(this).attr("id"); // getting the id of the category tab that was clicked on
        // console.log("nnn", name); 
        await ingredients(name); // passing the name of that category into the ingredients function to generate the choice options
        $("#category-title").append($(this).text()) // and we also add the name of the category to the title section
        /// local storage load 
        loadLocalStorage()})


// the click function to load the userfaves from the db and display them onto the page. 
$(document).on("click", "#user-fave-buttonnn", async function(){
        const response = await axios.get(`${BASE_URL}/userfaves`);
        // console.log(response);
        $("#category-title").text("Your Favorites")
        $("#category-section").empty()
        $("#user-fave-use-only").show()
        $("#user-fave-use-only").empty()
        $("#checkedoff-ings").empty()
        $("#checkedoff-ings").append("<button type='submit' id='getrecipes'>Get Recipes!</button>")
    for (let fave of response.data.user_faves){ // we then loop over each ingredient in that category 
        const favelist =  `<ul id=${fave.display} class="choice">
        <input type="checkbox" id=${fave.display} name="ingredients" value=${fave.display}>
        <label for=${fave.display}>${fave.display}</label>
        </ul>`
        // let faveingg = choiceHTML(fave.display)
        $("#user-fave-use-only").append(favelist) // and add it to the category section 
        };  
        loadDBfavetoLocalStorage(); 
        loadLocalStorage()   
    })

$(document).on("mouseenter", "#user-fave-use-only ul", // the function that creates a trash icon when you hover over the ul in the favorites page  
    function(e) {
        $( this ).append($( "<span> <i id='fave-remove-ing' class='fa-solid fa-trash-can'></i></span>" )); // when the mouse enters the "li" we are adding the "x" span next to it 
      }).on("mouseleave", "#user-fave-use-only ul", function(e) { // removing the "x" when the mouse leaves
        $( this ).find( "span" ).last().remove();
    }
  );



  $(document).on("click", "#fave-remove-ing", function(e){ // the onclick function to remove the ingredient from the "favorited" list
    $(this).closest("ul").remove()
    let ingToRemove = $(this).closest("ul").text().trim(); 
    removeFave(`fave_${ingToRemove}`);
    user_favorites.delete(`fave_${ingToRemove}`)
    // console.log("INGTOREMOOOOVEE", ingToRemove)
    localStorage.removeItem(`fave_${ingToRemove}`) 
    loadDBfavetoLocalStorage() 
})




// function to add "checked" class to the ingredient items and add it to your ingredients list and take off if unchecked
$(document).on("click", 'input:checkbox', function(e){
    // console.log(e.target);
    // $(checkedingredient).attr("checked", chekedstorage)
    if ($(e.target).is(":checked")) {
        $(this).addClass("checked")
        let checkedingredient = $(this).parent().find('label').text()
        $("#checkedoff-ings").append(`<li class="haveingredients" id="${checkedingredient}">${checkedingredient}</li>`)
        localStorage.setItem(`${checkedingredient}`, true);
        // let idx = your_ingredients.indexOf(checkedingredient)
        // if(idx == -1){ // is the checked ingredient is not already in the array then we add it to the aray
        your_ingredients.add(checkedingredient)
    
    }
    else { // if the checkbox is not cheked 
    $(e.target).removeClass()
    let checkedingredient = $(this).parent().find('label').text(); 
    for(let i=0; i<$("li").length; i++){ //loop over each li on the page
        if($($("li")[i]).text() == checkedingredient){ // check to see if the text of that li has the same text as the checked ingredient
            $($("li")[i]).remove() // if it does then we remove it from the list
        }
    }
    localStorage.removeItem(`${checkedingredient}`);
    // let idx = your_ingredients.indexOf(checkedingredient)
    // if(idx !== -1){ // making sure your_ingredients is
    your_ingredients.delete(checkedingredient);
    // $("#number-of-ings").text(Array.from(your_ingredients).length)
}
 $("#checkedoff-arr").attr("value",Array.from(your_ingredients))
 })

// this click function is used to get an array of the checked off ingredients so we can use that for our API call 
$(document).on("submit", '#getrecipes', async function(){
    // $("#checkedoff-arr").attr("value",Array.from(your_ingredients))
    const response = await axios.get(`${BASE_URL}/recipes`)
    // console.log(response.data)

})

async function getSearchItems(query){
    $("#searchresult").append("<button id='exit-search-result' class='fa-regular fa-circle-xmark'> </button>"); // button to exit the search results
    const response = await axios.get(`${BASE_URL}/itemsearch/${query}`)
    // console.log(response)
    for (let item in response.data.result.results){
        let each = response.data.result.results[item]["name"]
        let choice = choiceHTML(each) // create the markup (the checkbox) for that ingredient
        $("#searchresult").append(choice) // and add it to the category section 
        loadDBfavetoLocalStorage()
    }
}

$(document).on("click", "#exit-search-result", function(){
    $("#searchresult").empty()
    $("#searchterm").val("")
})


$(document).on("click", '#search-ings', async function(e){ // function to call to when "search" is clicked to search for the ingredient the user typed in 
    e.preventDefault();
    $("#searchresult").empty() // first we gotta empty anything in the search results
   query = $("#searchterm").val() // grab the searh query of what the user typed in
   await getSearchItems(query) // call the function that calls the API to search ingredient which appends it to the page
   $("#checkedoff-ings").empty() // clearning the "#checkedoff-ings" everytime so we can add it again when we load local storage
    $("#checkedoff-ings").append("<button type='submit' id='getrecipes'>Get Recipes!</button>") 
   loadLocalStorage()
   loadDBfavetoLocalStorage()
})


$(document).on("mouseenter", ".haveingredients", // the function that creates an X when you hover over the "li"  
    function(e) {
        $( this ).append($( "<span> <i id='remove-ing' class='fa-solid fa-trash-can'></i></span>" )); // when the mouse enters the "li" we are adding the "x" span next to it 
      }).on("mouseleave", ".haveingredients", function(e) { // removing the "x" when the mouse leaves
        $( this ).find( "span" ).last().remove();
    }
  );

$(document).on("click", "#remove-ing", function(e){ // the onclick function to remove the ingredient from the "your ingredients" checklist
    // console.log($(this).closest("li").attr("id"))
    $(this).closest("li").remove() // when the "x" is 
    let checkedingredient = $(this).closest("li").attr("id"); 

    for(let i=0; i<$("li").length; i++){ //loop over each li on the page
        if($($("li")[i]).text() == checkedingredient){ // check to see if the text of that li has the same text as the checked ingredient
            $($("li")[i]).remove() // if it does then we remove it from the list
        }
    }
    localStorage.removeItem(`${checkedingredient}`);
    // let idx = your_ingredients.indexOf(checkedingredient)
    // if(idx !== -1){ // making sure your_ingredients is
    your_ingredients.delete(checkedingredient);
    $("#checkedoff-arr").attr("value",Array.from(your_ingredients))
})


$(document).on("click", "#logoutuser", function(){ // click function to clear local storage when someone signs out
    localStorage.clear()
})

$(document).on("click", "#loginuser", function(){ // click function to clear local storage when someone signs out
    localStorage.clear()
})


// function to save the fave ingredient markings on the page. 
function loadDBfavetoLocalStorage(){
if ($("#logoutuser").length){
    for(let i=0; i<$("ul.choice").length; i++){ //loop over each ul on the page
        for (let j=0; j<$("#user-fave-ul-wrapper").children().length; j++){ // loop over the users favoritrs list
            if($($("ul.choice")[i]).text().trim() == $($("#user-fave-ul-wrapper").children()[j]).text().trim()){ // check to see if the text of that li has the same text as whats in the db for faves
                $($("ul.choice")[i]).find("button#faveiconbtn").addClass("fa-solid fa-bookmark")  // if it does then we remove it from the list
                localStorage.setItem(`fave_${$($("ul.choice")[i]).text().trim()}`, "true")
            }
            else if( $($("ul.choice")[i]).text().trim() !== $($("#user-fave-ul-wrapper").children()[j]).text().trim()){
                $($("ul.choice")[i]).find("button#faveiconbtn").attr("class", "fa-regular fa-bookmark")
            }
        }
    }
}}

// $(document).on("click", 'body', async function(){
//     const response = await axios.get(`${BASE_URL}/userfaves`);
//     $("#user-faves").empty() 
//     console.log(response)
// for (let fave of response.data.user_faves){ // we then loop over each ingredient in that category 
//     const favelist =  `<ul id=${fave.display} class="choice">
//     <input type="checkbox" id=${fave.display} name="ingredients" value=${fave.display}>
//     <label for=${fave.display}>${fave.display}</label>
//     </ul>`
//     $("#user-faves").append(favelist) // and add it to the category section 
//     };  

// })