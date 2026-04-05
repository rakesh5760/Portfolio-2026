from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import smtplib
from email.message import EmailMessage

app = FastAPI()

# Allow frontend (Live Server port 5500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
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
       
        sender_email = "gonerakesh8186@gmail.com"
        sender_password = "kzhm jyaa vkdk ftjs"

        # Create Email
        msg = EmailMessage()
        msg["Subject"] = "New Portfolio Contact Message"
        msg["From"] = sender_email
        msg["To"] = sender_email

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
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)

        return {"success": True}

    except Exception as e:
        print("ERROR:", e)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )
