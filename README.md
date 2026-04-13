# Yanalabs

## Project Description
Yanalabs is a static site generator project built with the Eleventy framework. It provides a robust and flexible architecture for building fast, modern websites with minimal setup.

## Tech Stack
- **Eleventy**: A simpler static site generator that converts templates into HTML.
- **Nunjucks**: A powerful templating engine to build and manage views.
- **Luxon**: A library for managing dates and times, useful for formatting and displaying dates in various formats.

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/YanaPalyvoda/yanalabs.git
   cd yanalabs
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

## npm Scripts
- `npm start`: Start the Eleventy server for development.
- `npm build`: Build the static site for production.
- `npm test`: Run tests (if applicable).

## Project Structure
```
├── .eleventy.js            # Eleventy configuration file
├── src                    # Source files
│   ├── _data             # Data files (JSON/YAML)
│   ├── _includes         # Nunjucks templates
│   ├── index.md          # Main content file
│   └── ...               # Other content files
├── package.json           # npm configuration file
└── netlify.toml          # Netlify configuration file
```
