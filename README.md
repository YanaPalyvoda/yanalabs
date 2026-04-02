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

## How to Deploy on Netlify
1. Push your code to GitHub.
2. Go to [Netlify](https://www.netlify.com/) and log in or sign up.
3. Click on `New site from Git`.
4. Select GitHub as your provider and authorize Netlify.
5. Choose the repository (`YanaPalyvoda/yanalabs`).
6. Set build commands and publish directory:
   - Build command: `npm run build`
   - Publish directory: `_site`
7. Click `Deploy site`.

## Contribution Guidelines
1. **Fork the repository**: Click the fork button at the top right of the repo.
2. **Create a branch**: Use a descriptive name for your branch.
   ```bash
   git checkout -b my-feature-branch
   ```
3. **Make your changes**: Add features or fix bugs.
4. **Commit your changes**: Write clear and concise commit messages.
   ```bash
   git commit -m "Add my new feature"
   ```
5. **Push to your branch**: 
   ```bash
   git push origin my-feature-branch
   ```
6. **Create a Pull Request**: Go to the original repository and click on the `New Pull Request` button.

By following these guidelines, you help maintain the integrity of the project. Thank you for your contributions!