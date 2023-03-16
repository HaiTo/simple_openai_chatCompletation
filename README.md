# how to run in local
```
npm run build && OPENAI_API_KEY=__YOUR_TOKEN__ AUTH_USERNAME=__SPECIFIED_USER_NAME__ AUTH_PASSWORD=__SPECIFIED_PASSWORD__ node app.js
```

# how to run with docker
```
docker build chatComplete:latest
docker run -e open_api_key=__YOUR_TOKEN__ -e auth_username=__SPECIFIED_USER_NAME -e AUTH_PASSWORD=__SPECIFIED_PASSWORD__ chatComplete:latest
```
