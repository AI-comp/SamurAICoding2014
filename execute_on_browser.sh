#!/bin/sh

(sleep 10s; open "http://localhost:8000/") &
node_modules/grunt-cli/bin/grunt dev
