from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

scope = ["https://spreadsheets.google.com/feeds", 'https://www.googleapis.com/auth/spreadsheets', "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name('service-account.json', scope)
client = gspread.authorize(creds)

sheet_id = "1RsNo9kRfx3euG6JdjwxMlz25WsIKxhSjHjhHw1Zns68" #change this

sheet = client.open_by_key(sheet_id).sheet1 


@app.post("/write/")
async def write(request: Request):
    body = await request.json()

    if not body:
        raise HTTPException(status_code=400, detail="no data")
    data = body.get('data')
    if not data:
        raise HTTPException(status_code=400, detail="no data")

    try:
        sheet.append_row(data)
        return JSONResponse(content={"message": "done"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

