# Known Bugs and Planned Features

Use this file as a lightweight tracker for active issues and upcoming improvements.

## Known bugs

- Auth context switching between admin and customer in one browser profile
  - Status: Known dev UX limitation
  - Impact: Switching from storefront customer login back to `/admin` can cause `unauthorized` redirects or logout friction
  - Root cause: Auth cookies/session context can overlap between `admins` and `customers` collections
  - Current mitigation:
    - Storefront now treats only `customers` as authenticated
    - Admin logout now logs out the detected active auth collection to avoid logout loops
  - Recommended workaround (now):
    - Use separate browser profiles (or incognito) for admin and storefront testing
  - Resolution options (later):
    - Split admin and storefront onto separate subdomains with clear cookie scope boundaries
    - Implement a deeper auth/session strategy that supports truly independent concurrent sessions per collection

## Features to implement

- Dual-session-friendly auth experience
  - Goal: Stay logged in as admin and customer concurrently without context switching friction
  - Candidate approach:
    - Add environment-specific domain strategy for local/dev and production
    - Validate cookie behavior end-to-end with explicit test cases
  - Success criteria:
    - Visiting `/admin` never depends on storefront auth state
    - Visiting storefront account pages never depends on admin auth state

## Maintenance notes

- Keep items short and outcome-focused
  - Add new bugs with: `Status`, `Impact`, `Root cause`, `Workaround`, `Resolution options`
  - Add new features with: `Goal`, `Candidate approach`, `Success criteria`
