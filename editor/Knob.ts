
import { Change } from "./Change";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { SongDocument } from "./SongDocument";

const { span } = HTML; // input } = HTML;
const { svg, circle, line, path } = SVG;

export class Knob {
    public container: HTMLSpanElement;
    
    private readonly _marker: SVGLineElement = line({ x1: "24", y1: "24", x2: "24", y2: "9", class: "knobIndicator", });

    private readonly _valueArc = path({ class: "knobValueArc", fill: "none", "stroke-width": "2.5", "stroke-linecap": "round" });

    private readonly _svg: SVGSVGElement = svg({ class: "knob", viewBox: "0 0 48 48", role: "slider", tabindex: "0", "aria-label": "Parameter" },
        circle({ cx: "24", cy: "24", r: "20", class: "knobTrack",}),
        this._valueArc,
        this._marker
    );

    //private readonly _valueDisplay: HTMLInputElement = input({ class: "knobValue", type: "number", style: "width: 4em;" });

    private _change: Change | null = null;
    private _value: number = 0;
    private _oldValue: number = 0;
    private _dragging: boolean = false;
    private _lastY: number = 0;
    private innerRadius: number = 3;
    private outerRadius: number = 18;
    private radiusOffset: number = 5;

    constructor(private readonly _min: number, private readonly _max: number, private readonly _step: number, value: number, private readonly _bipolar: boolean, private readonly _doc: SongDocument, private readonly _getChange: ((oldValue: number, newValue: number) => Change) | null, private readonly _markings: number[] = []) {
        this._value = this._clamp(value);
        this.container = span({ class: "knobContainer" });
        this._createMarkers();
        this.container.appendChild(this._svg);

        this._svg.appendChild(this._valueArc)
        this._svg.appendChild(this._marker);


        //this.container.appendChild(this._valueDisplay);

        this._updateDisplay();
        this._addEventListeners();
    }

    private _clamp(value: number): number {
        const clamped = Math.max(this._min, Math.min(this._max, value));
        return this._min + Math.round((clamped - this._min) / this._step) * this._step;
    }

    private _setValue(value: number): void {
        const newValue = this._clamp(value);
        if (newValue == this._value) return;

        if (this._getChange != null) {
            const continuingProspectiveChange: boolean = this._doc.lastChangeWas(this._change);
            if (!continuingProspectiveChange) this._oldValue = this._value;

            this._change = this._getChange(this._oldValue, newValue);
            this._doc.setProspectiveChange(this._change);
        }

        this._value = newValue;
        this._updateDisplay();
    }

    public updateValue(value: number): void {
        this._value = this._clamp(value);
        this._updateDisplay();
    }

    private _updateArc(): void {
        const percentage = (this._value - this._min) / (this._max - this._min || 1);

        const angle = this._bipolar ? this._value / Math.max(Math.abs(this._min), Math.abs(this._max)) * 150 : -150 + percentage * 180;

        const startAngle = this._bipolar ? 0 : -150;
        const endAngle = angle;

        if (Math.abs(endAngle - startAngle) < 0.001) {
            this._valueArc.setAttribute("d", "");
            return;
        }

        const radius = this.outerRadius + 4;

        const x1 = 24 + Math.sin(startAngle * Math.PI / 180) * radius;
        const y1 = 24 - Math.cos(startAngle * Math.PI / 180) * radius;
        const x2 = 24 + Math.sin(endAngle * Math.PI / 180) * radius;
        const y2 = 24 - Math.cos(endAngle * Math.PI / 180) * radius;

        const sweep = this._bipolar
            ? (endAngle > 0 ? 1 : 0)
            : 1;

        this._valueArc.setAttribute(
            "d",
            `M ${x1} ${y1} A ${radius} ${radius} 0 0 ${sweep} ${x2} ${y2}`,
        );
    }

