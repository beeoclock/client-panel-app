import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {IsOnlineService} from "@utility/cdk/is-online.service";
import {AsyncPipe, DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {SyncManagerService} from "@core/system/infrastructure/database/_indexedDB/sync-manager.indexedDB.database";
import {TimeAgoPipe} from "@utility/presentation/pipes/time-ago.pipe";
import {Reactive} from "@utility/cdk/reactive";
import {setIntervals$} from "@utility/domain/timer";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";

@Component({
	standalone: true,
	selector: 'sync-button-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		DatePipe,
		TranslatePipe,
		TimeAgoPipe
	],
	host: {
		class: 'px-3 pb-4 pt-0'
	},
	template: `

		@if (isOffline$ | async) {

			<div class="rounded-2xl border border-red-300 bg-red-100 flex flex-col">
				<button (click)="syncAll()"
						class="h-[48px] text-red-700 gap-2 p-2 px-3 rounded-2xl flex justify-start items-center hover:bg-red-200 cursor-pointer transition-all">
					<i class="bi bi-arrow-repeat text-xl"></i>
					<div class="flex flex-col items-start">
						<span class="text-xs">
							{{ 'keyword.capitalize.youOffline' | translate }}
						</span>
						<span class="text-xs">
							{{ syncManagerService.lastSynchronizedIn | date: 'dd.MM.yyyy HH:mm:ss' }}
						</span>
					</div>
				</button>
			</div>

		} @else {

			<div class="rounded-2xl border border-neutral-300 bg-neutral-50 flex flex-col">
				@if (isSyncing$ | async) {

					<button
						(click)="pauseAll()"
						class="h-[48px] w-full gap-2 text-black p-2 px-3 rounded-2xl flex justify-start items-center group">
						<i class="animate-spin bi bi-arrow-repeat text-xl group-hover:hidden"></i>
						<i class="bi bi-pause-circle hidden group-hover:block text-xl"></i>
						<span class="text-xs">
							{{ 'keyword.capitalize.syncing' | translate }}
						</span>
					</button>

				} @else {

					<button (click)="syncAll()"
							[title]="syncManagerService.lastSynchronizedIn | date: 'dd.MM.yyyy HH:mm:ss'"
							class="h-[48px] text-black gap-2 p-2 px-3 rounded-2xl flex justify-start items-center hover:bg-neutral-200 cursor-pointer transition-all">
						<i class="bi bi-arrow-repeat text-xl"></i>
						<div class="flex flex-col items-start">
							<span class="text-xs">
								{{ 'keyword.capitalize.synced' | translate }}
							</span>
							<span class="text-xs">
								@if (syncManagerService.lastSynchronizedIn) {
									{{ syncManagerService.lastSynchronizedIn | timeAgo }}
								}
							</span>
						</div>
					</button>

				}
			</div>

		}

	`
})
export class SyncButtonComponent extends Reactive implements OnInit {

	private readonly isOnlineService = inject(IsOnlineService);
	protected readonly syncManagerService = inject(SyncManagerService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly isOffline$ = this.isOnlineService.isOffline$;
	// public readonly isSyncing$ = this.syncManagerService.isSyncing$;
	public readonly isSyncing$ = BaseSyncManager.isSyncing$;

	public syncAll() {
		if (BaseSyncManager.isPaused$.value) {
			BaseSyncManager.resumeAll().then(() => {
				console.log('resumeAll done');
			});
			return;
		}
		BaseSyncManager.syncAll().then(() => {
			console.log('syncAll done');
		});
		// this.syncManagerService.syncAll().then();
	}

	public pauseAll() {
		BaseSyncManager.pauseAll().then(() => {
			console.log('pauseAll done');
		});
		// this.syncManagerService.pauseAll().then();
	}

	public ngOnInit() {
		setIntervals$(() => {
			this.changeDetectorRef.detectChanges();
		}, 5_000).pipe(this.takeUntil()).subscribe();
	}

}
