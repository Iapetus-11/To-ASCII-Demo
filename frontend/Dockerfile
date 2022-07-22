FROM node:alpine

# # install next
# RUN npm install next -g

# install dependencies
ADD package.json .
ADD yarn.lock .
RUN yarn install --non-interactive --frozen-lockfile

# build
WORKDIR /frontend
ADD . /frontend
RUN ../node_modules/.bin/next build


CMD ["../node_modules/.bin/next", "start"]
