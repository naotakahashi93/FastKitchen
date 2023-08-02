from flask import Flask, render_template, request, jsonify, flash, redirect, session, g
import requests, os
from sqlalchemy.exc import IntegrityError
# from secrets_1 import API_SECRET_KEY
from forms import  MainForm, UserSignUpForm, LoginForm, FaveIngForm
from models import User, db, connect_db, bcrypt , FaveIngredient

import csv

##WHEN RUNNING ON LOCAL HOST CHANGE LOCAL_BASE_URL VARIABLE TO "http://127.0.0.1:5000" and BASE_URL in spoon.js
## also change app.config to app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql:///spoonacular')

API_BASE_URL = "https://api.spoonacular.com/recipes"
# LOCAL_BASE_URL="http://127.0.0.1:5000"

#FOR DEPLOY
LOCAL_BASE_URL="https://fastkitchen.onrender.com"

# key = API_SECRET_KEY
key = "69f498b1c49c4a9eb755213760a3397e"

app = Flask(__name__)

##FOR DEPLOY
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://irlbkgra:Jv5vq76bEaO3E_mbGc48lUXr7XH7Odco@bubble.db.elephantsql.com/irlbkgra'


# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
#     'DATABASE_URL', 'postgresql:///spoonacular').replace("://", "ql://", 1)

##FOR LOCAL 
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql:///spoonacular')


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'shhh')


with app.app_context():
    connect_db(app)
    db.create_all()

app.app_context().push()


checkedoff_ing= []

def recipe(term):
    """function to call to get the list of recipes using the ingredients the user has checked off """
    res = requests.get(f"{API_BASE_URL}/findByIngredients",
                       params={'apiKey': key, 'ingredients': term, 'ranking': 2}) 
    data = res.json() ## the results in json form stored in variable "data"
    # results = data["results"]
    print (data) ## printing the id and title of the first recipe ([0]) in the data list 
    #     ## results has keys of "id", "title", "image" and "imageType"
    return data

def recipeinstructions(id):
    """function to call to get the recipe instructions"""
    res = requests.get(f"{API_BASE_URL}/{id}/analyzedInstructions",
                       params={'apiKey': key, 'id': id}) 
    data = res.json()
    print(data)
    return data


def serialize(form):
    """ function to erialize a SQLAlchemy Cupcake obj to python dictionary to make it JSON compatible"""
    for field in form:
        return {
        "title": field.label.text,
        "hidden": form.hidden_tag(),
        "errors": field.errors
    }
    
def serializeFave(SQLfave):
    """ function to serialize a SQLAlchemy fave obj to python dictionary to make it JSON compatible"""
    return {
        "id": SQLfave.id,
        "user_id": SQLfave.user_id,
        "ingredient" : SQLfave.ingredient,
        "display": SQLfave.display,
    }

@app.before_request ### this is a decorator that allows us to execute this function before any request
def add_user_to_g():
    """If user is logged in, add curr user to Flask global (g)."""

    if "current_user" in session: ## if there is a user in the session (aka they are logged in)
        g.user = User.query.get(session["current_user"]) ## we are assigning .user to the "g" global variable

    else:
        g.user = None


def login(user):
    """function to login a user aka add to the session"""
    session["current_user"] = user.id

def logout():
    """function to logout a user aka remove from the session"""
    if "current_user" in session:
        del session["current_user"]


@app.route("/signup", methods=["GET", "POST"])
def signup():
    """the route for signing up a user to the db """
    form = UserSignUpForm()
    form.prof_photo.choices = ("fa-solid fa-carrot", "fa-solid fa-egg", "fa-solid fa-lemon", "fa-solid fa-fish", "fa-solid fa-bowl-food") ##FIX
    if "current_user" in session:
        user = User.query.filter_by(id=session["current_user"]).first()
        flash('You are alreayd logged in!', "primary")
        return redirect(f"/users/{user.id}")

    if form.validate_on_submit(): ## if the form is a post request and we are able to validate it we are creating the new user
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
                email=form.email.data,
                prof_photo=form.prof_photo.data, 
            )
            db.session.commit()
        except IntegrityError: ## error handling if the username is taken
            flash("Username already taken", 'danger')
            return render_template('users/signup.html', form=form)
        
        login(user) ## calling the fucntion to login the user upon registration by saving their id into the session
        return redirect("/") 

    else:
        return render_template('users/signup.html', form=form)

@app.route('/login', methods=["GET", "POST"])
def login_user():
    """Handle user login."""

    form = LoginForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data,
                                 form.password.data)

        if user:
            login(user)
            flash(f"Hello, {user.username}!", "success")
            return redirect("/ingredients")

        flash("Invalid credentials.", 'danger')

    return render_template('users/login.html', form=form)


@app.route('/logout')
def logout_user():
    """Handle logout of user."""
    logout()
    return redirect("/")



