FROM node:14

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app source
COPY . .

# Expose the port on which the app will run
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]
