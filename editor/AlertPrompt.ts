// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.
/*
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";

const { button, div, h2 } = HTML;

export class AlertPrompt implements Prompt {
    private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, "Okay");

    public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 400px;" },
        h2("Corrupted song"),
        div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: space-between;" },
            "Whoops, the song data appears to have been corrupted! Please try to recover the last working version of the song from the \"Recover Recent Song...\" option in BeepBox's \"File\" menu.",
        ),
        div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
            this._okayButton,
        ),
    );

    constructor(private _doc: SongDocument) {
        this._okayButton.addEventListener("click", this._close);
    }

    private _close = (): void => {
        this._doc.undo();
    }

    public cleanUp = (): void => {
        this._okayButton.removeEventListener("click", this._close);
    }
}*/