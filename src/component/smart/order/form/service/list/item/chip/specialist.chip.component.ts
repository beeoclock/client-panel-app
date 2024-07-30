import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewEncapsulation
} from "@angular/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {IonContent, IonItem, IonLabel, IonList, IonPopover} from "@ionic/angular/standalone";
import {FormControl} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {RIMember} from "@member/domain";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {MemberState} from "@member/state/member/member.state";
import {ITableState} from "@utility/domain/table.state";
import ObjectID from "bson-objectid";
import {Reactive} from "@utility/cdk/reactive";
import {ISpecialist} from "@service/domain/interface/i.specialist";
import {SpecialistModel} from "@service/domain/model/specialist.model";

@Component({
	selector: 'app-specialist-chip-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		FormInputComponent,
		IonContent,
		IonItem,
		IonLabel,
		IonList,
		IonPopover,
		NgForOf,
		NgIf,
	],
	template: `
		<button
			[id]="'select-specialist' + id"
			class="p-1 rounded-lg border border-gray-200 justify-center items-center flex">
			<div
				class="rounded-full bg-beeColor-400 min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 flex justify-center items-center">
				<ng-container *ngIf="specialistFormControl.value?.member?.avatar?.url; else InitialsTemplate">
					<img [src]="specialistFormControl.value?.member?.avatar?.url"
						 class="min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 rounded-full object-cover"
						 alt="">
				</ng-container>
				<ng-template #InitialsTemplate>
					<div
						class="text-white text-xs font-bold">{{ specialistFormControl.value?.member?.firstName?.[0] ?? '' }}
					</div>
					<div
						class="text-white text-xs font-bold">{{ specialistFormControl.value?.member?.lastName?.[0] ?? '' }}
					</div>
				</ng-template>
			</div>
			<div class="text-slate-900 text-sm font-normal px-2">
				{{ specialistFormControl.value?.member?.firstName }}
			</div>
		</button>
		<ion-popover #selectSpecialistPopover [trigger]="'select-specialist' + id">
			<ng-template>
				<ion-list>
					<ion-item [button]="true" lines="full" [detail]="false" *ngFor="let member of members.items"
							  (click)="setMemberAsSpecialist(member);selectSpecialistPopover.dismiss()">
						<div
							slot="start"
							class="rounded-full bg-beeColor-400 min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 flex justify-center items-center">
							<ng-container *ngIf="member?.avatar?.url; else InitialsTemplate">
								<img [src]="member?.avatar?.url"
									 class="min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 rounded-full object-cover"
									 alt="">
							</ng-container>
							<ng-template #InitialsTemplate>
								<div class="text-white text-xs font-bold">{{ member?.firstName?.[0] ?? '' }}
								</div>
								<div class="text-white text-xs font-bold">{{ member?.lastName?.[0] ?? '' }}
								</div>
							</ng-template>
						</div>
						<ion-label>{{ member.firstName }}</ion-label>
					</ion-item>
				</ion-list>
			</ng-template>
		</ion-popover>
	`
})
export class SpecialistChipComponent extends Reactive implements OnInit {

	@Input()
	public initialValue: RIMember | undefined = undefined;

	@Input()
	public id: string = ObjectID().toHexString();

	@SelectSnapshot(MemberState.tableState)
	public readonly members!: ITableState<RIMember>;

	@Output()
	public readonly specialistChanges = new EventEmitter<ISpecialist>();

	public readonly specialistFormControl = new FormControl<ISpecialist | null>(null);

	public ngOnInit() {
		this.initialValue && this.setMemberAsSpecialist(this.initialValue)
	}

	public setMemberAsSpecialist(member: RIMember) {
		const specialist = SpecialistModel.create({member});
		this.specialistFormControl.setValue(specialist);
		this.specialistChanges.emit(specialist);
	}

}
