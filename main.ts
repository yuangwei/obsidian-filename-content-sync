import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { findNoteStart, getFileName } from 'utils';

// Remember to rename these classes and interfaces!

interface FileNameContentSyncPluginSettings {
	path: string;
}

const DEFAULT_SETTINGS: FileNameContentSyncPluginSettings = {
	path: ''
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
		const validPath = this.settings.path;
		if (validPath === '') return
		const filePath = file.parent?.path
		const firstPath = filePath?.split('/')[0]
		if (
			this.isRenameInProgress
			|| !(file instanceof TFile)
			|| file.extension !== 'md'
			|| firstPath !== validPath
		) {
			return
		}
		const text = await this.app.vault.read(file)
		const content = text.split('\n')
		const startLine = findNoteStart(content)
		const fileName = getFileName(content, startLine)
		if (!fileName) return
		const newPath = `${filePath}/${fileName}.md`;
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
			.setName('Folder')
			.setDesc('生效的路径')
			.addText(text => text
				.setPlaceholder('Enter your path')
				.setValue(this.plugin.settings.path)
				.onChange(async (value) => {
					this.plugin.settings.path = value;
					await this.plugin.saveSettings();
				}));
	}
}
