// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { HTML } from "imperative-html/dist/esm/elements-strict";
import { Prompt } from "./Prompt";
import { SongDocument } from "./SongDocument";
import { ColorConfig } from "./ColorConfig";

//namespace beepbox {
const { button, div, h2, /*select, option, optgroup*/ } = HTML;

interface ThemeGroup {
	group: string;
	items: {
		id: string;
		name: string;
	}[];
}

const themes: ThemeGroup[] = [
    {
		group: "41Box Themes",
        items: [
            { id: "41box", name: "Inter Toxic" },
            { id: "inter-energized", name: "Inter Energized" },
            { id: "inter-nebula", name: "Inter Nebula" },
            { id: "inter-autumn", name: "Inter Autumn" },
            { id: "inter-forest", name: "Inter Forest" },
			{ id: "inter-moonlight", name: "Inter Moonlight" },
        ]
	},
	{
        group: "BeepBox Themes",
        items: [
            { id: "dark classic", name: "BeepBox Dark" },
            { id: "dark competition", name: "BeepBox Competition Dark" },
        ],
    },
	{
        group: "JummBox Themes",
        items: [
            { id: "forest", name: "Forest" },
            { id: "canyon", name: "Canyon" },
            { id: "midnight", name: "Midnight" },
            { id: "beachcombing", name: "Beachcombing" },
            { id: "violet verdant", name: "Violet Verdant" },
            { id: "sunset", name: "Sunset" },
            { id: "autumn", name: "Autumn" },
            { id: "fruit", name: "Shadowfruit" },
            { id: "toxic", name: "Toxic" },
            { id: "roe", name: "Roe" },
            { id: "moonlight", name: "Moonlight" },
            { id: "portal", name: "Portal" },
            { id: "fusion", name: "Fusion" },
            { id: "nebula", name: "Nebula" },
            { id: "amoled dark", name: "High Contrast Dark" },
            { id: "energized", name: "Energized" },
            { id: "neapolitan", name: "Neapolitan" },
            { id: "poly", name: "Poly" },
            { id: "blutonium", name: "Blutonium" },
            { id: "greyscale", name: "Greyscale" },
            { id: "slushie", name: "Slushie" },
        ],
    },
	{
		group: "ModBox Themes",
		items: [
            { id: "modbox classic", name: "Modbox" },
			{ id: "modbox 2", name: "Modbox 2.0"},
			{ id: "modbox arctic", name: "Arctic"},
			{ id: "modbox cinnamon", name: "Cinnamon Roll [!]"},
			{ id: "modbox ocean", name: "Ocean"},
			{ id: "modbox rainbow", name: "Rainbow [!]"},
			{ id: "modbox float", name: "Float [!]"},
			{ id: "modbox windows", name: "Windows"},
			{ id: "modbox grassland", name: "Grassland"},
			{ id: "modbox dessert", name: "Dessert"},
			{ id: "modbox kahoot", name: "Kahootiest"},
			{ id: "modbox bitbeam", name: "Beam to the Bit [!]"},
			{ id: "modbox egg", name: "Pretty Egg"},
			{ id: "modbox pony", name: "Poniryoshka"},
			{ id: "modbox gameboy", name: "Gameboy [!]"},
			{ id: "modbox woodkid", name: "Woodkid [!]"},
			{ id: "modbox midnight", name: "Midnight [!]"},
			{ id: "modbox snedbox", name: "Snedbox"},
			{ id: "modbox unnamed", name: "unnamed [!]"},
			{ id: "modbox halloween", name: "Halloween [!]"},
			{ id: "modbox frozen", name: "FrozenOver❄️ [!]"}
		]
	},
	{
		group: "Mod Themes",
		items: [
            { id: "jummbox classic", name: "JummBox Classic" },
			{ id: "sandbox classic", name: "Sandbox"},
			{ id: "harrybox", name: "Haileybox"},
			{ id: "shitbox 3.0", name: "Shitbox 1.0/3.0"},
			{ id: "shitbox 2.0", name: "Shitbox 2.0"},
			{ id: "nerdbox", name: "Nerdbox"},
			{ id: "brucebox", name: "Brucebox"},
			{ id: "zefbox", name: "Zefbox"},
			{ id: "cardboardbox classic", name: "Cardboardbox"},
			{ id: "blubox classic", name: "Blubox"},
			{ id: "dogebox classic", name: "Dogebox"},
			{ id: "wackybox", name: "Wackybox"},
			{ id: "todbox dark mode", name: "Todbox Dark Mode"},
			{ id: "mainbox 1.0", name: "Mainbox"},
			{ id: "microbox", name: "MicroBox"},
			{ id: "paandorasbox", name: "PaandorasBox"},
			{ id: "foxbox", name: "FoxBox"},
			{ id: "midbox", name: "Midbox"},
			{ id: "dogebox2", name: "DogeBox2"},
			{ id: "abyssbox classic", name: "AbyssBox Classic"},
			{ id: "slarmoosbox", name: "Slarmoo's Box"},
			{ id: "nepbox", name: "Nepbox"},
			{ id: "nepbox laffey", name: "Nepbox Laffey"},
			{ id: "ultrabox dark", name: "UltraBox"},
			{ id: "voxonium", name: "Voxonium"},
			//{ id: "nepbox laffey", name: "Nepbox Laffey"},
			{ id: "axobox", name: "AxoBox"},
			{ id: "lemmbox dark", name: "LemmBox"},
			{ id: "fmbox", name: "FMBox"},
		]
	},
	{	group: "Light Themes",
		items: [
            { id: "inverse", name: "Inverse" },
            { id: "roe light", name: "Roe Light" },
			{ id: "jummbox light", name: "JummBox Light"},
			{ id: "abyssbox light", name: "AbyssBox Light"},
            { id: "light classic", name: "BeepBox Light" },
		]
	}
];

