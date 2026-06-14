# Root Privileged Features Registry

This file tracks which admin capabilities are reserved for the `root` role.

## Visibility policy

- `admin+root`: default policy for management features.
- `root-only`: privileged policy for infrastructure, destructive, or safety-critical actions.

## Current registry

| Feature | Location | Policy | Reason |
| --- | --- | --- | --- |
| Database seed controls | `src/components/BeforeDashboard/SeedButton/index.tsx` + `src/app/(app)/next/seed/route.ts` | `root-only` | Seeding can overwrite/store system baseline data and should be restricted. |
| Root role assignment/removal governance | `src/collections/Users/hooks/enforceRootRoleGovernance.ts` | `root-only` | Prevent privilege escalation and protect against accidental removal of last root account. |

## Audit checklist for future features

When adding or updating an admin capability:

1. Decide policy: `admin+root` or `root-only`.
2. Add server-side access enforcement first.
3. Add matching UI visibility gate.
4. Register the feature in this file with rationale.
