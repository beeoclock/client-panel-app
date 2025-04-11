import {Routes} from '@angular/router';
import {customerResolver} from "@tenant/customer/presentation/resolver/customer.resolver";
import {absenceResolver} from "@tenant/absence/presentation/ui/resolver/absence.resolver";
import {memberResolver} from "@tenant/member/presentation/resolver/member.resolver";
import {serviceResolver} from "@tenant/service/presentation/resolver/service.resolver";
import {orderResolver} from "@tenant/order/order/presentation/resolver/order.resolver";
import {paymentByOrderIdResolver} from "@tenant/order/payment/presentation/resolver/payment-by-order-id.resolver";
import {eventResolver} from "@tenant/event/presentation/resolver/event.resolver";
import {paymentResolver} from "@tenant/order/payment/presentation/resolver/payment.resolver";

export const tenantSecondRouters: Routes = [
	/**
	 * Customer
	 */
	{
		path: 'customer/form',
		outlet: 'second',
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/customer/presentation/ui/component/form/customer-form-container.component')
	},
	{
		path: 'customer/:id',
		outlet: 'second',
		resolve: {
			item: customerResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/customer/presentation/ui/component/details/customer-details-container.component')
	},
	{
		path: 'customer/:id/form',
		outlet: 'second',
		resolve: {
			item: customerResolver,
		},
		data: {
			isEditMode: true
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/customer/presentation/ui/component/form/customer-form-container.component')
	},
	{
		path: 'customer/:id/order',
		outlet: 'second',
		resolve: {
			item: customerResolver,
		},
		data: {
			isEditMode: true
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/order/order/presentation/ui/component/external/case/customer/list/customer.order.list.external.component')
	},
	/**
	 * Absence
	 */
	{
		path: 'absence/form',
		outlet: 'second',
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/absence/presentation/ui/component/form/absence-form-container.component')
	},
	{
		path: 'absence/:id',
		outlet: 'second',
		resolve: {
			item: absenceResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/absence/presentation/ui/component/details/absence-details-container.component')
	},
	{
		path: 'absence/:id/form',

		outlet: 'second',
		resolve: {
			item: absenceResolver,
		},
		data: {
			isEditMode: true
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/absence/presentation/ui/component/form/absence-form-container.component')
	},
	/**
	 * Member
	 */
	{
		path: 'member/form',
		outlet: 'second',
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/member/presentation/component/form/member-form-container/member-form-container.component')
	},
	{
		path: 'member/:id',
		outlet: 'second',
		resolve: {
			item: memberResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/member/presentation/component/details-container/member-details-container.component')
	},
	{
		path: 'member/:id/form',

		outlet: 'second',
		resolve: {
			item: memberResolver,
		},
		data: {
			isEditMode: true
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/member/presentation/component/form/member-form-container/member-form-container.component')
	},
	/**
	 * Service
	 */
	{
		path: 'service/form',
		outlet: 'second',
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/service/presentation/ui/component/form/service-container–form/service-container–form.component')
	},
	{
		path: 'service/:id',
		outlet: 'second',
		resolve: {
			item: serviceResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/service/presentation/ui/component/service-details/service-details')
	},
	{
		path: 'service/:id/form',
		outlet: 'second',
		resolve: {
			item: serviceResolver,
		},
		data: {
			isEditMode: true
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/service/presentation/ui/component/form/service-container–form/service-container–form.component')
	},
	/**
	 * Order
	 */
	{
		path: 'order/form',
		outlet: 'second',
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/order/order/presentation/ui/component/form/order-form-container.component')
	},
	{
		path: 'order/:id',
		outlet: 'second',
		resolve: {
			item: orderResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/order/order/presentation/ui/component/details/order-details-container.component')
	},
	{
		path: 'order/:id/form',
		outlet: 'second',
		resolve: {
			order: orderResolver,
			payment: paymentByOrderIdResolver
		},
		data: {
			isEditMode: true
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/order/order/presentation/ui/component/form/order-form-container.component')
	},
	/**
	 * Payment
	 */
	{
		path: 'payment/:id',
		outlet: 'second',
		resolve: {
			item: paymentResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/order/payment/presentation/ui/page/details/details')
	},
	/**
	 * Event
	 */
	{
		path: 'event/:id',
		outlet: 'second',
		resolve: {
			event: eventResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/event/presentation/ui/component/details/container.details.component')
	},
	/**
	 * App
	 */
	{
		path: 'additional-menu/:id/:datetimeISO',
		outlet: 'second',
		resolve: {
			member: memberResolver,
		},
		data: {
			title: 'event.additionalMenu.title'
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/event/presentation/ui/component/additional-menu/additional-menu.component')
	},
];
