# Rocky MVP

A mobile-first community mascot and social discovery prototype for the NKU Fall 2026 Hackathon.

## Stack

- React 19
- Vite 8 (Rolldown is Vite 8's built-in bundler)
- Firebase Authentication (anonymous sessions)
- Cloud Firestore
- Cloud Storage for Firebase
- Optional Firebase App Check with reCAPTCHA Enterprise
- Netlify hosting

## What is already implemented

- Public Rocky landing page
- Mobile-first responsive design
- Photo picker/camera workflow
- Client-side image resizing/compression
- Optional caption
- Optional mission for the next finder
- Persistent Firebase photo upload
- Firestore discovery records
- Gallery refresh (not realtime by design)
- Latest mission card
- Silent anonymous authentication; visitors never create a visible account
- Firestore and Storage rules with input/file limits
- Honeypot plus a small same-device submission cooldown
- Optional App Check hook
- Local demo mode when Firebase environment variables are missing
- Netlify SPA configuration and security headers

## Quick local start

```bash
npm install
npm run dev
```

If you have not created `.env.local` yet, Rocky runs in **local demo mode**. Test submissions stay in that browser's localStorage only. This is useful for iterating on the UI before Firebase is ready.

## Connect Firebase

See `SETUP.md` for the exact Firebase and Netlify steps.

## Data model

Collection: `discoveries`

```js
{
  rockId: 'rocky',
  imageUrl: 'https://...',
  imagePath: 'discoveries/<anonymousUid>/<file>',
  caption: 'Found Rocky outside the library!',
  mission: 'Take Rocky somewhere unexpected.',
  createdAt: serverTimestamp(),
  createdBy: '<anonymousUid>'
}
```

## Important MVP security note

This is intentionally a hackathon MVP, not a production moderation system. Anonymous authentication plus Security Rules is substantially safer than unauthenticated public writes, but anonymous users can still be abusive. Before a broad public launch, enable App Check and consider a moderation queue and server-side rate limiting.

## Photo storage billing note

As of 2026, Cloud Storage for Firebase requires a Blaze (pay-as-you-go) project with a billing account attached. Small usage can remain inside Google's no-cost quotas, but a billing account is still required to use the service.
