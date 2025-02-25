import {Injectable} from "@angular/core";
import {ServiceService} from "@core/business-logic/service/service/service.service";
import {PaymentService} from "@core/business-logic/payment/service/payment.service";
import {OrderService} from "@core/business-logic/order/service/order.service";
import {MemberService} from "@core/business-logic/member/service/member.service";
import {CustomerService} from "@core/business-logic/customer/service/customer.service";
import {BusinessProfileService} from "@core/business-logic/business-profile/service/business-profile.service";
import {AbsenceService} from "@core/business-logic/absence/service/absence.service";

/**
 * Shared Unit of Work
 * Use this class to access services from different modules, without importing them directly
 */
@Injectable({
	providedIn: 'root'
})
export class SharedUow {

	#service!: ServiceService;
	#payment!: PaymentService;
	#order!: OrderService;
	#member!: MemberService;
	#customer!: CustomerService;
	#businessProfile!: BusinessProfileService;
	#absence!: AbsenceService;

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

}
