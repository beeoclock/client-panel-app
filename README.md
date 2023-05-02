# Bee O`clock - Client Panel App

## Information

### MVP
The project need to make easier control the client side work and own company and app.

### Version 1
TODO

## Developer

### Add next client
#### Step #1: Init firebase project
1. Generate random name for a new client, name must be having 14 chars (min and max length of the name is 14).
2. Add new Firebase Project with this pattern: beeoclock-cloud-{{name_14_length}}.
3. Prepare Hosting: `beeoclock-cloud-{{name_14_length}}` and `panel-beeoclock-cloud-{{name_14_length}}`.
4. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/) and select context of `beeoclock-cloud-{{name_14_length}}`.
5. GO to `IAM & Admin` and next `Service Accounts` click on `CREATE SERVICE ACCOUNT`.
6. Write to `Service account name` the name `github-actions`.
7. Create the new account (submit).
8. Go to `IAM` click on `GRANT CCESS` and write to `New princials` the new service account `github-actions@...`.
9. Select roles: Owner.
10. Click on `Save`.
11. Return to `Service accounts` click on the account `github-actions@...`.
12. Change tab on the `KEYS` and click on `ADD KEY` select `Create new key`.
13. Select `JSON` option and click `CREATE`.
14. Open downloaded JSON file and copy the value.
15. Open the link [https://github.com/beeoclock/client-panel-app/settings/secrets/actions](https://github.com/beeoclock/client-panel-app/settings/secrets/actions)
16. Click `New repository secret` and paste the data from buffer to `Secret *`.
17. Write name of the secret: `FIREBASE_SERVICE_ACCOUNT_BEEOCLOCK_CLOUD_{{name_14_length}}`.
18. Click `Add secret`.
19. Open project and open file in the path: `client-panel-app/.github/workflows/firebase-hosting-merge.yml`.
20. Duplicate last section of the file (pattern name of section `# Section: {{name_14_length}}`).
21. Change duplication `{{name_14_length}}` (this is pattern) in the new last section on the new client `{{name_14_length}}` (this is pattern).
22. Open firebase and go to `Project settings > General`.
23. Scroll to `Your apps` and add a new application of `web`.
24. App nickname: `panel-beeoclock-cloud-{{name_14_length}}`.
25. Also set up Firebase Hosting for this app - select `panel-beeoclock-cloud-{{name_14_length}}`.
26. Register APP.
27. Copy value of firebaseConfig variable.
28. Return back to project and create new environment file in `src/environment` like `environment.beeoclock-cloud-{{name_14_length}}.ts`.
29. Open file and create new property `firebase` and paste there the copied data.
30. Return back on the firebase website and click `next` btn.
31. Again `next` and click on `Continue on console`.
32. Return back to project and open `angular.json` file.
33. Find `beeoclock-cloud-00000000000000` in `configuration` and create duplication the config.
34. Change all names in duplication from `beeoclock-cloud-00000000000000` to `beeoclock-cloud-{{name_14_length}}`.

#### Step #2: Init MongoDB Atlas
1. Go to: https://cloud.mongodb.com/v2#/org/6450d84386414639f495579d/projects
2. Create new project, click `New Project`.
3. Paste/Write to `Project Name` input name of new client `beeoclock-cloud-{{name_14_length}}`.
4. Create member with next login/username `beeoclock-cloud-{{name_14_length}}` and autogenerate password.
5. Next click on `Add member`.
6. Next add network access from anywhere, write to IP input next value: `0.0.0.0/0` and add comment `anywhere`.
7. Finish: click finish button.
8. Create new cluster on `DEPLOYMENT>database` page, set name of new cluster `main`.
9. Select `SHARED` package.
10. Set correct data of place where database must be created, like `frankfrut` if client from europe.
11. Open `firebase-cloud-functions` project from GitHub `Bee O'clock` organization.
12. Do duplication of `beeoclock-cloud-00000000000000.json` file, at `ROOT_PROJECT/functions/environments/`.
13. Open the file and change values at `password` and `username` fields.
14. Next open file `firebase-cloud-function-merge.yml` at `ROOT_PROJECT/.github/workflows/`.
15. Duplicate section with name `beeoclock-cloud-00000000000000` and change any data from `00000000000000` to client ID `{{name_14_length}}`

### Generate random name of client {{name_14_length}}
1. Open the site: [https://onlinetools.com/random/generate-random-string](https://onlinetools.com/random/generate-random-string)
2. Random string's length: 14
3. How many random results: 1
4. Use these predefined string alphabets: Lowercase a-z and numbers
5. Click: Generate new random strings
6. Copy result and check if the name free in project.


## Architecture

### Folders
```
asset // Додаткові ресурси для різних випадків
  i18n // Переклади
  
  icon // Іконки
  
  img // Картинки
  
  scss // Стилі

module // Домени додатку
  company // Домена відповідає за контекст користувача в додатку, напркилад редагування інформації про фірму ітд.
  
  customer // Домена відповідає за клієнтів фірми
    adapter //
    domain //
    form //
    presentation //
    repository //
  
  employee // Домена відповідає за працівників фірми
  
  event // Домена відповідає за події, наприклад резервації, зустрічі тощо повʼязане з календарем
  
  identity // Домена відповідає за авторизацію, реєстрацію, тощо з аутентифікацією (токен до авторизації)
  
  service // Домена відповідає за послуги які надає фірма
  
  user // Домена відповідає за користувача який пройшов аутентифікацію
  
  utility // Домена відповідає за додаткові споміжні можливості, наприклад інструменти якісь, базові моделі тощо
  
environment // Тримаємо всі змінні клієнтів

script // Додаткові скрипти які в майбутньому будуть переписані або замінені
```
