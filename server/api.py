from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from database.dbconnect import get_supabase_client
from models.user import User
from postgrest.exceptions import APIError
import bcrypt


app = FastAPI()
supabase=get_supabase_client()

@app.get("/")
async def root():
    return 'ok'

@app.post("/auth/signup")
async def signup(user: User):

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(user.password.encode('utf-8'), salt).decode('utf-8')
    
    try:
        response = supabase.table('Users').insert({
            "username": user.username,
            "email": user.email,
            "password_hash": hashed
        }).execute()

        return JSONResponse(
                status_code=status.HTTP_201_CREATED,
                content={"success": "true", "message": "User created successfully", "data": response.data}
            )
    
    except APIError as e:
        error_message = eval(e.args[0])
        error_code = error_message.get('code')
        if error_code == '23505':
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content={"success": "false","message": "Username or Email already exists"}
            )
        else:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"success": "false" , "message": "Internal Server Error"}
            )

        


@app.get("/auth/signin")
async def signup(username: str, password: str):
        
            response = supabase.table('Users').select('*').eq('username', username).execute()


            if response.data == []:
                return JSONResponse(
                    status_code=status.HTTP_404_NOT_FOUND,
                    content={"success": "false", "message": "User not found"}
                )
            
            password_hash = response.data[0]['password_hash']

            if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={"success": "true", "message": "User signed in successfully",  "user_id": response.data[0]['userid']}
                )
            else:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"success": "false" , "message": "Invalid Password"}
                )
        
        
        
    
    