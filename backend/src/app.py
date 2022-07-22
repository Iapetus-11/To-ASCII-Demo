from fastapi import Body, FastAPI, Request, UploadFile
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from toascii import gradients
import traceback

from toascii import ConverterOptions, HtmlColorConverterNim, Image

from config import load_config

CONFIG = load_config()

app = FastAPI(
    title="to-ascii-demo",
    version="1.0.0",
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=CONFIG.CORS_ORIGINS,
            allow_credentials=True,
            allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allow_headers=["*", "Authorization"],
            expose_headers=["*", "Authorization"],
        )
    ],
)

@app.post("/asciify")
async def asciify(file: UploadFile) -> str:
    options = ConverterOptions(gradient=gradients.LOW, height=32, x_stretch=2.75)
    data = file.file.read()
    
    converter = HtmlColorConverterNim(options)
    image = Image(data, converter)

    return image.to_ascii()
