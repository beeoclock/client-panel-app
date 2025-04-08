import {
	ChangeDetectorRef,
	Component,
	EnvironmentInjector,
	inject,
	Input,
	OnInit,
	ViewEncapsulation
} from "@angular/core";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AssignmentsForm} from "@tenant/member/presentation/form/member.form";
import {SwitchComponent} from "@shared/presentation/component/switch/switch.component";
import {Reactive} from "@core/cdk/reactive";
import {WhacAMoleProvider} from "@shared/presentation/whac-a-mole/whac-a-mole.provider";
import {IService} from "@tenant/service/domain/interface/i.service";

@Component({
	selector: 'member-form-assignments',
	standalone: true,
	templateUrl: './assignments.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		SwitchComponent
	]
})
export class MemberFormAssignmentsComponent extends Reactive implements OnInit {

	@Input({required: true})
	public form!: AssignmentsForm;

	private readonly translateService = inject(TranslateService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly environmentInjector = inject(EnvironmentInjector);

	public isNotFull = false;

	public ngOnInit(): void {
		this.updateIsNotFull();
		this.form.controls.service.controls.full.valueChanges.pipe(
			this.takeUntil(),
		).subscribe(() => {
			this.updateIsNotFull();
		});
	}

	public updateIsNotFull(): void {
		this.isNotFull = this.form.controls.service.isNotFull;
		this.changeDetectorRef.detectChanges();
	}

	public async selectServices() {

		const {SelectServiceWhacAMoleComponent} = await import("@tenant/service/presentation/push-box/select-service.whac-a-mole.component");

		const title = this.translateService.instant('member.form.assignments.service.select.title');

		const pushBoxWrapperComponentRef = await this.whacAMaleProvider.buildItAsync({
			title,
			component: SelectServiceWhacAMoleComponent,
			componentInputs: {
				selectedServiceList: this.form.controls.service.controls.include.value.map(({service}) => service)
			},
			button: {
				close: {
					text: this.translateService.instant('keyword.capitalize.done'),
					classList: ['text-blue-500', 'capitalize', 'hover:text-blue-600', 'transition-all']
				}
			},
			options: {
				environmentInjector: this.environmentInjector,
			}
		});

		if (!pushBoxWrapperComponentRef) {
			return;
		}

		const {renderedComponentRef} = pushBoxWrapperComponentRef.instance;

		if (renderedComponentRef?.instance instanceof SelectServiceWhacAMoleComponent) {
			renderedComponentRef.instance.selectedServicesListener.pipe(this.takeUntil()).subscribe(() => {
				const {newSelectedServiceList} = renderedComponentRef.instance as {newSelectedServiceList: IService.DTO[]};
				const include = newSelectedServiceList.map((service) => ({service}));
				this.form.controls.service.controls.include.patchValue(include);
			});
		}

	}

}
