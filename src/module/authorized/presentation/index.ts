import {Routes} from "@angular/router";
import WrapperPanelComponent from "@utility/presentation/component/wrapper-panel/wrapper-panel.component";

export const routers = [
	{
		path: '',
		component: WrapperPanelComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: '/identity',
			},
			{
				path: 'dashboard',
				loadChildren: () => import('@utility/index')
			},
			{
				path: 'member',
				loadChildren: () => import('@member/index')
			},
			{
				path: 'user',
				loadChildren: () => import('@user/presentation')
			},
			{
				path: 'event',
				loadChildren: () => import('@event/index')
			},
			{
				path: 'client',
				loadChildren: () => import('@module/client/index')
			},
			{
				path: 'customer',
				loadChildren: () => import('@customer/index')
			},
			{
				path: 'service',
				loadChildren: () => import('@service/index')
			},
		]
	},
] as Routes;
