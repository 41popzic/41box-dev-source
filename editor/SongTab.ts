import { HTML } from "imperative-html/dist/esm/elements-strict";
import { Song } from "../synth/Song";

const { button, div, span } = HTML;

export interface SongTabData {
    id: string;
    title: string;
    song: string;
}

export class SongTabs {
    private readonly _41Logo: HTMLDivElement = div({ class: "song-tabs-logo" }, new Image(24, 24));
    
    private readonly _41Icon: HTMLImageElement = this._41Logo.firstChild as HTMLImageElement;

    private static readonly STORAGE_KEY = "song-tabs";

    public readonly container: HTMLDivElement = div({class: "song-tabs"});

    private readonly _tabContainer: HTMLDivElement = div({class: "song-tab-container"});

    private readonly _newTabButton: HTMLButtonElement = button({class: "song-tab-new", style: "width: 1.5em; height: 1.5em;"},
        "+"
    );

    private readonly _newTabButtonContainer: HTMLDivElement = div({ style: "padding: 0.33em" },
        this._newTabButton
    );

    private _tabs: SongTabData[] = [];
    private _activeTab: string | null = null;

    constructor(private readonly _whenTabSelected: (tab: SongTabData) => void, private readonly _initialSong: string) {
        this._41Icon.src = "assets/favicon.png";

        this.container.appendChild(this._41Logo);

        this.container.appendChild(this._tabContainer);
        this.container.appendChild(this._newTabButtonContainer);

        this._newTabButton.addEventListener("click", () => {
            const newSong = new Song();
            this._createTab("unnamed", newSong.toBase64String());
        });

        document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});


        this._load();
    }

    private _createTab(title: string, song: string): void {
        const tab: SongTabData = {
            id: crypto.randomUUID(),
            title: title,
            song: song,
        };

        this._tabs.push(tab);
        this._activeTab = tab.id;

        this._whenTabSelected(tab);

        this._save();
        this._render();
    }

    private _save(): void {
        window.localStorage.setItem(
            SongTabs.STORAGE_KEY,
            JSON.stringify({
                tabs: this._tabs,
                activeTab: this._activeTab,
            })
        );
    }

    private _load(): void {
        const stored = window.localStorage.getItem(SongTabs.STORAGE_KEY);

        if (stored != null) {
            try {
                const data = JSON.parse(stored);

                if (Array.isArray(data.tabs)) {
                    this._tabs = data.tabs;
                    this._activeTab = data.activeTab ?? null;
                }
            } catch {
                this._tabs = [];
                this._activeTab = null;
            }
        }

        const existingTab = this._tabs.find(tab => tab.song === this._initialSong);

        if (existingTab != null) {
            this._activeTab = existingTab.id;
            this._whenTabSelected(existingTab);
            this._save();
            this._render();
            return;
        }

        // The URL song wasn't in localStorage, so create a new tab for it
        this._createTab("unnamed", this._initialSong);
    }

    private _render(): void {
        this._tabContainer.innerHTML = "";

        for (const tab of this._tabs) {
            const tabElement = button({
                class: tab.id === this._activeTab
                    ? "song-tab active"
                    : "song-tab",
            });

            const title = span({}, tab.title);
            const close = span({
                class: "song-tab-close",
            }, "×");

            tabElement.appendChild(title);
            tabElement.appendChild(close);

            tabElement.addEventListener("click", (event) => {
                if ((event.target as HTMLElement) == close) {
                    this._closeTab(tab.id);
                } else {
                    this._selectTab(tab.id);
                }
            });

            this._tabContainer.appendChild(tabElement);
        }
    }

    private _selectTab(id: string): void {
        if (id === this._activeTab) return;

        this._activeTab = id;

        const tab = this._tabs.find(tab => tab.id == id);

        if (tab != null) {
            this._whenTabSelected(tab);
        }

        this._save();
        this._render();
    }

    private _closeTab(id: string): void {
        if (this._tabs.length <= 1) {
            return;
        }

        this._tabs = this._tabs.filter(tab => tab.id != id);

        if (this._activeTab == id) {
            this._activeTab =
                this._tabs.length > 0
                    ? this._tabs[this._tabs.length - 1].id
                    : null;

            if (this._activeTab != null) {
                const tab = this._tabs.find(tab => tab.id == this._activeTab);

                if (tab != null) {
                    this._whenTabSelected(tab);
                }
            }
        }

        this._save();
        this._render();
    }

    public updateActiveSong(song: string, title: string): void {
        if (this._activeTab == null) return;

        const tab = this._tabs.find(tab => tab.id == this._activeTab);
        if (tab == null) return;

        const titleChanged = tab.title != title;

        tab.song = song;
        tab.title = title;

        this._save();

        if (titleChanged) {
            this._render();
        }
    }

    public selectTab(id: string): void {
        this._selectTab(id);
    }
    
    public openSong(song: string): void {
        const existingTab = this._tabs.find(tab => tab.song === song);

        if (existingTab != null) {
            this._selectTab(existingTab.id);
        } else {
            this._createTab("unnamed", song);
        }
    }
}