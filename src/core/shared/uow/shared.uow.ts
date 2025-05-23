import {ServiceService} from "@tenant/service/domain/service/service.service";
import {PaymentService} from "@tenant/order/payment/domain/service/payment.service";
import {OrderService} from "@tenant/order/order/domain/service/order.service";
import {MemberService} from "@tenant/member/member/domain/service/member.service";
import {CustomerService} from "@tenant/customer/domain/service/customer.service";
import {BusinessProfileService} from "@tenant/business-profile/domain/service/business-profile.service";
import {AbsenceService} from "@tenant/member/absence/domain/service/absence.service";
import {TariffPlanService} from "@tenant/tariff-plan/tariff-plan/domain/service/tariff-plan.service";
import {
	TariffPlanHistoryService
} from "@tenant/tariff-plan/tariff-plan-history/domain/service/tariff-plan-history.service";
import {OrderServiceService} from "@tenant/order/order-service/domain/service/order-service.service";
import {EnvironmentProviders, Provider} from "@angular/core";
import {BalanceService} from "@tenant/balance/domain/service/balance.service";
import {PluginService} from "@tenant/plugin/plugin/domain/service/plugin.service";
import {TenantPluginService} from "@tenant/plugin/tenant-plugin/domain/service/tenant-plugin.service";
import {ProductTagService} from "@tenant/product/product-tag/domain/service/product-tag.service";
import {ProductService} from "@tenant/product/product/domain/service/product.service";
import {RoleService} from "@tenant/member/roles/domain/service/role.service";

/**
 * Shared Unit of Work
 * Use this class to access services from different modules, without importing them directly
 */
export class SharedUow {

	public static provide: Provider | EnvironmentProviders = {
		provide: SharedUow,
		useClass: SharedUow,
	};

	#service!: ServiceService;
	#payment!: PaymentService;
	#order!: OrderService;
	#orderService!: OrderServiceService;
	#member!: MemberService;
	#role!: RoleService;
	#customer!: CustomerService;
	#businessProfile!: BusinessProfileService;
	#absence!: AbsenceService;
	#product!: ProductService;
	#productTag!: ProductTagService;
	#tariffPlan!: TariffPlanService;
	#tariffPlanHistory!: TariffPlanHistoryService;
	#balance!: BalanceService;
	#plugin!: PluginService;
	#tenantPlugin!: TenantPluginService;

	public get service() {
		if (!this.#service) {
			throw new Error('ServiceService is not initialized');
		}
		return this.#service;
	}

	public set service(value: ServiceService) {
		this.#service = value;
	}

	public get payment() {
		if (!this.#payment) {
			throw new Error('PaymentService is not initialized');
		}
		return this.#payment;
	}

	public set payment(value: PaymentService) {
		this.#payment = value;
	}

	public get order() {
		if (!this.#order) {
			throw new Error('OrderService is not initialized');
		}
		return this.#order;
	}

	public set order(value: OrderService) {
		this.#order = value;
	}

	public get orderService() {
		if (!this.#orderService) {
			throw new Error('OrderServiceService is not initialized');
		}
		return this.#orderService;
	}

	public set orderService(value: OrderServiceService) {
		this.#orderService = value;
	}

	public get member() {
		if (!this.#member) {
			throw new Error('MemberService is not initialized');
		}
		return this.#member;
	}

	public set member(value: MemberService) {
		this.#member = value;
	}

	public get role() {
		if (!this.#role) {
			throw new Error('RoleService is not initialized');
		}
		return this.#role;
	}

	public set role(value: RoleService) {
		this.#role = value;
	}

	public get customer() {
		if (!this.#customer) {
			throw new Error('CustomerService is not initialized');
		}
		return this.#customer;
	}

	public set customer(value: CustomerService) {
		this.#customer = value;
	}

	public get businessProfile() {
		if (!this.#businessProfile) {
			throw new Error('BusinessProfileService is not initialized');
		}
		return this.#businessProfile;
	}

	public set businessProfile(value: BusinessProfileService) {
		this.#businessProfile = value;
	}

	public get absence() {
		if (!this.#absence) {
			throw new Error('AbsenceService is not initialized');
		}
		return this.#absence;
	}

	public set absence(value: AbsenceService) {
		this.#absence = value;
	}

	public get tariffPlan() {
		if (!this.#tariffPlan) {
			throw new Error('TariffPlanService is not initialized');
		}
		return this.#tariffPlan;
	}

	public set tariffPlan(value: TariffPlanService) {
		this.#tariffPlan = value;
	}

	public get tariffPlanHistory() {
		if (!this.#tariffPlanHistory) {
			throw new Error('TariffPlanHistoryService is not initialized');
		}
		return this.#tariffPlanHistory;
	}

	public set tariffPlanHistory(value: TariffPlanHistoryService) {
		this.#tariffPlanHistory = value;
	}

	public get plugin() {
		if (!this.#plugin) {
			throw new Error('pluginService is not initialized');
		}
		return this.#plugin;
	}

	public set plugin(value: PluginService) {
		this.#plugin = value;
	}

	public get tenantPlugin() {
		if (!this.#tenantPlugin) {
			throw new Error('tenantPluginService is not initialized');
		}
		return this.#tenantPlugin;
	}

	public set tenantPlugin(value: TenantPluginService) {
		this.#tenantPlugin = value;
	}

	public get balance() {
		if (!this.#balance) {
			throw new Error('balanceService is not initialized');
		}
		return this.#balance;
	}

	public set balance(value: BalanceService) {
		this.#balance = value;
	}

	public get product() {
		if (!this.#product) {
			throw new Error('ProductService is not initialized');
		}
		return this.#product;
	}

	public set product(value: ProductService) {
		this.#product = value;
	}

	public get productTag() {
		if (!this.#productTag) {
			throw new Error('ProductTagService is not initialized');
		}
		return this.#productTag;
	}

	public set productTag(value: ProductTagService) {
		this.#productTag = value;
	}

}
