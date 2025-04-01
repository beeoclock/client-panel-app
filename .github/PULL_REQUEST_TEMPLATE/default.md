## 📌 Description

Please provide a short summary explaining what this PR does.

---

## ✅ General Checklist

- [ ] Code has been tested locally
- [ ] No `console.log` or `debugger` left in code
- [ ] Documentation/README updated if necessary
- [ ] consult with QA team 
- [ ] run e2e tests by action from https://github.com/beeoclock/client-app-e2e/actions
<details>
  <summary>Manual Test Checklist - `main` branch</summary>

### **0. key information**
- [ ] Ensure that after any change synchronization is executed and ended
- [ ] open devtools and check the console when do testing 
- **All sections below can be tested in any order.** However, within a given section, the scenario should be easy to follow in order.
  
### **1. Login**
- [ ] Log in with email and password, assert successful login

### **2. Calendar**
- [ ] Create an order on the calendar, check email notification, and assert successful creation
- [ ] assert correctly presented order on the calendar grid
- [ ] Edit an order on the calendar, assert successful update
- [ ] Delete an order on the calendar, assert successful deletion
- [ ] Verify the date component on the calendar
- [ ] create order with new client and assert successful creation
- [ ] create order with existed client and assert successful creation
- [ ] create order with anonymous client and assert successful creation
- [ ] create with guest client and assert successful creation

### **3. Absences**
- [ ] Create an absence for a future date, assert successful creation
- [ ] Edit an absence for a future date, assert successful update
- [ ] Create an absence for the current time, assert successful creation
- [ ] Click on the absence module, create an absence, assert successful creation, then deactivate and delete it
- [ ] Verify proper state on the absence grid

### **4. Clients**
- [ ] Open the client search module, select all position on filter, then deactivate and activate a client, assert status change
- [ ] Add a new client, assert successful creation
- [ ] Verify proper state on the client grid

### **5. Orders**
- [ ] Click on the order module, modify a property, and check email notification

### **6. Statistics**
- [ ] Click on the statistics module, assert successful opening
- [ ] check the service widget, assert source information filter is correctly open, and visible:
  -	[ ] all sources
  - [ ] from panel 
  - [ ] from public panel

### **7. Members**
- [ ] Click on the member module, add a new member, assert successful creation, then delete it
- [ ] Verify proper state on the member grid
- [ ] Edit a member, assert successful update

### **8. Services**
- [ ] Click on the service module, add a new service, assert successful creation, then delete it
- [ ] Verify proper state on the service grid
- [ ] Edit a service, assert successful update
- [ ] Filter services by status, assert correct results

### **9. Company Settings**
- [ ] Click on the company settings module, change "sooner book time", assert successful update
- [ ] Change time period, assert successful update
- [ ] Change required fields, assert successful update
- [ ] Modify email notification settings, assert successful update when creating an order (no confirmation modal)

### **10. Tariffs**
- [ ] Click on the tariffs module, assert that all three tariffs are present
- [ ] Change the tariff plan, assert successful update
- [ ] Verify that the tariff description is displayed correctly

### **11. Settings**
- [ ] Click on the settings module, change language, and assert the update
- [ ] Edit email, assert successful update

### **12. Context Switching**
- [ ] Click "Change Context", assert that all contexts are visible
- [ ] Switch to another context, assert that all modules are displayed correctly

### **13. Logout**
- [ ] Click "Logout", verify that the user is logged out and that the login module is visible

### **14. New Context Creation**
- [ ] click on the "Create New Context" button, assert that the introduce page is visible
- [ ] create default context, with address and services
- [ ] check is correctly created and become logged into new context on the calendar page
- [ ] click on the company settings module and delete created context
- [ ] check that user ware moved into select context page

### **15. public page**
- [ ] click on the public page module, and assert successfully moved into public page

</details>

---

<details>
  <summary>🚨 Additional checklist for PRs targeting <code>main</code> branch</summary>

> ⚠️ Only required if this PR is targeting the <code>main</code> branch!

- [ ] This version is production-ready
- [ ] All critical paths have been tested thoroughly
- [ ] A responsible person is assigned for the deployment
- [ ] Rollback plan is prepared in case of failure
</details>

---

## 📎 Related Issues / Tickets

Link any related issue or ticket here (e.g., `Closes #123` or `Related to #456`).
