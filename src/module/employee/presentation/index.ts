import {Routes} from "@angular/router";
import {employeeDetailsResolver} from "@employee/resolver/employee.details.resolver";

export const routers = [
  {
    path: '',
    loadComponent: () => import('./page/list')
  },
  {
    path: 'details',
    children: [
      {
        path: ':id',
        resolve: {
          item: employeeDetailsResolver
        },
        loadComponent: () => import('./page/details')
      }
    ]
  },
  {
    path: 'form',
    children: [
      {
        path: '',
        loadComponent: () => import('./page/form'),
      },
      {
        path: ':id',
        loadComponent: () => import('./page/form'),
      }
    ]
  }
] as Routes;
