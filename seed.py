from models import db
from app import app
from secrets_1 import API_SECRET_KEY

db.drop_all()
db.create_all()