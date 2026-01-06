FROM python:3.13-bookworm
WORKDIR /app
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir yt-dlp
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p downloads/audio
EXPOSE 5000
CMD ["python", "app.py"]
