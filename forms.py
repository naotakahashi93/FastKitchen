""" Forms for recipes app"""

from wtforms import StringField, SelectMultipleField, PasswordField, RadioField, HiddenField
from flask_wtf import FlaskForm
from wtforms.validators import InputRequired, Length, Email
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



