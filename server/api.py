from fastapi import fastapi
from database.dbconnect import get_supabase_client
from models.user import User

app = fastapi()
supabase=get_supabase_client()

@app.get("/")
def root():
    return {"this is": "root"}

@app.get("/signin")
def login():
    User user = supabase.auth.sign_in_with_password({ "email": users_email, "password": users_password })
    return {"this is": "login"}



