# Bee O`clock - Client Panel App

## Information

### MVP
The project need to make easier control the client side work and own company and app.

### Version 1
TODO

## Developer

### Add next client
1. Generate random name for a new client, name must be having 14 chars (min and max length of the name is 14).
2. Add new Firebase Project with this pattern: beeoclock-cloud-{{name_14_length}}
3. Prepare Hosting: `beeoclock-cloud-{{name_14_length}}` and `panel-beeoclock-cloud-{{name_14_length}}`
4. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/) and select context of `beeoclock-cloud-{{name_14_length}}`
5. GO to `IAM & Admin` and next `Service Accounts` click on `CREATE SERVICE ACCOUNT`
6. Write to `Service account name` the name `github-actions`
7. Create the new account (submit)
8. Go to `IAM` click on `GRANT CCESS` and write to `New princials` the new service account `github-actions@...`
9. Select roles: API Keys Viewer, Cloud Run Viewer, Firebase Authentication Admin, Firebase Hosting Admin
10. Click on `Save`
11. Return to `Service accounts` click on the account `github-actions@...`
12. Change tab on the `KEYS` and click on `ADD KEY` select `Create new key`
13. Select `JSON` option and click `CREATE`
14. Open downloaded JSON file and copy the value.
15. Open the link [https://github.com/beeoclock/client-panel-app/settings/secrets/actions](https://github.com/beeoclock/client-panel-app/settings/secrets/actions)
16. Click `New repository secret` and paste the data from buffer to `Secret *`
17. Write name of the secret: `FIREBASE_SERVICE_ACCOUNT_BEEOCLOCK_CLOUD_{{name_14_length}}`
18. Click `Add secret`
19. Open project and open file in the path: client-panel-app/.github/workflows/firebase-hosting-merge.yml
20. Duplicate last section of the file (pattern name of section `# Section: {{name_14_length}}`)
21. Change duplication `{{name_14_length}}` (this is pattern) in the new last section on the new client `{{name_14_length}}` (this is pattern).

### Generate random name of client {{name_14_length}}
1. Open the site: [https://onlinetools.com/random/generate-random-string](https://onlinetools.com/random/generate-random-string)
2. Random string's length: 14
3. How many random results: 1
4. Use these predefined string alphabets: Lowercase a-z and numbers
5. Click: Generate new random strings
6. Copy result and check if the name free in project.
