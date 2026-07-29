# VMManager Playwright Tests

Run the suite from this directory:

```bash
npm install
npx playwright install chromium
npm test
```

The configuration starts Spring Boot on port `18080` and Angular on port `4201` when they are not already running. Tests run serially because the application intentionally uses shared H2 state. HTML reports, traces on retry, and failure screenshots are generated locally and ignored by Git.

The specs cover the menu-driven Machines, Networks, Storage, and Tools views; manager data actions; VM creation and dialog entry points; network management; and storage pool/volume controls.