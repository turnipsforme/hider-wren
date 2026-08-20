import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface TabBarSettings {
	hideTabs: boolean;
	autoHideSingleTab: boolean;
}

const DEFAULT_SETTINGS: TabBarSettings = {
	hideTabs: false,
	autoHideSingleTab: false,
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
				void this.saveSettings();
				this.refresh();
			},
		});

		this.addSettingTab(new TabBarHiderSettingTab(this.app, this));
		this.registerEvent(this.app.workspace.on('layout-change', this.refresh));
		this.refresh();
	}

	onunload() {
		document.body.classList.remove('hider-wren-tabs');
	}

	saveSettings = async () => {
		await this.saveData(this.settings);
	};

	refresh = () => {
		let tabCount = 0;
		this.app.workspace.iterateRootLeaves(() => {
			tabCount += 1;
		});

		const autoHide = this.settings.autoHideSingleTab && tabCount === 1;
		document.body.classList.toggle('hider-wren-tabs', this.settings.hideTabs || autoHide);
	};
}

class TabBarHiderSettingTab extends PluginSettingTab {
	plugin: TabBarHider;

	constructor(app: App, plugin: TabBarHider) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Auto-hide with one tab')
			.setDesc('Hide the tab bar when this window has only one tab open.')
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.autoHideSingleTab)
					.onChange((value) => {
						this.plugin.settings.autoHideSingleTab = value;
						void this.plugin.saveSettings();
						this.plugin.refresh();
					});
			});
	}
}
