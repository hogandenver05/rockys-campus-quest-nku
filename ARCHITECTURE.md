# Rocky MVP architecture

## Request flow

```text
Physical Rocky
   ↓ scan QR
Netlify production URL
   ↓
React + Vite 8 (Rolldown)
   ├─ read gallery ───────────────→ Cloud Firestore
   ├─ silent anonymous session ───→ Firebase Authentication
   └─ submit discovery
        ├─ resize/compress photo in browser
        ├─ upload photo ──────────→ Cloud Storage for Firebase
        └─ save metadata ─────────→ Cloud Firestore
```

## Why there is no custom server in the MVP

Firebase's browser SDK plus Security Rules gives the prototype enough backend behavior to demonstrate the core experience without maintaining an API server. This reduces hackathon scope and makes the data flow explainable to judges.

## Trust boundaries

- Netlify serves public frontend assets.
- Firebase web config is intentionally present in the browser; authorization is enforced by Firebase rules, not by hiding those values.
- Visitors receive an anonymous Firebase user ID silently.
- Firestore permits public reads of `discoveries` but only authenticated creates that match the expected schema.
- Storage permits public image reads and authenticated image creation only beneath the uploader's anonymous UID.
- App Check can be enabled to make scripted use of the Firebase backend harder.

## Known MVP limitations

- No human moderation queue yet.
- No server-side rate limiter yet.
- No image-content moderation yet.
- The 30-second cooldown and honeypot are client-side friction, not strong security controls.
- Public gallery reads expose everything written to the `discoveries` collection.

Those are acceptable for a controlled hackathon demonstration. Before broad campus launch, the recommended first feature is an approval workflow rather than likes, profiles, or realtime updates.
