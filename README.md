# Bee O`clock - Client Panel App

![concept.jpg](project-material%2Fconcept.jpg)

## State Management
Ми використовуємо в якості менеджера стану NGXS. Всі файли стану розміщені в папці `state` в кожному з модулів тобто як приклад `./src/modules/account/state`.

# Event Bus
В проєкті є присутній Event Bus, який дозволяє взаємодіяти між станами в NGXS. 
Памʼятай що ми спочатку декларуємо випадок `case` в файлі ключів для Event Bus в файлі `./src/event-bus-token.enum.ts`.


