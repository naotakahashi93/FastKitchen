""" Forms for recipes app"""

from wtforms import SelectField, StringField, SelectMultipleField, PasswordField, RadioField, HiddenField
from flask_wtf import FlaskForm
from wtforms.validators import InputRequired, Length, Email, email_validator
class MainForm(FlaskForm):
    """Checklist for ingredients user has in their fridge"""
    ingredients = SelectMultipleField(choices=[])
    ing_ids = SelectMultipleField(choices=[])


class UserSignUpForm(FlaskForm):
    """Form for adding users."""

    username = StringField('Username', validators=[InputRequired()])
    email = StringField('E-mail', validators=[InputRequired(), Email()])
    password = PasswordField('Password', validators=[Length(min=6)])
    prof_photo = RadioField("Select a profile image!", choices=[])


class LoginForm(FlaskForm):
    """Login form."""

    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])

class FaveIngForm(FlaskForm):
    fave_ing = HiddenField()





# class CheeseForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Cheese", choices=[])

# class CommonForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Common Condiments", choices=[])

# class DairyForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Dairy/Milks/Milk Alternatives", choices=[])

# class FlourForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Flour/Grain/Breads", choices=[])

# class FreshHerbsForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Fresh Herbs", choices=[])

# class FruitsNutsForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Fruits", choices=[])

# class HerbsForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Herbs", choices=[])

# class MeatFishForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Meat/Fish/Other Protein", choices=[])


# class OilsForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Oil/Vinegar/Alcohol", choices=[])

# class SaucesForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Sauces", choices=[])

# class SweetForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Sweet Condiments/Baking Items", choices=[])

# class VegtablesForm(FlaskForm):
#     """Checklist for ingredients user has in their fridge"""
#     ingredients = SelectMultipleField("Vegtables", choices=[])



