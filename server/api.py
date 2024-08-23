from fastapi import FastAPI, HTTPException, status
from database.dbconnect import get_supabase_client
from models.user import User
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

        print(response)

        if len(response.data) > 0:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="User not created")

        return response.data
    
        
    
    except Exception as exception:
         return exception

        


@app.get("/auth/signin")
async def signup(username: str, password: str):
    try:
        response = supabase.table('Users').select().eq('username', username).execute()

        if response.status_code == 200:
            if len(response.data) == 0:
                raise HTTPException(status_code=404, detail="User not found")
            user = response.data[0]
            if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                return {"message": "User signed in successfully", "user_id": user['id']}
            else:
                raise HTTPException(status_code=401, detail="Invalid password")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=response.json())
        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    