#!/bin/sh
syncthing -generate=/var/syncthing/config

apk add xmlstarlet

xmlstarlet edit -L \
  -u '/configuration/folder[@id="default"]/@label' -v "${SYNCTHING_DIRECTORY}" \
  -u '/configuration/folder[@id="default"]/@path' -v "/var/syncthing/${SYNCTHING_DIRECTORY}" \
  /var/syncthing/config/config.xml

exec syncthing 
