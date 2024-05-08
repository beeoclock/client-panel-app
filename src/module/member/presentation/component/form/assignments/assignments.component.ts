import {ChangeDetectorRef, Component, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {NgIf} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AssignmentsForm} from "@member/presentation/form/member.form";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";
import {Reactive} from "@utility/cdk/reactive";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {IService} from "@src/module/service/domain";

@Component({
	selector: 'member-form-assignments',
	standalone: true,
	templateUrl: './assignments.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		NgIf,
		TranslateModule,
		SwitchComponent
	]
})
export class MemberFormAssignmentsComponent extends Reactive implements OnInit {

	@Input({required: true})
	public form!: AssignmentsForm;

	private readonly translateService = inject(TranslateService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly pushBoxService = inject(PushBoxService);

	public isNotFull = false;

	public ngOnInit(): void {
		this.updateIsNotFull();
		this.form.controls.service.controls.full.valueChanges.pipe(
			this.takeUntil(),
		).subscribe((test) => {
			console.log(test)
			this.updateIsNotFull();
		});
	}

	public updateIsNotFull(): void {
		this.isNotFull = this.form.controls.service.isNotFull;
		this.changeDetectorRef.detectChanges();
	}

	public async selectServices() {

		const {SelectServicePushBoxComponent} = await import("@service/presentation/push-box/select-service.push-box.component");

		const title = this.translateService.instant('member.form.assignments.service.select.title');

		const pushBoxWrapperComponentRef = await this.pushBoxService.buildItAsync({
			title,
			component: SelectServicePushBoxComponent,
			componentInputs: {
				selectedServiceList: this.form.controls.service.controls.include.value.map(({serviceId}) => ({_id: serviceId}))
			},
			button: {
				close: {
					text: this.translateService.instant('keyword.capitalize.done'),
					classList: ['text-blue-500', 'capitalize', 'hover:text-blue-600', 'transition-all']
				}
			}
		});

		const {renderedComponentRef} = pushBoxWrapperComponentRef.instance;

		if (renderedComponentRef?.instance instanceof SelectServicePushBoxComponent) {
			renderedComponentRef.instance.selectedServicesListener.pipe(this.takeUntil()).subscribe(() => {
				const {newSelectedServiceList} = renderedComponentRef.instance as {newSelectedServiceList: IService[]};
				const include = newSelectedServiceList.map(({_id}) => ({serviceId: _id}));
				this.form.controls.service.controls.include.patchValue(include);
				// this.pushBoxService.destroy$.next(SelectServicePushBoxComponent.name);
			});
		}

	}

}
