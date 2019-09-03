# PatternBased

## Quick technical overview

The server of the app runs on node (min v10). In dev mode [nodemon](https://www.npmjs.com/package/nodemon) is used to start the server and watch over file changes.

The client side uses webpack to create the javascript bundle.

## Setup

### Step 0

Before everything, make sure you're running on node >=v10 (run `node -v` to check your version). If needed use a tool like `nvm` to install or switch to a different node version.

After checking this run `npm install` to install all the dependencies.

### Step 1

Create a new file in the root of the project called `.env` and copy the contents of `.env.sample` in it (just run `cat .env.sample > .env` to do this).

Open your newly created file and update the vars needed (e.g. `AUTH` which is the login password).

### Step 2

Install a [Prettier](https://prettier.io/) extension for your editor / IDE and enable "Format on Save". This is different based on the editor you're using. In VS Code, for example, this setting can be made per project, so it doesn't interfere with other projects.

## Running the app

Running the app requires 2 commands:

- `npm start` to start webpack in development mode (with watch)

- `npm run server` to start the development server
