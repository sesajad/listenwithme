FROM alpine

# youtube-dl
RUN apk add -q --progress --update --no-cache ffmpeg python3 py-pip
RUN pip install --upgrade pip
RUN pip install youtube_dl

# nodejs
RUN apk add -q --progress --update npm

WORKDIR /app/
ADD package.json /app/
ADD package-lock.json /app/
RUN npm i

RUN mkdir songs
ADD public /app/public
ADD src /app/src

ENV PORT=8000
EXPOSE 8000

CMD ["node", "src/index.js"]