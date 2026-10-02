# Rocky setup: Firebase + Netlify

## 1. Run the app locally first

```bash
npm install
npm run dev
```

Without Firebase variables the app runs in local demo mode, so you can immediately test the user flow.

## 2. Create a Firebase project

1. Open the Firebase Console and create a project for Rocky.
2. Add a **Web app** to the project.
3. Copy the Firebase configuration values shown by the console.
4. Create `.env.local` from `.env.example` and fill in the values.

Example:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Firebase web configuration values identify the project; they are not a substitute for Security Rules. Do not put service-account private keys in this frontend project.

## 3. Enable Anonymous Authentication

Firebase Console → Authentication → Sign-in method → Anonymous → Enable.

Rocky signs visitors in silently. There is no sign-up form, username, password, or profile.

## 4. Create Firestore

Firebase Console → Firestore Database → Create database.

Choose Production mode. Deploy the provided `firestore.rules` before public testing.

If you have the Firebase CLI installed:

```bash
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

## 5. Create Cloud Storage

Firebase now requires Cloud Storage projects to use the Blaze plan. A billing account must be linked even if your hackathon usage remains inside the no-cost quota.

Firebase Console → Storage → Get started.

For the most favorable Google Cloud Storage no-cost tier, review Google's currently eligible regions before choosing a bucket location.

Then deploy the provided Storage rules:

```bash
firebase deploy --only storage
```

## 6. Test the real shared flow

Restart `npm run dev` after adding `.env.local`.

Test this sequence:

1. Open Rocky in one browser/device.
2. Submit a photo, caption, and mission.
3. Refresh the gallery.
4. Open Rocky on another browser/device.
5. Confirm the same discovery appears.

## 7. Optional but recommended: Firebase App Check

For a public anonymous app, App Check gives you another layer against scripted abuse.

1. In Google Cloud, create a score-based reCAPTCHA Enterprise web key for your production domain.
2. Register the web app in Firebase Console → App Check.
3. Add the public site key to Netlify and `.env.local`:

```env
VITE_RECAPTCHA_ENTERPRISE_SITE_KEY=...
```

4. Deploy first and monitor App Check metrics.
5. Enable enforcement only after confirming legitimate requests are receiving valid tokens.

## 8. Deploy to Netlify

Recommended hackathon flow:

1. Put this project in a GitHub repository.
2. Netlify → Add new project → Import an existing project.
3. Select the Rocky repository.
4. Netlify should detect Vite. This repo also contains `netlify.toml` with:
   - build command: `npm run build`
   - publish directory: `dist`
5. In Netlify → Site configuration → Environment variables, add every `VITE_FIREBASE_*` value from `.env.local`.
6. Add `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` too if App Check is configured.
7. Deploy.
8. Pick a stable Netlify site name, for example `rocky-nku.netlify.app` if available.

Do **not** put `.env.local` in Git. The `.gitignore` already excludes it.

## 9. Create Rocky's physical QR code

Generate a static QR code containing the final production URL, for example:

```text
https://rocky-nku.netlify.app
```

The QR code can stay the same across future deployments as long as you keep the same Netlify site URL.

## 10. Pre-demo checklist

- Phone can open the production URL on cellular data.
- Camera/photo picker works on iPhone and Android.
- New submission uploads successfully.
- Refresh displays the new gallery item.
- A second device sees the submission.
- Firebase rules are deployed.
- Netlify environment variables are present.
- At least one fallback/demo photo exists before judging.
- QR code scans from the physical Rocky object at normal distance.

## Suggested next iteration

After the core loop is reliable, add moderation before adding social features. A simple model is `status: 'pending' | 'approved' | 'rejected'`, with public gallery queries restricted to approved submissions and a small authenticated admin view for the team.
