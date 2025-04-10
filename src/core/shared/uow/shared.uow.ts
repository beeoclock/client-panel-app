import {ServiceService} from "@tenant/service/domain/service/service.service";
import {PaymentService} from "@tenant/order/payment/domain/service/payment.service";
import {OrderService} from "@tenant/order/order/domain/service/order.service";
import {MemberService} from "@tenant/member/domain/service/member.service";
import {CustomerService} from "@tenant/customer/domain/service/customer.service";
import {BusinessProfileService} from "@tenant/business-profile/domain/service/business-profile.service";
import {AbsenceService} from "@tenant/absence/domain/service/absence.service";
import {TariffPlanService} from "@tenant/tariff-plan/domain/service/tariff-plan.service";
import {TariffPlanHistoryService} from "@tenant/tariff-plan-history/domain/service/tariff-plan-history.service";
import {OrderServiceService} from "@tenant/order/order-service/domain/service/order-service.service";

/**
 * Shared Unit of Work
 * Use this class to access services from different modules, without importing them directly
 */
export class SharedUow {

	#service!: ServiceService;
	#payment!: PaymentService;
	#order!: OrderService;
	#orderService!: OrderServiceService;
	#member!: MemberService;
	#customer!: CustomerService;
	#businessProfile!: BusinessProfileService;
	#absence!: AbsenceService;
	#tariffPlan!: TariffPlanService;
	#tariffPlanHistory!: TariffPlanHistoryService;

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
			throw new Error('tariffPlanService is not initialized');
		}
		return this.#tariffPlan;
	}

	public set tariffPlan(value: TariffPlanService) {
		this.#tariffPlan = value;
	}

	public get tariffPlanHistory() {
		if (!this.#tariffPlanHistory) {
			throw new Error('tariffPlanHistoryService is not initialized');
		}
		return this.#tariffPlanHistory;
	}

	public set tariffPlanHistory(value: TariffPlanHistoryService) {
		this.#tariffPlanHistory = value;
	}

}
