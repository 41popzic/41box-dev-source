// Copyright (c) 2012-2022 John Nesky and contributing authors,
// distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig";

export class PatternScrollBar {
    private readonly _editorHeight: number = 18;
    private readonly _barNotches: SVGRectElement[] = [];
    private readonly _notchHeight: number = 4;

    private readonly _handle: SVGRectElement = SVG.rect({
        fill: ColorConfig.uiWidgetBackground,
        y: 2,
        height: this._editorHeight - 4,
    });

    private readonly _handleHighlightTop: SVGRectElement = SVG.rect({
        fill: ColorConfig.hoverPreview,
        "pointer-events": "none",
    });

    private readonly _handleHighlightBottom: SVGRectElement = SVG.rect({
        fill: ColorConfig.hoverPreview,
        "pointer-events": "none",
    });

    private readonly _handleHighlightLeft: SVGRectElement = SVG.rect({
        fill: ColorConfig.hoverPreview,
        "pointer-events": "none",
    });

    private readonly _handleHighlightRight: SVGRectElement = SVG.rect({
        fill: ColorConfig.hoverPreview,
        "pointer-events": "none",
    });

    private readonly _svg: SVGSVGElement = SVG.svg({
        style: "background-color: " + ColorConfig.editorBackground +
            "; touch-action: pan-x; position: absolute;",
        width: "100%",
        height: this._editorHeight,
        viewBox: "0 0 100 20",
        preserveAspectRatio: "none",
    });

    public readonly container: HTMLDivElement = HTML.div({
        id: "patternScrollBarContainer",
        style: "width: 100%; height: 20px; overflow: hidden; position: relative; flex-shrink: 0;",
    }, this._svg);

    private _mouseX: number = 0;
    private _mouseDown: boolean = false;
    private _mouseOver: boolean = false;
    private _dragging: boolean = false;
    private _dragStart: number = 0;
    private _renderedBarCount: number = -1;

    constructor(private _doc: SongDocument) {
        this._doc.notifier.watch(this._documentChanged);

        this._svg.appendChild(this._handle);

        for (let i: number = 0; i <= this._doc.song.barCount; i++) {
            const notch: SVGRectElement = SVG.rect({
                fill: ColorConfig.tonic,
                x: i * (100 / Math.max(1, this._doc.song.barCount)),
                y: 0,
                width: 0.4,
                height: this._notchHeight,
            });

            this._barNotches.push(notch);
            this._svg.appendChild(notch);
        }

        this._svg.appendChild(this._handleHighlightTop);
        this._svg.appendChild(this._handleHighlightBottom);
        this._svg.appendChild(this._handleHighlightLeft);
        this._svg.appendChild(this._handleHighlightRight);

        this._documentChanged();

        this.container.addEventListener("mousedown", this._whenMousePressed);
        document.addEventListener("mousemove", this._whenMouseMoved);
        document.addEventListener("mouseup", this._whenCursorReleased);

        this.container.addEventListener("mouseover", this._whenMouseOver);
        this.container.addEventListener("mouseout", this._whenMouseOut);

        this.container.addEventListener("touchstart", this._whenTouchPressed);
        this.container.addEventListener("touchmove", this._whenTouchMoved);
        this.container.addEventListener("touchend", this._whenCursorReleased);
        this.container.addEventListener("touchcancel", this._whenCursorReleased);

        this._dragStart = this._dragStart; // vscode is stupid
    }


    private _whenMouseOver = (event: MouseEvent): void => {
        if (this._mouseOver) return;
        this._mouseOver = true;
        this._updatePreview();
    };

    private _whenMouseOut = (event: MouseEvent): void => {
        if (!this._mouseOver) return;
        this._mouseOver = false;
        this._updatePreview();
    };

    private _whenMousePressed = (event: MouseEvent): void => {
        event.preventDefault();

        this._mouseDown = true;

        const boundingRect = this._svg.getBoundingClientRect();

        this._mouseX =
            ((event.clientX || event.pageX) - boundingRect.left)
            * 100 / boundingRect.width;

        if (isNaN(this._mouseX)) this._mouseX = 0;

        this._updatePreview();

        if (this._isMouseOverHandle()) {
            this._dragging = true;
            this._dragStart = this._mouseX;
        }
    };

    private _whenTouchPressed = (event: TouchEvent): void => {
        event.preventDefault();

        this._mouseDown = true;

        const boundingRect = this._svg.getBoundingClientRect();

        this._mouseX =
            (event.touches[0].clientX - boundingRect.left)
            * 100 / boundingRect.width;

        if (isNaN(this._mouseX)) this._mouseX = 0;

        this._updatePreview();

        if (this._isMouseOverHandle()) {
            this._dragging = true;
            this._dragStart = this._mouseX;
        }
    };

