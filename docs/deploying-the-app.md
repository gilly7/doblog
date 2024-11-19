# Deploying the app

Create a postgres user

Login to db

```sh
k exec -n postgres -it postgres-app-6df849688f-xw45w -- bash

psql "postgresql://root:<password>@127.0.0.1:5432/citizix"
```

SQL to create user and database. This example uses stage but customize to your environment.

```sql
create user stage_dublog with encrypted password '<password>';
create database stage_dublog;
grant all privileges on database stage_dublog to stage_dublog;

\c stage_dublog root
GRANT ALL ON SCHEMA public TO stage_dublog;
```

Create vault secret.

```sh
k exec -n vault -it vault-0 -- sh

vault kv put kv/stage/dublog-backend-app-secrets \
    db-url=postgresql://stage_dublog:<password>@postgres-app.postgres:5432/stage_dublog?schema=public \
    jwt-secret=<secret>

vault kv get kv/stage/dublog-backend-app-secrets

vault kv put kv/stage/dublog-frontend-app-secrets \
    auth-secret=<secret>

vault kv get kv/stage/dublog-frontend-app-secrets
```

Use this to generate a new JWT secret

```sh
openssl rand -hex 32
```
