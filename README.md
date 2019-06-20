# telegram-scorebot
Ein Telegram-Bot, der Punkte zählt.

# Running manually
1. Run `npm install`
2. Set environment variable `BOT_TOKEN`
3. Run `node app`

## Docker
### Building
`docker build -t telegram-scorebot .`

### docker-compose
1. Edit docker-compose.yml and add Telegram bot token
2. `docker-compose build`
3. `docker-compose run -d`
