Title: FastKitchen 
Heroku URL: (https://fastkitchen.herokuapp.com/)

Introduction

FastKitchen is a website targeted for busy individuals and aims to make homemade cooking easy, straightforward and hassle free. 
This app is ideal for anyone who has a busy daily life and struggles with recipe ideas using the ingredients they have on hand. 


User Flow

The landing page of the website gives users an option to sign up, login or continue using the website as a guest. 
In the main page a user is given an ingredients checklist where they can select the ingredients they have in their kitchen by category or they can search their ingredient in the search bar.
By checking off the ingredients they have, each will be added to their "your ingredients" list to the right. 
Once they have checked off all the ingredients they have, they can click "get recipes" which generates a list of recipes they can make with the ingredients on their list. 
Each recipe can be clicked on and will direct to another page with the instructions on how to make that recipe.

There is also an option to sign up/login which gives users access to favorite certain ingredients of their choice. Typically this would be used for the ingredients they have all the time. 
Their favorite ingredients will be stored into a database and they will have easy access to view them on the mainpage under the "Your Favorited Ingredients" button. 
They can easily add their favorited ingredients to their checklist to generate recipes. 

Upon logout and login the "your ingredients" list will be cleared.


Technology

Front End: Javascript, jQuery, HTML, CSS
Back End: Python, Flask, Jinja, SQL, SQLAlchemy, WTForms
API: (https://spoonacular.com/food-api)

FastKitchen is a full stack application mostly using Javascript and Python, it uses an external API to pull information and also includes a database for user login/authentication.
The sign up/login form is created using WTForms and the data is added to a database and authenticated using Bcrypt hashing. 

Ingredients Checklist page:
Each category button is used with an internal API call to generate the list of hardcoded ingredients which are stored as a csv. 
Checked off Ingredients are stored as hidden elements in the html and the values are used to make an external API call too the spoonacular API to generate the recipes. 
The ingredient search feature is also an external API call to the spoonacular API. 

If user is logged in:
When there is a user logged in the page slighly changes, each ingredient has a bookmark icon next to the checkbox which can be added as a favorite ingredient.
By clicking on the bookmark icon, the icon will turn solid signifying that the ingredient has been favorited and is also saved to the database. Clicking it again will remove it from the database. 
Additionally there is another button called that appears called the "Your Favorited Ingredients" which takes the data from the database to display the ingredients that have been favorited by that user. 
