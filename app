#!/bin/bash

ARG1=$1
ARG2=$2

if [ "$ARG1" == "" ]; then
    echo "Please pass a command";
    echo "Available commands:";
    echo "    - start                      starts the dev server & webpack in dev mode";
    echo "    - start server               starts the dev server";
    echo "    - start webpack              starts webpack in dev mode";
    echo "    - deploy qa | production     does a deploy on qa or production (on qa from 'develop' branch, on production from 'master' branch)";
elif [ "$ARG1" == "start" ]; then
    if [ "$ARG2" == "" ]; then
        echo "Starting server & webpack in development mode...";
        npm start & npm run server
    elif [ "$ARG2" == "server" ]; then
        echo "Starting server in development mode...";
        npm run server;
    elif [ "$ARG2" == "webpack" ]; then
        echo "Starting webpack in development mode...";
        npm start;
    fi;
elif [ "$ARG1" == "deploy" ]; then
    if [ "$ARG2" == "" ]; then
        echo "Please pass an environment where to deploy to";
    elif [ "$ARG2" == "qa" ]; then
        echo "Deploying 'develop' branch to the qa environment..."
        git push heroku develop:master
    elif [ "$ARG2" == "production" ]; then
        echo "Deploying 'master' branch to the production environment..."
        git push production master:master
    else
        echo "Invalid deploy environment '$ARG2'";
    fi;
fi
