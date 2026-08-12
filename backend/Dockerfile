# use Nodejs Image
FROM node:20-alpine

# set working directory
WORKDIR /app

# copy package file
COPY package*.json ./

# install dependencies
RUN npm install

# copy application code 
COPY . .

# Expose Port
EXPOSE 5000

# START THE APPLICATION
CMD [ "npm","run","dev" ]