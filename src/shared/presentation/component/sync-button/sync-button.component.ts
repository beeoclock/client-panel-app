import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	inject,
	OnInit,
	signal,
	ViewEncapsulation
} from "@angular/core";
import {DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";

import {BaseSyncManager, ISyncManger} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {TimeAgoPipe} from "@shared/presentation/pipes/time-ago.pipe";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {explicitEffect} from "ngxtension/explicit-effect";
import {interval} from "rxjs";
import {tap} from "rxjs/operators";
import {injectNetwork} from "ngxtension/inject-network";

@Component({
	standalone: true,
	selector: 'sync-button-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		DatePipe,
		TranslatePipe,
		TimeAgoPipe,
	],
	host: {
		class: 'px-2 pb-4 pt-0'
	},
	template: `

		@if (isOffline()) {

			<div class="rounded-2xl border border-red-300 bg-red-100 flex flex-col">
				<button (click)="syncAll()"
						class="h-[48px] text-red-700 gap-2 p-2 px-3 rounded-2xl flex justify-start items-center hover:bg-red-200 cursor-pointer transition-all">
					<i class="bi bi-arrow-repeat text-xl"></i>
					<div class="flex flex-col items-start">
						<span class="text-xs">
							{{ 'keyword.capitalize.youOffline' | translate }}
						</span>
						<span class="text-xs">
							{{ lastSynchronizedIn() | date: 'dd.MM.yyyy HH:mm:ss' }}
						</span>
					</div>
				</button>
			</div>

		} @else {

			<div class="rounded-2xl border border-neutral-300 bg-neutral-50 flex flex-col">
				@if (isSyncing() && !isPaused()) {

					<button
						(click)="pauseAll()"
						class="h-[48px] w-full gap-2 text-black p-2 px-3 rounded-2xl flex justify-start items-center group">
						<i class="animate-spin bi bi-arrow-repeat text-xl group-hover:hidden"></i>
						<i class="bi bi-pause-circle hidden group-hover:block text-xl"></i>
						<div class="flex flex-col items-start w-full">
							<span class="text-xs">
							{{ 'keyword.capitalize.syncing' | translate }}
						</span>

						</div>
					</button>

				} @else {

					<button (click)="syncAll()"
							[title]="lastSynchronizedIn() | date: 'dd.MM.yyyy HH:mm:ss'"
							class="h-[48px] text-black gap-2 p-2 px-3 rounded-2xl flex justify-start items-center hover:bg-neutral-200 cursor-pointer transition-all">
						<i class="bi bi-arrow-repeat text-xl"></i>
						<div class="flex flex-col items-start">
							<span class="text-xs">
								{{ 'keyword.capitalize.synced' | translate }}
							</span>
							<span class="text-xs">
								@if (lastSynchronizedIn()) {
									{{ lastSynchronizedIn() | timeAgo }}
								}
							</span>
						</div>
					</button>

				}
			</div>

		}

	`
})
export class SyncButtonComponent implements OnInit {

	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly network = injectNetwork();

	public readonly isOffline = computed(() => {
		const online = this.network.online();
		return !online;
	});

	public readonly isPaused = toSignal(BaseSyncManager.isPaused$);
	public readonly isSyncing = toSignal(BaseSyncManager.isSyncing$);

	private readonly setTimeoutSubscription = interval(1_000).pipe(
		takeUntilDestroyed(),
		tap(() => {
			this.detectChanges();
		})
	).subscribe();

	public constructor() {
		explicitEffect([this.isSyncing], () => {
			this.detectChanges();
			this.resetState();
		});
	}

	public readonly lastSynchronizedIn = signal(new Date(0).toISOString());

	public readonly state: Map<string, 'wait' | 'done' | ISyncManger> = new Map<string, 'wait' | 'done' | ISyncManger>();

	public syncAll() {
		if (BaseSyncManager.isPaused$.value) {
			BaseSyncManager.resumeAll().then(() => {
				console.log('resumeAll done');
			});
		} else {
			BaseSyncManager.syncAll().then(() => {
				console.log('syncAll done');
			});
		}
	}

	public pauseAll() {
		BaseSyncManager.pauseAll().then(() => {
			console.log('pauseAll done');
		});
	}

	public resetState() {
		BaseSyncManager.register.forEach((syncManger) => {
			this.state.set(syncManger.moduleName, 'wait');
		});
	}

	public get params() {
		return {
			modulesCount: this.state.size,
			modulesSynced: Array.from(this.state.values()).filter((value) => value !== 'wait').length,
		}
	}

	public ngOnInit() {

		BaseSyncManager.register.forEach((syncManger) => {
			this.state.set(syncManger.moduleName, 'wait');
		});

	}

	private detectChanges() {

		const {syncState} = BaseSyncManager.getSyncManager('businessProfile');
		const value = syncState?.options?.updatedSince || new Date(0).toISOString();
		this.lastSynchronizedIn.set(value);
		this.changeDetectorRef.detectChanges();
	}


}
