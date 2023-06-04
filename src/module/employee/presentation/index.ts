import {Routes} from "@angular/router";
import {employeeDetailsResolver} from "@employee/resolver/employee.details.resolver";
import {employeeListResolver} from "@employee/resolver/employee.list.resolver";

export const routers = [
  {
    path: '',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      items: employeeListResolver
    },
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
        resolve: {
          item: employeeDetailsResolver
        },
        loadComponent: () => import('./page/form'),
      }
    ]
  }
] as Routes;
