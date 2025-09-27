# SSL Frontend

A React app (Create React App + Tailwind) that:
- Shows dataset stats from the backend (`GET /stats`)
- Lets you search rooms using free text (`POST /rooms/search`)
- Uses a CRA proxy to the backend at `http://127.0.0.1:8000` to avoid CORS in development

## Quick start

1. Install dependencies:
    ```bash
    npm install
    ```
2. Start the dev server on port 3000:
    ```bash
    npm start
    ```
    The CRA proxy is configured in `package.json` ("proxy": "http://127.0.0.1:8000"). Ensure your backend runs at that address.

## Scripts

- `npm start` — runs the app at http://localhost:3000
- `npm run start:quiet` — same as start but suppresses Node deprecation warnings
- `npm run build` — production build
- `npm test` — run tests

## Features

- Dataset Stats panel (totals, rent percentiles, city breakdowns)
- Search Rooms (free text) with Enter-to-search
- Displays applied filters and top results with score, rent, amenities

## Backend endpoints (dev)

- `GET /stats`
- `POST /rooms/search` with body:
   ```json
   { "raw_text": "Need room in Lahore G-11, budget 20k" }
   ```
   Response includes `rooms` and optional `applied_filters`.

## Troubleshooting

- Deprecation warnings (util._extend): run `npm run start:quiet` to suppress during dev, or run with `NODE_OPTIONS="--trace-deprecation"` to locate the dependency.
- Tailwind @tailwind warnings in IDE: harmless in CRA; PostCSS processes them at build/dev time.
- Port already in use: set a different port via `PORT=3001 npm start`.

## Create React App Reference

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
