# Fortinet IPS/App Control Utilities

## Features

1. Signature Editor: Allow users to preview and edit the signature in a more friendly way.
2. Config Parser: Parsing the Fortinet products configuration in a friendly user interface.
3. Logs Preview: Parsing Fortinet logs to tablular view and support the full-text search.

## Screenshots
Parsing the signature in a more friendly way.
![sig-edit.png](pictures/sig-edit.png)
The property editor allows the user to edit the signature.
![sig-02.png](pictures/sig-02.png)
Config parser parses product configurations into an easy readable interface.
![config-01.png](pictures/config-01.png)
If the config contains the custom signature, the config parser will give the user a hint. 
![config-01.png](pictures/config-02.png)
Log parser parses the product logs into a tabular view.
![logs-01.png](pictures/logs-01.png)
Support the full-text and properties filter to view the logs. 
![logs-02.png](pictures/logs-02.png)

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Because this project contains the Nuxt Pro UI package, make sure you have the license key before making our project into production.

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

