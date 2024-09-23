from fastapi import FastAPI, HTTPException, status, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta, timezone
from database.dbconnect import get_supabase_client
from models.user import User
from postgrest.exceptions import APIError
import bcrypt
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

app = FastAPI()
supabase=get_supabase_client()
load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "http://localhost:3000", 
    "http://localhost:8000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return 'ok'

@app.post("/signup")
async def signup(user: User):

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(user.password.encode('utf-8'), salt).decode('utf-8')
    
    try:
        response =  supabase.table('Users').insert({
            "username": user.username,
            "email": user.email,
            "password_hash": hashed
        }).execute()

        return JSONResponse(
                status_code=status.HTTP_201_CREATED,
                content={
                    "success": "true",
                    "message": "User created successfully"
            })
    
    except APIError as e:
        error_message = eval(e.args[0])
        error_code = error_message.get('code')
        if error_code == '23505':
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content={
                    "success": "false",
                    "message": "Username or Email already exists"
            })
        else:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "success": "false" , 
                    "message": "Internal Server Error"
            })

      

'''
@app.post("/auth/signin")
async def signup(signin_request: SignInRequest):
        
        username = signin_request.username
        password = signin_request.password
        
        try:
            response =  supabase.table('Users').select('*').eq('username', username).execute()


            if response.data == []:
                return JSONResponse(
                    status_code=status.HTTP_404_NOT_FOUND,
                    content={
                        "success": "false",
                        "message": "User not found"
                })
            
            password_hash = response.data[0]['password_hash']

            if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={
                        "success": "true",
                        "message": "User signed in successfully",
                        "user_id": response.data[0]['userid']
                })
            else:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={
                        "success": "false",
                        "message": "Invalid Password"
                })
        except APIError as e:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "success": "false" , 
                    "message": "Internal Server Error"
            })

'''
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.environ.get("JWT_SECRET"), algorithm=os.environ.get("ALGORITHM"))
    return encoded_jwt 

ACCESS_TOKEN_EXPIRE_MINUTES=30

@app.post("/signin")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    username=form_data.username 
    password=form_data.password

    
    try:
            response =  supabase.table('Users').select('*').eq('username', username).execute()


            if response.data == []:
                return JSONResponse(
                    status_code=status.HTTP_404_NOT_FOUND,
                    content={
                        "success": "false",
                        "message": "User not found"
                })
            
            password_hash = response.data[0]['password_hash']

            if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
                access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
                access_token = create_access_token(
                data={"userid": response.data[0]['userid']}, expires_delta=access_token_expires
                )
                 
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={
                        "success": "true",
                        "message": "User signed in successfully",
                        "access_token": access_token,
                        "token_type": "bearer",
                        "username": username
                })
            else:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={
                        "success": "false",
                        "message": "Invalid Password"
                })
    except APIError as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": "false" , 
                "message": "Internal Server Error"
        })
    
@app.post("/verify-token")
async def verify_token(request: Request):
    try:
        body = await request.json()
        token = body.get("token")
        
        payload = jwt.decode(token, os.environ.get("JWT_SECRET"), algorithms=[os.environ.get("ALGORITHM")])
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": "true",
                "message": "Token is valid",
                "data": payload
        })
    except JWTError:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "success": "false",
                "message": "Invalid Token"
        })
    

    
        
    
    