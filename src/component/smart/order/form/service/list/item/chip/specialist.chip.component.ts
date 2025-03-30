import {ChangeDetectionStrategy, Component, input, OnInit, output, ViewEncapsulation} from "@angular/core";
import {IonItem, IonLabel, IonList, IonPopover} from "@ionic/angular/standalone";
import {FormControl} from "@angular/forms";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import ObjectID from "bson-objectid";
import {Reactive} from "@utility/cdk/reactive";
import {ISpecialist} from "@src/core/business-logic/service/interface/i.specialist";
import {SpecialistModel} from "@src/core/business-logic/service/model/specialist.model";
import {TranslateModule} from "@ngx-translate/core";
import {IMember} from "@core/business-logic/member/interface/i.member";
import {MemberDataState} from "@tenant/member/presentation/state/data/member.data.state";

@Component({
	selector: 'app-specialist-chip-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IonItem,
		IonLabel,
		IonList,
		IonPopover,
		TranslateModule,
	],
	template: `

		<!-- Button to show selected specialist and place where user can change selected specialist -->
		<button
			[id]="'select-specialist-' + id()"
			class="p-1 rounded-lg border border-gray-200 justify-center items-center flex">

			@if (specialistFormControl.value; as specialist) {

				<div
					class="rounded-full bg-beeColor-400 min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 flex justify-center items-center">
					@if (specialist.member.avatar?.url) {

						<img [src]="specialist.member.avatar?.url"
							 class="min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 rounded-full object-cover"
							 alt="">
					} @else {

						<div
							class="text-white text-xs font-bold">{{ (specialist.member.firstName ?? '')[0] }}
						</div>
						<div
							class="text-white text-xs font-bold">{{ (specialist.member.lastName ?? '')[0] }}
						</div>

					}
				</div>
				<div class="text-slate-900 text-sm font-normal px-2">
					{{ specialist.member.firstName }}
				</div>

			} @else {
				<!-- Error: No assigned specialist -->
				<div class="text-red-500 text-sm font-normal px-2 py-1">
					{{ 'order.form.chip.specialist.noAssignedSpecialist' | translate }}
				</div>
			}
		</button>

		<!-- Control to select specialist -->
		<ion-popover #selectSpecialistPopover [trigger]="'select-specialist-' + id()">
			<ng-template>
				<ion-list>
					@for (member of members; track member._id) {
						<ion-item [button]="true" lines="full" [detail]="false"
								  (click)="setMemberAsSpecialist(member);selectSpecialistPopover.dismiss()">
							<div
								slot="start"
								class="rounded-full bg-beeColor-400 min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 flex justify-center items-center">
								@if (member.avatar?.url) {
									<img [src]="member?.avatar?.url"
										 class="min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 rounded-full object-cover"
										 alt="">
								} @else {

									<div class="text-white text-xs font-bold">{{ member.firstName?.[0] ?? '' }}
									</div>
									<div class="text-white text-xs font-bold">{{ member.lastName?.[0] ?? '' }}
									</div>
								}
							</div>
							<ion-label>{{ member.firstName }}</ion-label>
						</ion-item>
					}
				</ion-list>
			</ng-template>
		</ion-popover>
	`
})
export class SpecialistChipComponent extends Reactive implements OnInit {

	public readonly initialValue = input<SpecialistModel | IMember.EntityRaw | null>(null);

	public readonly id = input<string>(ObjectID().toHexString());

	@SelectSnapshot(MemberDataState.activeMembers)
	public readonly members!: IMember.EntityRaw[];

	public readonly specialistChanges = output<ISpecialist>();

	public readonly specialistFormControl = new FormControl<ISpecialist | null>(null);

	public ngOnInit() {
		this.initSpecialist();
	}

	public initSpecialist() {
		const initialValue = this.initialValue();
		if (initialValue instanceof SpecialistModel) {
			this.setSpecialist(initialValue);
		} else {
			this.setMemberAsSpecialist(initialValue);
		}
	}

	public setMemberAsSpecialist(member: IMember.EntityRaw | null) {
		if (!member) {
			return;
		}
		const specialist = SpecialistModel.create({member});
		this.setSpecialist(specialist);
	}

	public setSpecialist(specialist: ISpecialist | null) {
		if (!specialist) {
			return;
		}
		this.specialistFormControl.setValue(specialist);
		this.specialistChanges.emit(specialist);
	}

}
