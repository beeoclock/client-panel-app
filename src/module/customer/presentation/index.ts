import {Routes} from "@angular/router";
import {CustomerWrapperComponent} from "@customer/presentation/component/wrapper/customer.wrapper.component";

export const routers = [
	{
		path: '',
		component: CustomerWrapperComponent,
		children: [
			{
				path: 'list',
				loadComponent: () => import('./page/list')
			},
		]
	}
] as Routes;
