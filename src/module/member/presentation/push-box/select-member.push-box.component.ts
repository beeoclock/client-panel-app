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
import {TranslateModule} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@utility/cdk/reactive";
import {firstValueFrom} from "rxjs";
import {MemberExternalListComponent} from "@member/presentation/component/external/list/list.component";
import {
	MobileLayoutListComponent
} from "@member/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {IMember} from "@core/business-logic/member/interface/i.member";

@Component({
	selector: 'utility-modal-select-member-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		MemberExternalListComponent,
	],
	template: `
		<member-external-list-component [mobileMode]="true"/>
	`
})
export class SelectMemberPushBoxComponent extends Reactive implements OnInit, AfterViewInit {

	public readonly selectedMemberList = input<IMember.Entity[]>([]);

	@Input()
	public newSelectedMemberList: IMember.Entity[] = [];

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
		const {0: cardListComponent} = mobileLayoutListComponent.cardListComponents();
		cardListComponent.selectedIds = this.newSelectedMemberList.map(({_id}) => _id);
		cardListComponent.tableService.showAction.doFalse();
		cardListComponent.tableService.showSelectedStatus.doTrue();
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

	public async submit(): Promise<IMember.Entity[]> {
		return new Promise((resolve) => {
			resolve(this.newSelectedMemberList);
		});
	}

	public select(member: IMember.Entity): void {
		if (!this.multiple) {
			if (this.newSelectedMemberList.length) {
				this.newSelectedMemberList.splice(0, 1);
			}
		}
		this.newSelectedMemberList.push({...member});

		this.selectedMembersListener.emit();
		this.changeDetectorRef.detectChanges();
	}

	public deselect(member: IMember.Entity): void {
		this.newSelectedMemberList = this.newSelectedMemberList.filter(({_id}) => _id !== member._id);
		this.selectedMembersListener.emit();
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(member: IMember.Entity): boolean {
		return this.newSelectedMemberList.some(({_id}) => _id === member._id);
	}

	public isNotSelected(member: IMember.Entity): boolean {
		return !this.isSelected(member);
	}
}
