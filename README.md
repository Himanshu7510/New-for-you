# Mediamozak Website

Single-page site (`index.html`) with a built-in admin panel, hosted on Vercel.
Admin edits and contact-form leads are saved in an Upstash Redis database through
small serverless functions in `api/`.

## Deploy on Vercel (one time)

1. **Import the repo**: vercel.com → Add New → Project → pick this GitHub repo →
   Framework Preset: **Other** → Deploy.
2. **Add the database**: in the project, Storage → Create / Browse Marketplace →
   **Upstash for Redis** (free plan) → connect it to this project.
   This adds the `KV_REST_API_URL` and `KV_REST_API_TOKEN` variables automatically.
3. **Set the admin login**: Settings → Environment Variables:

   | Name             | Value                                   |
   |------------------|-----------------------------------------|
   | `ADMIN_USERNAME` | your admin username (default: `admin`)  |
   | `ADMIN_PASSWORD` | a strong password                       |

4. **Redeploy**: Deployments → ⋯ on the latest one → Redeploy.

## Using the admin panel

- Open `https://<your-site>/?admin=true` (or click the Admin link in the footer).
- Log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
- Every change you save goes live for all visitors immediately.
- Contact-form submissions appear under **Lead Management**.
- To change the password, edit `ADMIN_PASSWORD` in Vercel and redeploy.

## Notes

- Uploaded images are stored inside the database as text. Keep them small
  (under ~1 MB each), or paste an image URL instead, for best speed.
- Every push to the main branch redeploys the site automatically.
