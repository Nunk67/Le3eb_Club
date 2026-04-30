# System Validator (Rule)

Policy harness checks **POL-01** … **POL-05**; companion harness checks **ALG-01** … **ALG-08** (see `.cursor/commands/validate-*.md`).

Companion note for [`validator-full-system-gate-matrix.md`](./validator-full-system-gate-matrix.md).

Ensure **full-system gate matrix requirements are aligned with current stage** (default profile maps to **M10** in `scripts/validate-gate.mjs`). When milestone scope shifts, update the matrix and `STAGE_CHECKS` in that script together.
