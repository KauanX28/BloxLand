# BloxKeys Clone

This is a high-fidelity, fully functional frontend clone of the BloxKeys website. It replicates the specific dark-blue UI, interactive product listings, shopping cart logic, and FAQ/reviews systems, ensuring the code is modular, optimized, and ready for deployment on the Vercel platform.

## Architecture
- Vanilla JS (ES Modules)
- No build process required (Vercel-native)
- Vanilla CSS with CSS Variables for Theme
- Product Database is stored in `/src/data/products.json`
- Shopping Cart state is persisted to `localStorage`

## How to Deploy on Vercel
1. Initialize a Git repository and commit all files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Push to GitHub.
3. Import the repository into Vercel dashboard.
4. Vercel will automatically detect `vercel.json` and deploy it instantly as a static site. No Build Command is necessary.

## Local Development
Since this project uses ES Modules (import/fetch local JSON files), you should serve it via a local web server to avoid CORS issues.
If you have Python installed, you can run:
```bash
python -m http.server 3000
```
Then navigate to `http://localhost:3000` in your browser.