# @app.route('/getfave')
# def getfave():
#     """route that handles each fave ing so we can grab it in the post req"""
#     fave_ing = request.form.get("each-fave-ings")
#     print("$FAVEINGGGG$$$$$", fave_ing)
#     return jsonify(fave_ing=fave_ing)

@app.route('/addfave/<ing_id>', methods= ["POST"])
def addfave(ing_id):
    """a route that the API calls (on click of the fave btn)that adds each ing to the db 
"""
    if "current_user" not in session:
        flash("Please login/register first!", "danger")
        return redirect('/')
    # res = requests.get(f"{LOCAL_BASE_URL}/getfave") 
    
    user = g.user
    # fave_ing = request.form.get("each-fave-ings")
    display_ing = ing_id.replace("fave_", "")
    print("DISPLAYYYY", display_ing)
    if user.id == session["current_user"]:
        # fave_ing
        # interable_fave_ing_list = fave_string.split(",")
        # for ing in interable_fave_ing_list:
        # form = FaveIngForm(fave_ing=fave_ing)
        new_ing = FaveIngredient(user_id=user.id, ingredient=ing_id, display=display_ing)
        db.session.add(new_ing)
        db.session.commit()
        return redirect('/')
 
@app.route('/removefave/<ing_id>', methods= ["POST"])
def removefave(ing_id):
    """a route that the API calls (on click of the fave btn)that removes each ing to the db 
"""
    if "current_user" not in session:
        flash("Please login/register first!", "danger")
        return redirect('/')
    # res = requests.get(f"{LOCAL_BASE_URL}/getfave") 
    
    user = g.user
    remove_fave_ing = FaveIngredient.query.filter_by(ingredient=ing_id).first()
    
  
    if user.id == session["current_user"]:
        db.session.delete(remove_fave_ing)
        db.session.commit()
        return redirect('/')


@app.route('/users/<userid>')
def profilepage(userid):

    if "current_user" not in session:
        flash("Please login/register first!", "danger")
        return redirect('/')

    user = User.query.get(userid)

    if user.id == session["current_user"]:
        fave_ings = request.args.getlist("user-fave-ings")
        # print("000000000000000", fave_ings )
        # FaveIngredient(user_id=user.id)
        return render_template("users/profilepage.html", user=user)

@app.route("/")
def home():
    if g.user:
        return redirect("/ingredients")

    return render_template("home.html")

@app.route("/ingredients",  methods=["GET", "POST"])
def ingredients_main():

    if g.user:
        user_faves =  FaveIngredient.query.filter_by(user_id=g.user.id)
        return render_template("checklist.html", user_faves = user_faves)
    return render_template("checklist.html")

@app.route("/userfaves")
def user_fave_display():
    """display the user favorites"""

    if g.user:
        user_faves =  FaveIngredient.query.filter_by(user_id=g.user.id)
        serialized_faves = [serializeFave(f) for f in user_faves]
        return jsonify(user_faves = serialized_faves)
    
    else:
        flash("Please login/register first!", "danger")
        return redirect("/ingredients")
    
    
    
@app.route("/ingredients/<category>", methods=["GET"])
def checkoff_ingredients(category):
    form = MainForm()

    with open(f"generator/{category}.csv") as file:
        contents = csv.reader(file, delimiter=';')
        for row in contents:
            form.ingredients.choices.append(row[0])
    
    serialized_form= serialize(form)
    return jsonify(ingredients=form.ingredients.choices, form = serialized_form)
    

@app.route("/recipes", methods=[ "GET"]) 
def get_recipes():
    """route that handles the form with ingredients and gets the recipes from the spoonacular API using our "recipes()" function"""
    checked = request.args.getlist("checkedoff") ## checked needs to be a list
    # ingredients_string = checked[0]
    # term_list = ingredients_string.split(", ")
    result = recipe(checked)
    return jsonify(checkedoff_ing=checked, result =result)

    
@app.route("/recipehtml")
def show_page():
    """route that is shown with the results from the spoonacular API"""
    res = requests.get(f"{LOCAL_BASE_URL}/recipes") 
    checked = request.args.getlist("checkedoff")
    result = recipe(checked)
    if bool(result) == False:
        flash('Sorry, something weng wrong :( Please try again with different ingredients', 'danger')
        return redirect("/ingredients")
    print(result[0]["title"])
    return render_template("recipes.html", result=result)


@app.route("/recipeinstruction/<recipeid>")
def recipeinstruct(recipeid):
    result = recipeinstructions(recipeid)
    return render_template("recipeinstruction.html", result=result)


@app.route("/itemsearch/<item>")
def search_items(item):
    """route that is used to search ingredinets in the searchbar for ingredients that are not on the checklist"""
    res = requests.get("https://api.spoonacular.com/food/ingredients/search",
                       params={'apiKey': key, 'query': item}) 
    result = res.json()
    return jsonify(result=result)



