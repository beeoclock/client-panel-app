import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	inject,
	Input,
	input,
	OnInit,
	Output,
	QueryList,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@utility/cdk/reactive";
import {RIMember} from "@member/domain";
import {firstValueFrom} from "rxjs";
import {MemberExternalListComponent} from "@member/presentation/component/external/list/list.component";
import {
	MobileLayoutListComponent
} from "@member/presentation/component/list/layout/mobile/mobile.layout.list.component";

@Component({
	selector: 'utility-modal-select-member-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgForOf,
		LoaderComponent,
		NgIf,
		TranslateModule,
		CurrencyPipe,
		HumanizeDurationPipe,
		PrimaryButtonDirective,
		MemberExternalListComponent,
	],
	template: `
		<member-external-list-component [mobileMode]="true"/>
	`
})
export class SelectMemberPushBoxComponent extends Reactive implements OnInit, AfterViewInit {

	public readonly selectedMemberList = input<RIMember[]>([]);

	@Input()
	public newSelectedMemberList: RIMember[] = [];

	@Output()
	public readonly selectedMembersListener = new EventEmitter<void>();

	readonly memberExternalListComponent = viewChild.required(MemberExternalListComponent);

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly logger = inject(NGXLogger);

	public multiple = true;

	public ngOnInit(): void {

		this.newSelectedMemberList = [...(this.selectedMemberList() ?? [])];

	}

	public ngAfterViewInit() {
		this.initializeCustomConfiguration().then();
	}

	private async initializeCustomConfiguration() {
		const mobileLayoutListComponents = await firstValueFrom<QueryList<MobileLayoutListComponent>>(this.memberExternalListComponent().mobileLayoutListComponents.changes);
		const {first: mobileLayoutListComponent} = mobileLayoutListComponents;
		const {first: cardListComponent} = mobileLayoutListComponent.cardListComponents();
		cardListComponent.selectedIds = this.newSelectedMemberList.map(({_id}) => _id);
		// cardListComponent.showAction.doFalse();
		// cardListComponent.showSelectedStatus.doTrue();
		cardListComponent.goToDetailsOnSingleClick = false;
		cardListComponent.singleClickEmitter.pipe(this.takeUntil()).subscribe((item) => {
			if (this.isSelected(item)) {
				this.deselect(item);
			} else {
				this.select(item);
			}
			cardListComponent.selectedIds = this.newSelectedMemberList.map(({_id}) => _id);
			cardListComponent.changeDetectorRef.detectChanges();
		});
	}

	public async submit(): Promise<RIMember[]> {
		return new Promise((resolve) => {
			resolve(this.newSelectedMemberList);
		});
	}

	public select(member: RIMember): void {
		if (!this.multiple) {
			if (this.newSelectedMemberList.length) {
				this.newSelectedMemberList.splice(0, 1);
			}
		}
		this.newSelectedMemberList.push({...member});

		this.selectedMembersListener.emit();
		this.changeDetectorRef.detectChanges();
	}

	public deselect(member: RIMember): void {
		this.newSelectedMemberList = this.newSelectedMemberList.filter(({_id}) => _id !== member._id);
		this.selectedMembersListener.emit();
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(member: RIMember): boolean {
		return this.newSelectedMemberList.some(({_id}) => _id === member._id);
	}

	public isNotSelected(member: RIMember): boolean {
		return !this.isSelected(member);
	}
}