export class ThemePrompt implements Prompt {
	private _selectedTheme: string;

	private readonly _themeList = this._makeThemeList();
	private readonly _themeButtonText = div(
		{
			class: "themeButtonText"
		},
		"41Box Classic"
	);
	private readonly _themeButton = button(
		{
			class: "themeDropdownButton",
			style: `
				width:100%;
				display:flex;
				justify-content:space-between;
				align-items:center;
				padding:6px 10px;
				box-sizing:border-box;
			`
		},
		this._themeButtonText,
		div(
			{
				class: "themeButtonArrows",
				style: `
					display:flex;
					flex-direction:column;
					align-items:center;
					justify-content:center;
					line-height:11px;
					font-size:9px;
					margin-right:0px;
				`
			},
			div("▲"),
			div("▼")
		)
	);

	private readonly _themeMenu = div(
		{
			class: "themeDropdownMenu",
			style: `
				display:none;
				position:absolute;
				top:100%;
				left:0;
				width:100%;
				max-height:300px;
				overflow-y:auto;

				background:${ColorConfig.uiWidgetBackground};
				border:1px solid ${ColorConfig.uiWidgetFocus};
				border-radius:4px;

				box-sizing:border-box;
				z-index:100;
			`
		},
		this._themeList
	);

	private _dropdownOpen = false;
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
	private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, "Okay");
	public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 220px;" },
		h2("Set Theme"),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ style: "position:relative; width:100%;" }, this._themeButton, this._themeMenu)),
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
		),
		this._cancelButton,
	);
	private readonly lastTheme: string | null = window.localStorage.getItem("colorTheme")
	private readonly _originalTheme = this._doc.prefs.colorTheme;

	constructor(private _doc: SongDocument) {
		this._selectedTheme = this.lastTheme ?? ColorConfig.defaultTheme;

		const currentTheme = themes
			.flatMap(group => group.items)
			.find(theme => theme.id === this._selectedTheme);

		this._themeButtonText.textContent = currentTheme?.name ?? this._selectedTheme;

		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
		this.container.addEventListener("keydown", this._whenKeyPressed);

		this._themeButton.addEventListener("click", () => {
			this._dropdownOpen = !this._dropdownOpen;
			this._themeMenu.style.display = this._dropdownOpen ? "" : "none";
		});

		document.addEventListener("mousedown", this._clickOutside);

		this._themeMenu.addEventListener("mouseleave", () => {
			ColorConfig.setTheme(this._selectedTheme);

			const selectedTheme = themes
				.flatMap(group => group.items)
				.find(t => t.id === this._selectedTheme);

			this._themeButtonText.textContent =
				selectedTheme?.name ?? this._selectedTheme;
		});
	}
	

	private _close = (): void => {
		ColorConfig.setTheme(this._originalTheme);
		this._doc.undo();
	};

	public cleanUp = (): void => {
		this._okayButton.removeEventListener("click", this._saveChanges);
		this._cancelButton.removeEventListener("click", this._close);
		this.container.removeEventListener("keydown", this._whenKeyPressed);

		document.removeEventListener("mousedown", this._clickOutside);
	}

	private _whenKeyPressed = (event: KeyboardEvent): void => {
		if ((<Element>event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
			this._saveChanges();
		}
	}

	private _saveChanges = (): void => {
		ColorConfig.setTheme(this._selectedTheme);

		window.localStorage.setItem("colorTheme", this._selectedTheme);
		this._doc.prefs.colorTheme = this._selectedTheme;
		this._doc.prompt = null;
		this._doc.undo();
	}

	private _clickOutside = (event: MouseEvent): void => {
		if (!this.container.contains(event.target as Node)) {
			this._dropdownOpen = false;
			this._themeMenu.style.display = "none";
		}
	};

	/*private _withOpacity(color: string, opacity: number): string {
		const hex = color.replace("#", "");
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}*/
	
	private _makeThemeList(): HTMLElement {
		const themeContainer = HTML.div();

		for (const group of themes) {

    const groupContainer = HTML.div();

    let expanded = false;

    const arrow = HTML.div("▶");

    const heading = HTML.div(
			{
			style: `
				display:flex;
				align-items:center;
				cursor:pointer;
				font-style:italic;
				font-weight:bold;
				font-size:13px;

				padding:4px 8px 4px 10px;
				
				background:rgba(0, 0, 0, 0.15);

				user-select:none;
			`
		},
		arrow,
		div({ style: "margin-left:6px;" }, group.group));

	heading.addEventListener("mouseenter", () => {
		heading.style.background = "rgba(128, 128, 128, 0.25)";
	});

	heading.addEventListener("mouseleave", () => {
		heading.style.background = "rgba(0, 0, 0, 0.15)";
	});

    const itemsContainer = HTML.div({
        style: "display:none;"
    });

    for (const theme of group.items) {

        const item = HTML.div(
					{
				class: "themeItem",
				style: `
					font-weight: normal;
					font-size: 13px;
					padding: 4px 8px 4px 40px;
					text-align: left;
					cursor: pointer;
					user-select: none;
				`
			},
			theme.name);

				if (theme.id === this._selectedTheme) {
					item.classList.add("selected");
				}

				item.addEventListener("mouseenter", () => {
					this._themeButtonText.textContent = theme.name;
					item.style.background = "rgba(128, 128, 128, 0.25)";

					requestAnimationFrame(() => {
						ColorConfig.setTheme(theme.id);
					});
				});

				item.addEventListener("mouseout", () => {
					item.style.background = "";

					const selectedTheme = themes.flatMap(group => group.items).find(t => t.id === this._selectedTheme);

					this._themeButtonText.textContent =
						selectedTheme?.name ?? this._selectedTheme;
				});

				item.addEventListener("click", () => {
					this._themeButtonText.textContent = theme.name;

					this._themeMenu.style.display = "none";

					this._dropdownOpen = false;

					this._selectedTheme = theme.id;

					ColorConfig.setTheme(theme.id);

					themeContainer.querySelectorAll(".themeItem")
						.forEach(el => el.classList.remove("selected"));

					item.classList.add("selected");
				});

        itemsContainer.appendChild(item);
    }

    heading.addEventListener("click", () => {
        expanded = !expanded;
        itemsContainer.style.display = expanded ? "" : "none";
        arrow.textContent = expanded ? "▼" : "▶";
    });

    groupContainer.appendChild(heading);
    groupContainer.appendChild(itemsContainer);

    themeContainer.appendChild(groupContainer);
}
		

		return themeContainer;
	}
}