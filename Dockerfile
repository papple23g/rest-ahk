FROM ubuntu:jammy

RUN groupadd --gid 1000 node && \
    useradd --uid 1000 --gid node --shell /bin/bash --create-home node

RUN dpkg --add-architecture i386 && \
    apt-get update && \
    apt-get install --no-install-recommends --assume-yes \
        wine-stable \
        wine32 \
        wget \
        unzip \
        xvfb \
        nodejs \
        npm \
    && rm -rf /var/lib/apt/lists/*

RUN su - node -c "xvfb-run -a wineboot --init"

RUN wget --no-check-certificate https://autohotkey.com/download/1.1/Ahk2Exe112401.zip -O /tmp/temp.zip && \
    mkdir -p ~node/.wine/drive_c/windows && \
    unzip /tmp/temp.zip -d ~node/.wine/drive_c/windows && \
    rm -f /tmp/temp.zip && \
    chown -R node:node ~node/

COPY . .

RUN npm install
RUN npm run build
# 暫時跳過 npm prune
# RUN npm prune

USER node

ENV PORT=8080
EXPOSE $PORT

CMD [ "npm", "run", "prod" ]
