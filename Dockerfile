FROM node:18-alpine
WORKDIR /srv/app
COPY package.json yarn.lock ./
COPY . .
RUN yarn install
RUN yarn run compile-ts
EXPOSE 3030
ARG PG_HOST
ENV REDIRECT_URI="https://us-central1-spotify-application-356414.cloudfunctions.net/spotify-api/oauth_callback"
ENV FRONT_END_HOST="https://spotify-frontend-wgvygz45ba-pd.a.run.app"
ENV PG_HOST=$PG_HOST
ENV IS_CLOUD=1
CMD ["node", "dist/index.js"]
