import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {map} from "rxjs";
import {THEME} from "@src/token";

export enum ThemeEnum {
	light = 'light',
	dark = 'dark'
}

type ThemeType = 'dark' | 'light';

@Injectable({
	providedIn: "root"
})
export class ThemeService {

	private readonly document = inject(DOCUMENT);
	public readonly THEME = inject(THEME);

	constructor() {
		const theme = localStorage.getItem('theme') as ThemeEnum;
		if (theme) {
			this.THEME.next(theme);
		}
	}

	public readonly isDark$ = this.THEME.pipe(
		map((theme: string) => theme === 'dark')
	);

	public readonly isLight$ = this.THEME.pipe(
		map((theme: string) => theme === 'light')
	);

	public get theme(): ThemeType {
		return this.THEME.getValue();
	}

	public readonly themes = [ThemeEnum.light, ThemeEnum.dark];

	public get isDark(): boolean {
		return this.theme === 'dark';
	}

	public get isLight(): boolean {
		return this.theme === 'light';
	}

	public initialize(): void {
		this.initHandler();
	}

	public toggleTheme(theme: ThemeEnum): void {
		this.THEME.next(theme);
	}

	private initHandler(): void {
		this.THEME.subscribe(this.setTheme.bind(this));
	}

	private setTheme(theme: ThemeEnum): void {
		localStorage.setItem('theme', theme);
		if (theme === ThemeEnum.dark) {
			this.document.documentElement.classList.add(ThemeEnum.dark);
		} else {
			this.document.documentElement.classList.remove(ThemeEnum.dark);
		}
	}

}
