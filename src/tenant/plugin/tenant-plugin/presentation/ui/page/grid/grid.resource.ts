import {computed, inject, Injectable, resource, ResourceRef} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {ITenantPlugin} from "@tenant/plugin/tenant-plugin/domain";
import {IPlugin} from "@tenant/plugin/plugin/domain";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";

@Injectable()
export class GridResource {

	private readonly sharedUow = inject(SharedUow);

	public readonly store: ResourceRef<{
		items: IPlugin.EntityRaw[],
		totalSize: number
	}> = resource({

		// Define a reactive request computation.
		// The request value recomputes whenever any read signals change.
		request: () => ({}),

		defaultValue: {
			items: [],
			totalSize: 0,
		},

		// Define an async loader that retrieves data.
		// The resource calls this function every time the `request` value changes.
		loader: async ({request}) => {

			const {items, totalSize} = await this.sharedUow.plugin.repository.findAsync();

			console.log({items, totalSize});

			return {items, totalSize};

		},

	});

	public readonly attached: ResourceRef<{
		items: ITenantPlugin.EntityRaw[],
		totalSize: number
	}> = resource({

		// Define a reactive request computation.
		// The request value recomputes whenever any read signals change.
		request: () => ({}),

		defaultValue: {
			items: [],
			totalSize: 0,
		},

		// Define an async loader that retrieves data.
		// The resource calls this function every time the `request` value changes.
		loader: async ({request}) => {

			const {items, totalSize} = await this.sharedUow.tenantPlugin.repository.findAsync();

			console.log({items, totalSize});

			return {items, totalSize};

		},

	});

	public readonly isLoading = computed(() => {
		return this.store.isLoading() || this.attached.isLoading();
	})

	public readonly merged = computed(() => {
		const attached = this.attached.value();
		const store = this.store.value();

		const merged = [...attached.items.map((raw) => ETenantPlugin.fromRaw(raw))];

		store.items.forEach((plugin) => {

			if (merged.find(({plugin: {slug}}) => slug === plugin.slug)) {
				return;
			}

			const {syncedAt, ...fakeTenantPlugin} = plugin;

			const notAttachedPlugin = ETenantPlugin.createStoreItem({
				plugin: fakeTenantPlugin,
				config: {}
			})

			merged.push(notAttachedPlugin);

		});

		return {
			items: merged,
			totalSize: merged.length,
		};
	});

	public reload() {
		this.store.reload();
		this.attached.reload();
	}

}
