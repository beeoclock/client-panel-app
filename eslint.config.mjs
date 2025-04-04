import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	{
		ignores: ["projects/**/*"],
	},

	...compat.extends(
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@angular-eslint/recommended",
		"plugin:@angular-eslint/template/process-inline-templates",
	).map(config => ({
		...config,
		files: ["**/*.ts"],
	})),

	{
		files: ["**/*.ts"],

		rules: {
			"@typescript-eslint/no-namespace": "off",
			"@angular-eslint/directive-selector": ["off", {
				type: "attribute",
				prefix: "app",
				style: "camelCase",
			}],

			"@angular-eslint/component-class-suffix": ["off", {
				suffixes: ["Component", "Page"],
			}],

			"@angular-eslint/component-selector": ["off", {
				type: "element",
				prefix: "app",
				style: "kebab-case",
			}],

			"@typescript-eslint/no-restricted-imports": [
				"error",
				{
					"paths": [
						{
							"name": "@ionic/angular",
							"message": "Please import Ionic standalone components instead: `import {IonButton} from '@ionic/angular/standalone'`.",
							"allowTypeImports": true
						}
					]
				}
			],
		},
	},

	...compat.extends(
		"plugin:@angular-eslint/template/recommended",
		"plugin:@angular-eslint/template/accessibility",
	).map(config => ({
		...config,
		files: ["**/*.html"],
	})),

	{
		files: ["**/*.html"],
		rules: {},
	}
];
