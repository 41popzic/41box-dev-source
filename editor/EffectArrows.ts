// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.
import { HTML } from "imperative-html/dist/esm/elements-strict";

const { div, button } = HTML;

export class EffectArrows {
    public readonly _downArrow: HTMLButtonElement = button({ class: "arrow-button", type: "button" }, "▼");
    public readonly _upArrow: HTMLButtonElement = button({ class: "arrow-button", type: "button" }, "⠿");
    
    public readonly container: HTMLDivElement = div({ style: `display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 4px` },
        this._downArrow, this._upArrow
    );
    public constructor() {
        this._downArrow.style.display = "none";
        this._upArrow.draggable = true;
    }
}