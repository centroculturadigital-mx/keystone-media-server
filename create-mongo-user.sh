#!/bin/sh

export $(cat .env | xargs)  

docker exec -it mongo mongo media-server --authenticationDatabase "admin" -u "$MONGO_ROOT_USR" -p "$MONGO_ROOT_PWD" --eval "db.createUser({user:'$MONGO_USR',pwd:'$MONGO_PWD',roles:[{role:'dbOwner',db:'media-server'}]})"
