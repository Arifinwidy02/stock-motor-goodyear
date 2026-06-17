#!/bin/sh
set -e

npx sequelize-cli db:migrate

exec node app.js
