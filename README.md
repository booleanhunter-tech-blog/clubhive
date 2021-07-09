![](https://www.ashwinhariharan.tech/blog/how-to-build-your-own-social-audio-chat-application/index.png)
## Clubhive

> A free, open-source, proof-of-concept social audio app, similar to Clubhouse & Twitter Spaces.

**This repository contains the complete source-code for the blog post:**
[How to build your own Social Audio chat application](https://www.ashwinhariharan.tech/blog/how-to-build-your-own-social-audio-chat-application/)

Fork this repository, read the blog post and follow the tutorial to build the app!

### Requirements

- A laptop or a desktop computer
- Chrome browser
- Internet connectivity

### App Screenshots

#### On phone
![Screenshot on a phone](/public/images/clubhive-mobile.png)

#### On desktop
![Screenshot on a desktop browser](/public/images/clubhive-web.png)

### Instructions to install

1. **Install PostgreSQL**
    I highly recommend a Docker installation:
    - Install [Docker](https://docs.docker.com/get-docker/)
    - Download and run the official [PosgreSQL/PostGIS docker image](https://registry.hub.docker.com/r/postgis/postgis/)

    Alternatively, you can perform an installation directly on the host operating system:
    - [Download](https://www.postgresql.org/download/) the official PostgreSQL installer for your system.

2. **Start PostgreSQL database service**
    If you're using a docker installation, run `docker run --name clubhouse-postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgis/postgis`.
3. Install [Node.js](https://nodejs.org/).
4. Clone or fork this repo.
5. Run `npm install` in your project root.
6. Run `npm start` to start the app server.

#### To execute psql commands
1. SSH into your Postgres docker container: `docker exec --user postgres -it clubhouse-postgres /bin/bash` (Skip this step if you have a native PostgreSQL installation).
2. Run `psql` on the terminal.