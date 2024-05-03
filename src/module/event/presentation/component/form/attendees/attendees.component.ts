import {Component, inject, Input} from '@angular/core';
import {AttendantComponent} from '@event/presentation/component/form/attendees/attendant/attendant.component';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {AttendeesForm} from "@event/presentation/form/attendant.form";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {IsNewCustomerEnum} from "@utility/domain/enum";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'event-attendees-component',
	templateUrl: './attendees.component.html',
	standalone: true,
	imports: [
		AttendeesComponent,
		AttendantComponent,
		NgForOf,
		TranslateModule,
		NgIf,
		PrimaryLinkButtonDirective
	],
})
export class AttendeesComponent extends Reactive {

	@Input()
	public form!: AttendeesForm;

	private readonly pushBoxService = inject(PushBoxService);

	public remove(index: number): void {

		this.form.removeAt(index);

		if (this.form.controls.length === 0) {
			this.form.pushNewOne();
		}

	}

	public async selectCustomer() {
		const {SelectCustomerPushBoxComponent} = await import("@customer/presentation/push-box/select-customer.push-box.component");

		const pushBoxWrapperComponentRef = await this.pushBoxService.buildItAsync({
			component: SelectCustomerPushBoxComponent,
		});

		const {renderedComponentRef} = pushBoxWrapperComponentRef.instance;

		if (renderedComponentRef?.instance instanceof SelectCustomerPushBoxComponent) {
			renderedComponentRef.instance.selectedCustomerListener.pipe(this.takeUntil()).subscribe(() => {

				const {newSelectedServiceList} = renderedComponentRef.instance;

				this.form.controls[0].patchValue({
					customer: newSelectedServiceList[0]
				});
				this.form.controls[0].toggleIsNewCustomer(IsNewCustomerEnum.NO);
				this.form.controls[0].controls.customer.disable();

				this.pushBoxService.destroy$.next(SelectCustomerPushBoxComponent.name);
			});
		}

	}

}
