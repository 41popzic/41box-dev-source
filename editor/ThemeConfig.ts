interface ThemeGroup {
	group: string;
	items: {
		id: string;
		name: string;
	}[];
}

export const themes: ThemeGroup[] = [
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
			//{ id: "shitbox 3.0", name: "Shitbox 1.0/3.0"},
			{ id: "shitbox 2.0", name: "Shitbox 2.0"},
			{ id: "nerdbox", name: "Nerdbox"},
			//{ id: "brucebox", name: "Brucebox"},
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
			{ id: "piano abyss", name: "AbyssBox Piano"},
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