    private _updateDisplay(): void {
        const percentage = (this._value - this._min) / (this._max - this._min || 1);
        const angle = this._bipolar ? this._value / Math.max(Math.abs(this._min), Math.abs(this._max)) * 150 : -150 + percentage * 180;
        const radians = angle * Math.PI / 180;
        
        this._updateArc();

        this._svg.setAttribute("aria-valuemin", this._min.toString());
        this._svg.setAttribute("aria-valuemax", this._max.toString());
        this._svg.setAttribute("aria-valuenow", this._value.toString());

        //if (document.activeElement !== this._valueDisplay) {
        //    this._valueDisplay.value = this._value.toString();
        //}

        const innerRadius = this.innerRadius + this.radiusOffset;
        const outerRadius = this.outerRadius;

        this._svg.querySelector(".knobIndicator")?.setAttribute("x1", (24 + Math.sin(radians) * innerRadius).toString());
        this._svg.querySelector(".knobIndicator")?.setAttribute("y1", (24 - Math.cos(radians) * innerRadius).toString());
        this._svg.querySelector(".knobIndicator")?.setAttribute("x2", (24 + Math.sin(radians) * outerRadius).toString());
        this._svg.querySelector(".knobIndicator")?.setAttribute("y2", (24 - Math.cos(radians) * outerRadius).toString());
    }

    public setTitle(title: string): void {
        this._svg.setAttribute("title", title);
    }

    private _createMarkers(): void {
        for (const value of this._markings) {
            if (value < this._min || value > this._max) continue;

            const percentage = (value - this._min) / (this._max - this._min || 1);

            const angle = this._bipolar ? value / Math.max(Math.abs(this._min), Math.abs(this._max)) * 150 : -150 + percentage * 180;

            const radians = angle * Math.PI / 180;

            const innerRadius = this.outerRadius + 3;
            const outerRadius = this.outerRadius + 5;

            const tick = line({ x1: (24 + Math.sin(radians) * innerRadius).toString(), y1: (24 - Math.cos(radians) * innerRadius).toString(), x2: (24 + Math.sin(radians) * outerRadius).toString(), y2: (24 - Math.cos(radians) * outerRadius).toString(), class: "knobMarker" });

            this._svg.appendChild(tick);
        }
    }

    private _whenPointerDown = (event: PointerEvent): void => {
        if (event.button !== 0) return;

        this._dragging = true;
        this._lastY = event.clientY;
        this._svg.setPointerCapture(event.pointerId);
        event.preventDefault();
    };

    private _whenPointerMove = (event: PointerEvent): void => {
        if (!this._dragging) return;

        const delta = this._lastY - event.clientY;
        this._lastY = event.clientY;

        this._setValue(this._value + delta * this._step);
    };

    private _whenPointerUp = (): void => {
        this._dragging = false;

        if (this._getChange != null && this._change != null) {
            this._doc.record(this._change);
            this._change = null;
        }
    };

    /*private _whenValueChanged = (): void => {
        const value = Number(this._valueDisplay.value);

        if (!Number.isFinite(value)) {
            this._updateDisplay();
            return;
        }

        this._setValue(value);

        if (this._getChange != null && this._change != null) {
            this._doc.record(this._change);
            this._change = null;
        }
    };*/

    private _addEventListeners(): void {
        this._svg.addEventListener("pointerdown", this._whenPointerDown);
        this._svg.addEventListener("pointermove", this._whenPointerMove);
        this._svg.addEventListener("pointerup", this._whenPointerUp);
        this._svg.addEventListener("pointercancel", this._whenPointerUp);
        //this._valueDisplay.addEventListener("change", this._whenValueChanged);
        //this._valueDisplay.addEventListener("blur", this._whenValueChanged);
        //this._valueDisplay.addEventListener("keydown", (event: KeyboardEvent) => {
        //    event.stopPropagation();
        //});
    }

    public updateColor(color: string): void {
        this._svg.querySelector(".knobIndicator") ?.setAttribute("stroke", color);
    } // Might be strange to put this here
}