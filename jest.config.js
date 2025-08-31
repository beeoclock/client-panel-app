// jest.config.js
export default {
	preset: 'jest-preset-angular',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
	transform: {
		'^.+\\.(ts|mjs|js|html)$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.spec.json',
				useESM: true,                 // 👈 required for import.meta
				isolatedModules: true,
				stringifyContentPathRegex: '\\.html$'
			}
		]
	},
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^@src/(.*)$': '<rootDir>/src/$1',
		'^@environment/(.*)$': '<rootDir>/src/environment/$1',
		'^@asset/(.*)$': '<rootDir>/src/asset/$1',
		'^@scss/(.*)$': '<rootDir>/src/asset/scss/$1',
		'^@icon/(.*)$': '<rootDir>/src/asset/icon/$1',
		'^@app/(.*)$': '<rootDir>/src/app/$1',
		'^@module/(.*)$': '<rootDir>/src/module/$1',
		'^@shared/(.*)$': '<rootDir>/src/shared/$1',
		'^@tenant/(.*)$': '<rootDir>/src/tenant/$1',
		'^@core/(.*)$': '<rootDir>/src/core/$1',
		'^@shared-kernel/(.*)$': '<rootDir>/src/shared-kernel/$1',
		'^@identity/(.*)$': '<rootDir>/src/identity/$1'
	}
};
