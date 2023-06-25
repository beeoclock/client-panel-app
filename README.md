# Bee O`clock - Client Panel App

## Information

### MVP
The project need to make easier control the client side work and own company and app.

### Version 1
TODO

## Developer

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
