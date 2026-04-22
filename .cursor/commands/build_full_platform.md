# Command: build_full_platform

## Purpose
Orchestrate the full development pipeline.

## Workflow

1. init_project
2. init_design_system
3. split_backend_services
4. generate_admin_schemas
5. harden_transaction_flow
6. prune_frontend_demo_code

## After every phase

- run validator-agent
- run context-agent
- update milestone status
- create version snapshot when the structure changes
