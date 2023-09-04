import {inject, Injectable} from "@angular/core";
import {NgxIndexedDBService} from "ngx-indexed-db";
import {firstValueFrom} from "rxjs";
import {ItemMediaApiAdapter} from "@module/media/adapter/external/api/item.media.api.adapter";

@Injectable({
	providedIn: 'root'
})
export class SrcByMediaIdService {

	private readonly ngxIndexedDBService = inject(NgxIndexedDBService);

	private readonly itemMediaApiAdapter = inject(ItemMediaApiAdapter);
	private readonly buffer: Map<string, string> = new Map<string, string>();

	/**
	 *
	 * @param key - mediaId
	 */
	public async get(key: string): Promise<string | undefined> {

		// Get from buffer

		const valueFromBuffet = this.buffer.get(key);

		if (valueFromBuffet) {
			return valueFromBuffet;
		}

		// Get from cache

		const stream$ = this.ngxIndexedDBService.getByKey<{ key: string; value: string; } | undefined>(
			'cache',
			this.buildKey(key)
		);

		const {value} = await firstValueFrom(stream$) ?? {};

		if (value) {
			return value;
		}

		// Get from API

		const {media} = await this.itemMediaApiAdapter.executeAsync(key) ?? {};

		if (media) {

			await this.set(key, media);

		}

		return media;

	}

	/**
	 *
	 * @param key - mediaId
	 * @param value - src
	 */
	public async set(key: string, value: string): Promise<void> {
		this.buffer.set(key, value);
		await firstValueFrom(this.ngxIndexedDBService.update('cache', {
			key: this.buildKey(key),
			value,
		}));
	}

	/**
	 *
	 * @param key - mediaId
	 */
	public async delete(key: string): Promise<void> {
		this.buffer.delete(key);
		await firstValueFrom(this.ngxIndexedDBService.delete('cache', this.buildKey(key)));
	}

	/**
	 *
	 * @param key - mediaId
	 * @private
	 */
	private buildKey(key: string): string {
		return `media.${key}`;
	}

}
