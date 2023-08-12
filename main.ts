import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { findNoteStart, getFileName } from 'utils';

// Remember to rename these classes and interfaces!

interface FileNameContentSyncPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: FileNameContentSyncPluginSettings = {
	mySetting: 'default'
}

export default class FileNameContentSyncPlugin extends Plugin {
	isRenameInProgress: boolean = false;
	settings: FileNameContentSyncPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.vault.on('modify', (file) => {
			}),
		);

		this.registerEvent(
			this.app.workspace.on('file-open', (file) => {
				this.changeFileName(file as TFile)
			}),
		);

		this.registerEvent(
			this.app.vault.on('modify', (file: TFile) => {
				this.changeFileName(file as TFile)
			}),
		);

		this.addSettingTab(new FileNameContentSyncTab(this.app, this));

	}

	onunload() {

	}

	async changeFileName(file: TFile) {
		if (
			this.isRenameInProgress
			|| !(file instanceof TFile)
			|| file.extension !== 'md'
		) {
			return
		}
		const text = await this.app.vault.read(file)
		const content = text.split('\n')
		const startLine = findNoteStart(content)
		const fileName = getFileName(content, startLine)
		if (!fileName) return
		const newPath = `${file?.parent?.path}/${fileName}.md`;
		await this.app.fileManager.renameFile(file, newPath);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}



class FileNameContentSyncTab extends PluginSettingTab {
	plugin: FileNameContentSyncPlugin;

	constructor(app: App, plugin: FileNameContentSyncPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
