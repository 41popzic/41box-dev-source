// Copyright (c) 2012-2022 John Nesky and contributing authors,
// distributed under the MIT license, see accompanying the LICENSE.md file.

import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig";
import { SongDocument  } from "./SongDocument";

export class PatternRuler {
    private readonly _height: number = 10;
    private readonly _svg: SVGSVGElement = SVG.svg({
        style:
            "display: block; height: 100%; " +
            "background-color: " + ColorConfig.editorBackground + ";",
        width: "100%",
        height: this._height,
        preserveAspectRatio: "none",
    });

    public readonly container: HTMLDivElement = HTML.div({style: "height: 24px; " + "flex-shrink: 0; " + "overflow: hidden;"}, 
        this._svg
    );

    constructor( private _doc: SongDocument, private _getBarWidth: () => number,) {
        this._doc.notifier.watch(this._documentChanged);

        requestAnimationFrame(() => {
            this._render();
        });
    }

    private _documentChanged = (): void => {
        this._render();

        requestAnimationFrame(() => {
            this._render();
        });
    };

    private _render(): void {
        while (this._svg.firstChild) {
            this._svg.removeChild(this._svg.firstChild);
        }

        const pianoWidth = this._doc.prefs.showLetters ? 32 : 0;

        this.container.style.marginLeft = pianoWidth + "px";
        this.container.style.width = `calc(100% - ${pianoWidth}px)`;  

        const barWidth: number = this._getBarWidth();
        const beatsPerBar: number = this._doc.song.beatsPerBar;
        const barCount: number = this._doc.song.barCount;

        if (barWidth <= 0 || beatsPerBar <= 0 || barCount <= 0) return;

        const beatWidth: number = barWidth / beatsPerBar;

        this._svg.setAttribute(
            "width",
            String(barWidth * barCount)
        );

        const firstBar: number = this._doc.bar === this._doc.song.barCount - 1 ? Math.max(0, this._doc.bar - 2) : Math.max(0, this._doc.bar - 1);

        for (let bar: number = 0; bar < barCount; bar++) {
            const barX: number = bar * barWidth;

            // Bar boundary
            this._svg.appendChild(SVG.line({
                x1: barX,
                y1: 0,
                x2: barX,
                y2: this._height,
                stroke: ColorConfig.tonic,
                "stroke-width": 1,
            }));

            // Beat numbers
            for (let beat: number = 0; beat < beatsPerBar; beat++) {
                const beatX: number = barX + beat * beatWidth;

                const beatText: SVGTextElement = SVG.text({
                    x: beatX + 3,
                    y: 15,
                    fill: beat === 0
                        ? ColorConfig.primaryText
                        : ColorConfig.secondaryText,
                    "font-size": 11, // Got this number from this calculation: Math.floor(this._height * (4 / 5)) while the height was 14 :>
                    "font-family": "sans-serif",
                });

                if (beat === 0) {
                    beatText.textContent = String(firstBar + bar + 1);
                } else {
                    beatText.textContent = String(beat + 1);
                }

                this._svg.appendChild(beatText);
            }
        }
    }

    public setOffset(offset: number): void {
        this._svg.style.transform = `translateX(${offset}px)`;
    }
}