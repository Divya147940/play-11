#!/bin/sh

git filter-branch -f --env-filter '
CORRECT_NAME="Divya147940"
CORRECT_EMAIL="Divyanshiverma484@gmail.com"

if [ "$GIT_AUTHOR_NAME" = "datapediatechnical-sys" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi

if [ "$GIT_COMMITTER_NAME" = "datapediatechnical-sys" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