    private _whenMouseMoved = (event: MouseEvent): void => {
        const boundingRect = this._svg.getBoundingClientRect();

        this._mouseX =
            ((event.clientX || event.pageX) - boundingRect.left)
            * 100 / boundingRect.width;

        if (isNaN(this._mouseX)) this._mouseX = 0;

        this._whenCursorMoved();
    };

    private _whenTouchMoved = (event: TouchEvent): void => {
        if (!this._mouseDown) return;

        event.preventDefault();

        const boundingRect = this._svg.getBoundingClientRect();

        this._mouseX =
            (event.touches[0].clientX - boundingRect.left)
            * 100 / boundingRect.width;

        if (isNaN(this._mouseX)) this._mouseX = 0;

        this._whenCursorMoved();
    };

    private _whenCursorMoved(): void {
        if (!this._dragging) {
            if (this._mouseOver) this._updatePreview();
            return;
        }

        const barCount = this._doc.song.barCount;
        if (barCount <= 1) return;

        const bar = Math.max(
            0,
            Math.min(
                barCount - 1,
                Math.floor((this._mouseX / 100) * barCount)
            )
        );

        if (bar !== this._doc.bar) {
            this._doc.selection.setChannelBar(
                this._doc.channel,
                bar
            );
            this._doc.selection.resetBoxSelection();
        }

        this._updateHandle();
    }

    private _whenCursorReleased = (event: Event): void => {
        this._mouseDown = false;
        this._dragging = false;

        this._updatePreview();
    };

    private _updateHandle(): void {
        const barCount = this._doc.song.barCount;

        if (barCount <= 0) return;

        const barWidth = 100 / barCount;
        const x = this._doc.bar * barWidth;

        this._handle.setAttribute("x", String(x));
        this._handle.setAttribute("width", String(barWidth));

        // Convert 2px into the SVG's 0-100 coordinate system.
        const pixelWidth = this._svg.getBoundingClientRect().width;
        const inset = pixelWidth > 0 ? (2 / pixelWidth) * 100 : 0;

        const highlightWidth = Math.max(0, barWidth - inset * 2);

        // Top
        this._handleHighlightTop.setAttribute("x", String(x + inset));
        this._handleHighlightTop.setAttribute("y", "0");
        this._handleHighlightTop.setAttribute("width", String(highlightWidth));
        this._handleHighlightTop.setAttribute("height", "2");

        // Bottom
        this._handleHighlightBottom.setAttribute("x", String(x + inset));
        this._handleHighlightBottom.setAttribute("y", String(this._editorHeight - 2));
        this._handleHighlightBottom.setAttribute("width", String(highlightWidth));
        this._handleHighlightBottom.setAttribute("height", "2");

        // Left
        this._handleHighlightLeft.setAttribute("x", String(x));
        this._handleHighlightLeft.setAttribute("y", "0");
        this._handleHighlightLeft.setAttribute("width", String(inset));
        this._handleHighlightLeft.setAttribute("height", String(this._editorHeight));

        // Right
        this._handleHighlightRight.setAttribute("x", String(x + barWidth - inset));
        this._handleHighlightRight.setAttribute("y", "0");
        this._handleHighlightRight.setAttribute("width", String(inset));
        this._handleHighlightRight.setAttribute("height", String(this._editorHeight));
    }

    private _isMouseOverHandle(): boolean {
        const barCount = this._doc.song.barCount;
        if (barCount <= 0) return false;

        const barWidth = 100 / barCount;
        const x = this._doc.bar * barWidth;

        return this._mouseX >= x &&
               this._mouseX <= x + barWidth;
    }

    private _updatePreview(): void {
        const showHighlight = this._mouseOver && !this._mouseDown;

        const visibility =
            showHighlight && this._isMouseOverHandle()
                ? "inherit"
                : "hidden";

        this._handleHighlightTop.style.visibility = visibility;
        this._handleHighlightBottom.style.visibility = visibility;
        this._handleHighlightLeft.style.visibility = visibility;
        this._handleHighlightRight.style.visibility = visibility;
    }

    private _documentChanged = (): void => {
        const barCount = this._doc.song.barCount;

        if (barCount !== this._renderedBarCount) {
            this._renderedBarCount = barCount;

            for (const notch of this._barNotches) {
                notch.remove();
            }
            this._barNotches.length = 0;

            if (barCount > 0) {
                for (let i: number = 0; i <= barCount; i++) {
                    const notch: SVGRectElement = SVG.rect({
                        fill: ColorConfig.tonic,
                        x: i * (100 / barCount),
                        y: 0,
                        width: 0.4,
                        height: this._editorHeight,
                    });

                    this._barNotches.push(notch);
                    this._svg.insertBefore(notch, this._handleHighlightTop);
                }
            }
        }

        this._updateHandle();
        this._updatePreview();
    };
}