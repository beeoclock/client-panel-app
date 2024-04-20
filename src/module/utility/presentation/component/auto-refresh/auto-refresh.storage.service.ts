import {Injectable} from "@angular/core";

@Injectable({
	providedIn: 'root'
})
export class AutoRefreshStorageService {

	private static key = 'utility-auto-refresh-component';
	private readonly storage = localStorage;

	public get(key: string): string | null {
		const value = this.storage.getItem(AutoRefreshStorageService.key);
		return value ? JSON.parse(value)[key] : null;
	}

	public set(key: string, value: string): void {
		const data = JSON.parse(this.storage.getItem(AutoRefreshStorageService.key) || '{}');
		data[key] = value;
		this.storage.setItem(AutoRefreshStorageService.key, JSON.stringify(data));
	}

	public remove(key: string): void {
		const data = JSON.parse(this.storage.getItem(AutoRefreshStorageService.key) || '{}');
		delete data[key];
		this.storage.setItem(AutoRefreshStorageService.key, JSON.stringify(data));
	}

	public clear(): void {
		this.storage.removeItem(AutoRefreshStorageService.key);
	}

}
