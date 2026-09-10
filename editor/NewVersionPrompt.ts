// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";

const { button, div, h2, h3, p, a, i } = HTML;

export class NewVersionPrompt implements Prompt {
    private readonly _okayButton: HTMLButtonElement = button(
        { class: "okayButton", style: "width: 45%;" },
        "Okay"
    );

public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 420px; max-width: 80vw; "},
// woah that's a lot of css
    h2({ style: "margin: 0 0 0.7em 0;" }, "Woah! 41Box changed a lot!"),

    h3({ style: "margin: 0 0 0.7em 0;" }, "41Box 1.3 has been released! (see the changes below)"),

    p({ style: "margin: 0.5em 0;" }, "There have been some big changes to the box, so here's a quick look at what's new"),

    div({ style: "text-align: left; margin: 0.5em 0;" },
        p({ style: "margin: 0.5em;" }, "• Multiple songs can be open at once (see the new tabs system)"),
        p({ style: "margin: 0.5em;" }, "• Many UI changes have been adopted"),
        p({ style: "margin: 0.5em;" }, "• And lots of other stuff listed in the ", a({ href: "./patch_notes"}, "patch notes"))
    ),

    p({ style: "margin: 0.5em 0;" }, "Check it out and get beeping!"),

    p({style: "text-align: right; padding-right: 1em; margin: 0.2em 0 0.8em 0;"}, i("-41popzic")),

    div({ style: "display: flex; justify-content: center; margin-top: 0.5em;"},
        this._okayButton
    ),
);


    constructor(private _doc: SongDocument) {
        this._okayButton.addEventListener("click", this._close);
        this.container.addEventListener("keydown", this._whenKeyPressed);

        setTimeout(() => this._okayButton.focus());
    }

    private _close = (): void => {
        this._doc.undo();
    }

    private _whenKeyPressed = (event: KeyboardEvent): void => {
        if (event.key === "Enter") {
            this._close();
        }
    }

    public cleanUp = (): void => {
        this._okayButton.removeEventListener("click", this._close);
        this.container.removeEventListener("keydown", this._whenKeyPressed);
    }
}