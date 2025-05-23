import {Routes} from '@angular/router';
import {customerResolver} from "@tenant/customer/presentation/resolver/customer.resolver";
import {absenceResolver} from "@tenant/member/absence/presentation/ui/resolver/absence.resolver";
import {memberResolver} from "@tenant/member/member/presentation/resolver/member.resolver";
import {serviceResolver} from "@tenant/service/presentation/resolver/service.resolver";
import {orderResolver} from "@tenant/order/order/presentation/resolver/order.resolver";
import {paymentByOrderIdResolver} from "@tenant/order/payment/presentation/resolver/payment-by-order-id.resolver";
import {productResolver} from "@tenant/product/presentation/resolver/product.resolver";
import {eventResolver} from "@tenant/event/presentation/resolver/event.resolver";
import {paymentResolver} from "@tenant/order/payment/presentation/resolver/payment.resolver";
import {balanceResolver} from "@tenant/balance/presentation/resolver/balance.resolver";

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
		loadComponent: () => import('@tenant/member/absence/presentation/ui/component/form/absence-form-container.component')
	},
	{
		path: 'absence/:id',
		outlet: 'second',
		resolve: {
			item: absenceResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/member/absence/presentation/ui/component/details/absence-details-container.component')
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
		loadComponent: () => import('@tenant/member/absence/presentation/ui/component/form/absence-form-container.component')
	},
	/**
	 * Member
	 */
	{
		path: 'member/form',
		outlet: 'second',
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/member/member/presentation/component/form/member-form-container/member-form-container.component')
	},
	{
		path: 'member/:id',
		outlet: 'second',
		resolve: {
			item: memberResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/member/member/presentation/component/details-container/member-details-container.component')
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
		loadComponent: () => import('@tenant/member/member/presentation/component/form/member-form-container/member-form-container.component')
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
	 * Order Service
	 */
	// {
	// 	path: 'order-service/:id',
	// 	outlet: 'second',
	// 	resolve: {
	// 		item: orderServiceResolver,
	// 	},
	// 	runGuardsAndResolvers: 'always',
	// 	loadComponent: () => import('@tenant/order-service/presentation/ui/component/details/order-service-details-container.component')
	// },
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
	 * Product
	 */
	{
		path: 'product/form',
		outlet: 'second',
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/product/presentation/ui/component/form/product-form-container.component')
	},
	{
		path: 'product/:id',
		outlet: 'second',
		resolve: {
			item: productResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/product/presentation/ui/component/details/product-details-container.component')
	},
	{
		path: 'product/:id/form',
		outlet: 'second',
		resolve: {
			product: productResolver,
			payment: paymentByOrderIdResolver
		},
		data: {
			isEditMode: true
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/product/presentation/ui/component/form/product-form-container.component')
	},
	/**
	 * Event
	 */
	{
		path: 'event/:id',
		outlet: 'second',
		resolve: {
			item: eventResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/event/presentation/ui/component/details/container.details.component')
	},
	/**
	 * Balance
	 */
	{
		path: 'balance/form',
		outlet: 'second',
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/balance/presentation/ui/component/form/balance-form-container.component')
	},
	{
		path: 'balance/:id',
		outlet: 'second',
		resolve: {
			item: balanceResolver,
		},
		runGuardsAndResolvers: 'always',
		loadComponent: () => import('@tenant/balance/presentation/ui/component/details/balance-details-container.component')
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
