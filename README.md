# marcuslindblom.com

## Install Strife

`dotnet add marcuslindblom.com.nosync.csproj package strife --version 0.0.1-6d3bc7a`

`builder.Services.AddStrife();`

`app.MapStrife();`

`openssl base64 -in marcuslindblom.com.pfx -out data.txt`

`cat data.txt | tr -d '\n' | pbcopy`

## Environment variables

### Add base64 single line certificate raw data

`DocumentStoreSettings__Certificate`

### The name of the database

`DocumentStoreSettings__Database`

### he password for the database

`DocumentStoreSettings__Password`

### The url to the database cluster, can be multiple

`DocumentStoreSettings__Urls__0`

### Auth token for private nuget feed

`NUGET_AUTH_TOKEN`

## Deploy button

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/marcuslindblom/marcuslindblom.com)
