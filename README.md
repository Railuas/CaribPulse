# CaribePulse Rescue Site

This bundle restores a working **Pages Router** homepage and hurricanes page, wires the global theme, and avoids TS errors from archived folders.

## Steps
1. Delete any `app/` folder at repo root (router conflict).
2. Unzip this bundle into your repo root and overwrite.
3. Commit & push.
4. Visit `/` and `/hurricanes`.

If TypeScript still tries to compile an uploaded archive, add it to `tsconfig.json > exclude`.
