import { HTML } from "imperative-html/dist/esm/elements-strict";

const { button, div } = HTML;

export class ContextMenu {
    private readonly _menu: HTMLDivElement = div({ class: "context-menu" });

    private readonly _duplicateTab: HTMLButtonElement = button({ class: "context-menu-item" },
        "duplicate tab"
    );

    private readonly _closeTab: HTMLButtonElement = button({ class: "context-menu-item" },
        "close tab"
    );

    private _tabId: string | null = null;

    constructor(
        private readonly _duplicateTabCallback: (tabId: string) => void,
    ) {
        this._menu.appendChild(this._duplicateTab);
        this._menu.appendChild(this._closeTab);

        this._duplicateTab.addEventListener("click", () => {
            if (this._tabId != null) {
                this._duplicateTabCallback(this._tabId);
            }

            this.hide();
        });

        this._menu.style.display = "none";
        document.body.appendChild(this._menu);
    }

    public show(x: number, y: number, tabId: string): void {
        this._tabId = tabId;

        this._menu.style.left = `${x}px`;
        this._menu.style.top = `${y}px`;
        this._menu.style.display = "block";
    }

    public hide(): void {
        this._menu.style.display = "none";
    }
}