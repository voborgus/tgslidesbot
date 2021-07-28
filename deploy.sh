#!/bin/sh
source .env # NOT WORKS CURRENTLY WITH YAML CONFIG
yc serverless function create --name=$BOT_FUNCTION_NAME

if [[ ! -e "build" ]]; then
    mkdir "build"
fi

cp package.json ./build/package.json
cp logic/bot.js ./build/logic/
cp api/uploader.js ./build/api/
cp api/telegram.js ./build/api/
cp utils/constants.js ./build/utils/

yc serverless function version create \
  --function-name=$BOT_FUNCTION_NAME \
  --runtime nodejs14 \
  --entrypoint api/telegram.eventHandler \
  --memory 128m \
  --execution-timeout 10s \
  --source-path ./build/\
  --environment BOT_TOKEN=$BOT_TOKEN
