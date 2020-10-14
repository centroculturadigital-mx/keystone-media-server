# https://docs.docker.com/samples/library/node/
ARG NODE_VERSION=12
# https://github.com/Yelp/dumb-init/releases
ARG DUMB_INIT_VERSION=1.2.2


# Build container
FROM node:${NODE_VERSION}-alpine AS build
ARG DUMB_INIT_VERSION

RUN echo "dockerfile"

ARG PORT
ENV PORT $PORT
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ARG MONGO_ROOT_USR
ENV MONGO_ROOT_USR $MONGO_ROOT_USR
ARG MONGO_ROOT_PWD
ENV MONGO_ROOT_PWD $MONGO_ROOT_PWD
ARG MONGO_HOST
ENV MONGO_HOST $MONGO_HOST
ARG MONGO_PORT
ENV MONGO_PORT $MONGO_PORT
ARG MONGO_DB
ENV MONGO_DB $MONGO_DB
ARG BUILD_STAGE
ENV BUILD_STAGE $BUILD_STAGE
ARG FRONTEND_URL
ENV FRONTEND_URL $FRONTEND_URL

WORKDIR /hipermedial-backend

RUN apk add --no-cache build-base python2 yarn && \
    wget -O dumb-init -q https://github.com/Yelp/dumb-init/releases/download/v${DUMB_INIT_VERSION}/dumb-init_${DUMB_INIT_VERSION}_amd64 && \
    chmod +x dumb-init
ADD . /hipermedial-backend
RUN yarn install && yarn build && yarn cache clean

# Runtime container
FROM node:${NODE_VERSION}-alpine

WORKDIR /hipermedial-backend


COPY --from=build /hipermedial-backend /hipermedial-backend

CMD ["./dumb-init", "yarn", "start"]
