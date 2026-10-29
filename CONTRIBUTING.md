# Contributing

Thanks for taking the time to contribute to the FreJun integration examples.
Fixes to existing examples, clearer READMEs, and new examples are all welcome.

Please read the [code of conduct](./CODE_OF_CONDUCT.md) before contributing.

## Before you start

- Check the [FreJun docs](https://frejun.com/docs/) and the example's own README
  — most questions about API fields and events are answered there.
- Search existing issues. If the problem is already reported, add your details
  to that thread instead of opening a new one.
- **Never include credentials** in an issue, pull request, or commit. Redact your
  `VITE_CLIENT_ID` / `VITE_CLIENT_SECRET`, access tokens, and real phone numbers
  before pasting logs or code. Do not commit your `.env` file.
- Found a security vulnerability? Do not open a public issue — follow
  [SECURITY.md](./SECURITY.md).

## Filing an issue

A good bug report includes:

- which example is affected — `voip-dialer-widget`, `voip-web-sdk`,
  `voip-call-api`, or `network-calling`
- your browser and Node.js versions
- the steps you took and what you expected to happen
- what actually happened — the on-screen log, browser console errors, or the
  API response body

## Running an example

Each example is a standalone [Vite](https://vitejs.dev/) app:

```sh
cd <example>
npm install
npm run dev       # http://localhost:5173
```

Create a `.env` file in the example folder with your FreJun OAuth app
credentials, as described in the [README](./README.md#run-any-example).

## Opening a pull request

1. Fork the repository and create a branch off `main`.
2. Keep the change focused — one example or one fix per pull request.
3. Run the example you changed with `npm run dev` and check the flow works end to
   end. Make sure `npm run build` succeeds.
4. Update the example's README if its behaviour, events, or API fields changed.

### Adding a new example

- Put it in its own top-level folder, following the structure of the existing
  examples (`index.html`, `src/main.js`, `package.json`, `README.md`).
- Read credentials from `.env`; never hard-code them.
- Its README should cover what it shows, the API fields or events it uses, and
  the error cases it demonstrates — like the existing ones.
- Add a row for it to the table in the root [README](./README.md).

## Licensing

Contributions are accepted under the repository's [MIT licence](./LICENSE). By
opening a pull request you confirm you have the right to submit the code under
that licence.

## Questions

Open an issue, or email [support@frejun.com](mailto:support@frejun.com).
