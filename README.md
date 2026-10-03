# One Little Question

A small, romantic coffee-date invitation. It runs entirely in the browser: no database, no server, no accounts, and no analytics. Change the names in one file, then publish it with GitHub Pages.

Before you share the link, edit [`src/config/invitation.ts`](src/config/invitation.ts). That is the only file you need to touch for the name, the question, the coffee note, the colors, and the placeholder date or café.

## Local development

```bash
npm install
npm run dev
```

Open the address Vite prints, usually `http://localhost:5173`.

## Build

```bash
npm run build
```

The production site is written to `dist/`. To look at that build locally:

```bash
npm run preview
```

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` installs dependencies, builds the site, and deploys `dist/` to GitHub Pages.

1. Create a new **public** GitHub repository. Do not add a generated README, license, or `.gitignore` if you are about to push this project.
2. Push this project to the repository’s default branch (`main`):

   ```bash
   git add .
   git commit -m "Add the coffee date invitation"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
   git push -u origin main
   ```

3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Open the **Actions** tab. If GitHub asks you to approve the workflow, approve it. When the “Deploy to GitHub Pages” run finishes, the public address is shown on that run and under **Settings → Pages**.

The public site will look like:

```text
https://YOUR_USER.github.io/YOUR_REPO/
```

Asset paths are relative, so the same build works for a project site (`/YOUR_REPO/`) and for a site served at the domain root.

After the site is live, open `index.html` and set `og:image` and `twitter:image` to the full public image URL so chat apps can preview it:

```text
https://YOUR_USER.github.io/YOUR_REPO/og.jpg
```

## Custom domain

You do not need a custom domain, and this project will not buy one for you. If you want something like `coffee.yourdomain.com` later:

1. Publish the site with GitHub Pages first, using the steps above.
2. Buy the domain from any registrar you already like.
3. In the repository, open **Settings → Pages → Custom domain** and enter `coffee.yourdomain.com`.
4. At your DNS host, add a record like this:

   ```text
   # coffee.yourdomain.com    CNAME    YOUR_USER.github.io
   ```

5. Wait for DNS to update, then turn on **Enforce HTTPS** in the Pages settings.

GitHub keeps the domain in a `CNAME` file. You can add that file yourself when you are ready:

```text
# public/CNAME
# coffee.yourdomain.com
```

Leave that file out until the domain is actually yours.

## Privacy

The page does not collect answers, set tracking cookies, or send the date details anywhere. “Send me the details” only copies a note onto the device so it can be shared by hand. Sound stays off until the sound button is pressed.
