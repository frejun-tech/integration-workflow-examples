# Security policy

This policy covers the examples in this repository and the FreJun APIs they
call.

## About these examples

These examples are for **local development and learning only**. To keep them
short, they read `VITE_CLIENT_SECRET` in the browser, so the secret ends up in
the frontend bundle. Do not deploy them as-is. In production, exchange and
refresh tokens on your backend — see
[backend token generation](https://github.com/frejun-tech/frejun-oauth-sdk#backend-token-generation)
in `@frejun/oauth`.

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues or
pull requests.**

Email [support@frejun.com](mailto:support@frejun.com) with the subject line
`SECURITY: integration-workflow-examples` and a description of the issue.

To help us reproduce and assess it quickly, include what you can of:

- the affected example, or the FreJun API or SDK it uses
- the type of issue — for example token leakage, an authentication bypass, or
  access to another account's data
- step-by-step instructions to reproduce, with any proof-of-concept code
- the impact you believe it has, and which accounts or data it could reach

If the issue is in `@frejun/oauth` itself, you can report it the same way — see
its [security policy](https://github.com/frejun-tech/frejun-oauth-sdk/blob/main/SECURITY.md).

## What happens next

We will acknowledge your report by email, tell you whether we could reproduce
it, and keep you updated while we work on a fix. We appreciate reports made in
good faith and, if you'd like, will acknowledge your contribution when we
publish the fix.

## Please do

- Give us a reasonable chance to fix the issue before disclosing it publicly.
- Test only against your own FreJun account, numbers, and data.
- Stop once you have confirmed the issue, and access only the minimum data
  needed to demonstrate it.

## Please do not

- Access, modify, or delete data belonging to another FreJun account.
- Run denial-of-service, load, or brute-force testing against FreJun services.
- Place calls to people who have not consented to your testing.

## If your credentials are exposed

If your OAuth `clientSecret` or an access or refresh token has been exposed
(for example a committed `.env` file or a deployed example), email
[support@frejun.com](mailto:support@frejun.com) straight away so we can revoke
them and review account activity.

Never include live credentials in a report — redact them and tell us where they
were exposed instead.

## Non-security issues

For bugs without a security impact, open a normal issue. See
[CONTRIBUTING.md](./CONTRIBUTING.md).
