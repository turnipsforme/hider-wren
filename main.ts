import { Plugin } from 'obsidian';

interface TabBarSettings {
	hideTabs: boolean;
}

const DEFAULT_SETTINGS: TabBarSettings = {
	hideTabs: false,
};

export default class TabBarHider extends Plugin {
	settings: TabBarSettings;

	async onload() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

		this.addCommand({
			id: 'toggle-tab-bar',
			name: 'Toggle tab bar',
			callback: () => {
				this.settings.hideTabs = !this.settings.hideTabs;
				void this.saveData(this.settings);
				this.refresh();
			},
		});

		this.refresh();
	}

	onunload() {
		document.body.classList.remove('hider-wren-tabs');
	}

	refresh = () => {
		document.body.classList.toggle('hider-wren-tabs', this.settings.hideTabs);
	};
}
