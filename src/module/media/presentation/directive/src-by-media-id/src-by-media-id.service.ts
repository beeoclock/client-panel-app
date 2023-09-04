import {inject, Injectable} from "@angular/core";
import {NgxIndexedDBService} from "ngx-indexed-db";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SrcByMediaIdService {

  private readonly ngxIndexedDBService = inject(NgxIndexedDBService);
  private readonly buffer: Map<string, string> = new Map<string, string>();

  /**
   *
   * @param key - mediaId
   */
  public async get(key: string): Promise<string | undefined> {
    const valueFromBuffet = this.buffer.get(key);
    if (valueFromBuffet) {
      return valueFromBuffet;
    }
    const stream$ = this.ngxIndexedDBService.getByKey<{ key: string; value: string; } | undefined>(
      'cache',
      this.buildKey(key)
    );
    const {value} = await firstValueFrom(stream$) ?? {};
    return value;
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
