from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SENDER_EMAIL = os.getenv("EMAIL")
SENDER_PASSWORD = os.getenv("APP_PASSWORD")

app = FastAPI()

# Allow frontend (Live Server port 5500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://rakeshgone.netlify.app",
        "https://rakeshgone.netlify.app/",
        "https://rakeshgone.netlify.app/#contact"
        
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend is running successfully"}


@app.post("/contact")
async def send_contact(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(None),
    message: str = Form(...)
):
    try:
        if not SENDER_EMAIL or not SENDER_PASSWORD:
            return JSONResponse(
                status_code=500,
                content={"success": False, "error": "Internal server configuration error."}
            )

        # Create Email
        msg = EmailMessage()
        msg["Subject"] = "New Portfolio Contact Message"
        msg["From"] = SENDER_EMAIL
        msg["To"] = SENDER_EMAIL

        msg.set_content(f"""
New Message From Portfolio:

Name: {name}
Email: {email}
Phone: {phone}

Message:
{message}
        """)

        # 🔌 SMTP Connection
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(SENDER_EMAIL, SENDER_PASSWORD)
            smtp.send_message(msg)

        return {"success": True}

    except Exception as e:
        print("ERROR:", e)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )
