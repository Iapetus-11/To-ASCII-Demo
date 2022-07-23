from fastapi import FastAPI, UploadFile
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, Query
from toascii import gradients

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
async def asciify(file: UploadFile, saturation: float = Query(..., ge=-1, le=1), contrast: float = Query(..., ge=0, le=1)) -> str:
    if contrast == 0:
        contrast = None

    options = ConverterOptions(gradient=gradients.LOW, height=32, x_stretch=2.75, saturation=saturation, contrast=contrast)
    data = file.file.read()
    
    converter = HtmlColorConverterNim(options)
    image = Image(data, converter)

    try:
        return image.to_ascii()
    except ValueError:
        raise HTTPException(status_code=400, detail="invalid/unsupported image uploaded")
