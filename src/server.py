from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI()

# Set up CORS
origins = [
    "http://localhost:3000",
    "http://20.198.8.42:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

scope = ["https://spreadsheets.google.com/feeds", 'https://www.googleapis.com/auth/spreadsheets', "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name('service-account.json', scope)
client = gspread.authorize(creds)

sheet_id = "1Zb3l8XoxMBiBUs4Dgi0dDMUQMqUArA7mbt3CCuSRGf4" 
sheet = client.open_by_key(sheet_id).sheet1

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.post("/write/")
async def write(request: Request):
    body = await request.json()

    if not body:
        raise HTTPException(status_code=400, detail="No data provided")
    data = body.get('data')
    if not data:
        raise HTTPException(status_code=400, detail="No data provided")

    try:
        sheet.append_row(data)
        return JSONResponse(content={"message": "Data written successfully"})
    except Exception as e:
        logging.exception("Error occurred while writing data:")
        raise HTTPException(status_code=500, detail=str(e))
