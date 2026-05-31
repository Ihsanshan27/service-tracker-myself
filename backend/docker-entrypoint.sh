#!/bin/sh
set -e

npx prisma db push
npx prisma db seed
node dist/main.js
