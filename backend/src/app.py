from io import BytesIO

from fastapi import FastAPI, HTTPException, Query, UploadFile, status
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image as PillowImage
from toascii import ConverterOptions, HtmlColorConverter
from toascii import Image as AsciiImage

from config import load_config

MAX_UPLOAD_BYTES = 20 * 1024 * 1024
MAX_IMAGE_PIXELS = 20_000_000
PillowImage.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS

CONFIG = load_config()

app = FastAPI(
    title="to-ascii-demo",
    version="1.0.0",
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=CONFIG.CORS_ORIGINS,
            allow_credentials=False,
            allow_methods=["POST", "OPTIONS"],
            allow_headers=["Content-Type"],
        )
    ],
)


def validate_image(data: bytes) -> None:
    try:
        with PillowImage.open(BytesIO(data)) as image:
            width, height = image.size
            if width < 1 or height < 1 or width * height > MAX_IMAGE_PIXELS:
                raise HTTPException(
                    status_code=status.HTTP_413_CONTENT_TOO_LARGE,
                    detail="image dimensions are too large",
                )
            image.verify()
    except (OSError, PillowImage.DecompressionBombError) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invalid/unsupported image uploaded",
        ) from exc


@app.post("/asciify")
async def asciify(
    file: UploadFile,
    saturation: float = Query(..., ge=-1, le=1),
    contrast: float = Query(..., ge=0, le=1),
    gradient: str = Query(..., min_length=1, max_length=100),
) -> str:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="an image upload is required",
        )

    try:
        data = await file.read(MAX_UPLOAD_BYTES + 1)
    finally:
        await file.close()

    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail="image must be no larger than 20 MiB",
        )

    validate_image(data)

    options = ConverterOptions(
        gradient=gradient,
        height=32,
        x_stretch=2.75,
        saturation=saturation,
        contrast=None if contrast == 0 else contrast,
    )
    image = AsciiImage(data, HtmlColorConverter(options))

    try:
        return image.to_ascii()
    except (ValueError, TypeError) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invalid/unsupported image uploaded",
        ) from exc
