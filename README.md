# Memehub Backend Setup

- cd into Memehub-Backend Root
- copy .env.example to .env
- fill out .env variables
- run `npm install`

# DB Migrations

    npm run typeorm migration:generate -- -n "name_for_migration_here"