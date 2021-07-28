# Telegram Conference Slides Uploader

A serverless telegram bot receives slides from the speaker and uploads them to Google Drive.

## Frameworks Used
+ [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)
+ [Telegraf Bot Framework](https://telegraf.js.org/)

## Requirements
+ AWS or Yandex Cloud credentials [configured](https://serverless.com/framework/docs/providers/aws/guide/credentials/).
+ [NodeJS](https://nodejs.org/) 12.x.
+ A [Telegram](https://telegram.org/) account.
+ Google Drive Account.

![Screencast](./docs/conference-bot.gif)

## Limitations

**According to current Telegram Bots limits, the bot can work only with files less than 20mb.**

## Installation

+ Install the Serverless Framework
```
npm install -g serverless
```

+ Install the required plugins
```
npm install
```

+ Create a [Telegram bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot) using [@BotFather](https://telegram.me/BotFather).

+ Add the token received to `.env.yml` file
```
cat .env.yml

TELEGRAM_TOKEN: <your_token>
```

+ Deploy the application.
```
serverless deploy
```

+ Using `setWebhook` URL the configuration, register the webhook on Telegram
```
curl -X POST https://<api_endpoint_url>/prod/setWebhook
```

## Usage
Now you can `/start` a conversation with the bot.

## Removal
+ To delete the project from AWS.
```
serverless remove
```
