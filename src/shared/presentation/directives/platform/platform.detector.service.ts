import {computed, DestroyRef, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {OS, PlatformInfo, Runtime} from './platform.types';

@Injectable({ providedIn: 'root' })
export class PlatformDetectorService {
	private platformId = inject(PLATFORM_ID);
	private destroyRef = inject(DestroyRef);
	private isBrowser = isPlatformBrowser(this.platformId);

	// 🇺🇦 signals для ОС та runtime
	private osSig = signal<OS>('unknown');
	private rtSig = signal<Runtime>('unknown');

	// 🇺🇦 публічні signals/computed
	readonly os = computed(() => this.osSig());
	readonly runtime = computed(() => this.rtSig());
	readonly info = computed<PlatformInfo>(() => ({ os: this.os(), runtime: this.runtime() }));

	public constructor() {
		if (!this.isBrowser) return;

		this.detectAll();

		// 🇺🇦 реагуємо на зміну PWA режиму
		const onModeChange = () => this.detectRuntime();
		const mm = window.matchMedia?.('(display-mode: standalone)');
		mm?.addEventListener?.('change', onModeChange);
		window.addEventListener('focus', onModeChange, { passive: true });
		window.addEventListener('pageshow', onModeChange, { passive: true });

		this.destroyRef.onDestroy(() => {
			mm?.removeEventListener?.('change', onModeChange as EventListener);
			window.removeEventListener('focus', onModeChange);
			window.removeEventListener('pageshow', onModeChange);
		});
	}

	private detectAll() { this.detectOS(); this.detectRuntime(); }

	private detectOS() {
		const ua = navigator.userAgent || '';
		const platform = navigator.platform || '';
		const iPadOS = platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1;

		let os: OS = 'unknown';
		if (/Android/i.test(ua)) os = 'android';
		else if (/iPad|iPhone|iPod/.test(ua) || iPadOS) os = 'ios';
		else if (/Mac/.test(platform)) os = 'mac';
		else if (/Win/.test(platform)) os = 'windows';
		else if (/Ubuntu/i.test(ua)) os = 'ubuntu';
		else if (/Linux/i.test(platform) || /X11; Linux/i.test(ua)) os = 'linux';

		this.osSig.set(os);
	}

	private detectRuntime() {
		let runtime: Runtime = 'unknown';

		// Capacitor
		const cap = (window as any).Capacitor;
		try {
			if (cap?.isNativePlatform?.()) runtime = 'capacitor';
			else if (cap?.getPlatform && ['ios','android'].includes(cap.getPlatform())) runtime = 'capacitor';
		} catch {}

		// Electron
		const w = window as any;
		if (runtime === 'unknown') {
			if (w?.process?.type === 'renderer' || w?.electronAPI || w?.require?.('electron')) {
				runtime = 'electron';
			}
		}

		// PWA / Web
		if (runtime === 'unknown') {
			const pwaStandalone = window.matchMedia?.('(display-mode: standalone)')?.matches;
			const iosStandalone = (navigator as any).standalone === true;
			runtime = (pwaStandalone || iosStandalone) ? 'pwa' : 'web';
		}

		this.rtSig.set(runtime);
	}

	// 🇺🇦 зручний предикат
	matches(os?: OS, runtime?: Runtime) {
		const i = this.info();
		return (os ? i.os === os : true) && (runtime ? i.runtime === runtime : true);
	}
}
