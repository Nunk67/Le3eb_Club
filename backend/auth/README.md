# Auth Module Plan

This module owns authentication only. It should not decide when the UI prompts for login or which product features require authentication.

## Public API Contract

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `POST /api/auth/email-code/send`
- `POST /api/auth/email-code/login`

Email-code endpoints are currently implemented with local development infrastructure: in-memory verification codes, in-memory cooldowns, and console email output.

## Internal Boundaries

- `AuthUserStore`: user lookup and mutation.
- `VerificationCodeStore`: short-lived email code records.
- `MailSender`: delivery of email codes.
- `AuthRateLimiter`: send/login throttling.
- `PasswordHasher`: password hash and verification.
- `TokenIssuer`: access token, refresh token, and legacy session issuance.

Local development can back these contracts with JSON storage, in-memory TTL maps, and console email output. Production can replace those implementations with Postgres, Redis, and a real mail provider without changing the route contract.

## Current Local Email-Code Flow

- `POST /api/auth/email-code/send` generates a 6-digit code.
- The code is stored as a salted hash and expires after 5 minutes.
- The same email and purpose have a 60-second resend cooldown.
- The code is logged with the `auth_email_code` log event.
- `POST /api/auth/email-code/login` consumes the code once, creates the user when the email does not exist, and returns the same session shape as password login.

## Next Small Step

Wire the frontend login modal to `sendEmailCode` / `loginWithEmailCode` behind a login-mode switch. Keep UI trigger and protected-feature rules outside this module.
