
import { Change } from "./Change";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { SongDocument } from "./SongDocument";

const { span } = HTML; // input } = HTML;
const { svg, circle, line, path } = SVG;

export class Knob {
    public container: HTMLSpanElement;
    
    private readonly _marker: SVGLineElement = line({ x1: "20", y1: "20", x2: "20", y2: "9", class: "knobIndicator", });
    private readonly _modulationArc = path({ class: "knobModulationArc" });
    private readonly _valueArc = path({ class: "knobValueArc" });

    private readonly _svg: SVGSVGElement = svg({ class: "knob", viewBox: "0 0 44 44", role: "slider", tabindex: "0", "aria-label": "Parameter" },
        circle({ cx: "22", cy: "22", r: "17", class: "knobTrack",}),
    );
    
    private _change: Change | null = null;
    private _value: number = 0;
    private _modulationValue: number | null = null;
    private _oldValue: number = 0;
    private _dragging: boolean = false;
    private _lastY: number = 0;
    private innerRadius: number = 5;
    private outerRadius: number = 14.5;

    constructor(private readonly _min: number, private readonly _max: number, private readonly _step: number, value: number, private readonly _bipolar: boolean, private readonly _doc: SongDocument, private readonly _getChange: ((oldValue: number, newValue: number) => Change) | null, private readonly _markings: number[] = [], private readonly _highlightMarkings: boolean[] = []) {
        this._value = this.clamp(value);
        this.container = span({ class: "knobContainer" });
        this._createMarkers();
        this.container.appendChild(this._svg);

        this._svg.appendChild(this._valueArc)
        this._svg.appendChild(this._modulationArc);
        this._svg.appendChild(this._marker);

        this._updateDisplay();
        this._addEventListeners();
    }

    private clamp(value: number): number {
        const clamped = Math.max(this._min, Math.min(this._max, value));
        return this._min + Math.round((clamped - this._min) / this._step) * this._step;
    }

    private setValue(value: number): void {
        const newValue = this.clamp(value);
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
        this._value = this.clamp(value);
        this._updateDisplay();
    }

    private _updateArc(): void {
        const percentage = (this._value - this._min) / (this._max - this._min || 1);

        const angle = this._bipolar ? (percentage * 2 - 1) * 135 : -90 + percentage * 180;

        const startAngle = this._bipolar ? 0 : -90;
        const endAngle = angle;

        if (Math.abs(endAngle - startAngle) < 0.001) {
            this._valueArc.setAttribute("d", "");
            return;
        }

        const radius = this.outerRadius + 4;

        const x1 = 22 + Math.sin(startAngle * Math.PI / 180) * radius;
        const y1 = 22 - Math.cos(startAngle * Math.PI / 180) * radius;
        const x2 = 22 + Math.sin(endAngle * Math.PI / 180) * radius;
        const y2 = 22 - Math.cos(endAngle * Math.PI / 180) * radius;

        const sweep = this._bipolar ? (endAngle > startAngle ? 1 : 0) : 1;

        this._valueArc.setAttribute( "d", `M ${x1} ${y1} A ${radius} ${radius} 0 0 ${sweep} ${x2} ${y2}`);
    }

    private _updateDisplay(): void {
        const percentage = (this._value - this._min) / (this._max - this._min || 1);
        const angle = this._bipolar ? (percentage * 2 - 1) * 135 : -90 + percentage * 180;
        const radians = angle * Math.PI / 180;
        
        this._updateArc();

        this._svg.setAttribute("aria-valuemin", this._min.toString());
        this._svg.setAttribute("aria-valuemax", this._max.toString());
        this._svg.setAttribute("aria-valuenow", this._value.toString());

        const innerRadius = this.innerRadius;
        const outerRadius = this.outerRadius;

        this._svg.querySelector(".knobIndicator")?.setAttribute("x1", (22 + Math.sin(radians) * innerRadius).toString());
        this._svg.querySelector(".knobIndicator")?.setAttribute("y1", (22 - Math.cos(radians) * innerRadius).toString());
        this._svg.querySelector(".knobIndicator")?.setAttribute("x2", (22 + Math.sin(radians) * outerRadius).toString());
        this._svg.querySelector(".knobIndicator")?.setAttribute("y2", (22 - Math.cos(radians) * outerRadius).toString());
    
        this._updateModulationArc();
    }

    public setTitle(title: string): void {
        this._svg.setAttribute("title", title);
    }

    private _createMarkers(): void {
        for (let i = 0; i < this._markings.length; i++) {
            const value = this._markings[i];

            if (value < this._min || value > this._max) continue;

            const percentage = (value - this._min) / (this._max - this._min || 1);
            const angle = this._bipolar ? (percentage * 2 - 1) * 135 : -90 + percentage * 180;
            const radians = angle * Math.PI / 180;

            const innerRadius = this.outerRadius + 3;
            const outerRadius = this.outerRadius + 8;

            const tick = line({ x1: (22 + Math.sin(radians) * innerRadius).toString(), y1: (22 - Math.cos(radians) * innerRadius).toString(), x2: (22 + Math.sin(radians) * outerRadius).toString(), y2: (22 - Math.cos(radians) * outerRadius).toString(), class: this._highlightMarkings[i] ? "knobMarkerHighlight" : "knobMarker"});

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

        this.setValue(this._value + delta * this._step);
    };

    private _whenPointerUp = (): void => {
        this._dragging = false;

        if (this._getChange != null && this._change != null) {
            this._doc.record(this._change);
            this._change = null;
        }
    };

    private _addEventListeners(): void {
        this._svg.addEventListener("pointerdown", this._whenPointerDown);
        this._svg.addEventListener("pointermove", this._whenPointerMove);
        this._svg.addEventListener("pointerup", this._whenPointerUp);
        this._svg.addEventListener("pointercancel", this._whenPointerUp);
    }

    public updateModulation(value: number | null): void {
        this._modulationValue = value;
        this._updateModulationArc();
    }

    private _updateModulationArc(): void {
        if (this._modulationValue == null) {
            this._modulationArc.setAttribute("d", "");
            return;
        }

        // Convert the normalized modulation position to the knob's value range
        const modValue = this._min + this._modulationValue * (this._max - this._min);

        // Calculate the base and modulated angles independently
        const basePercentage = (this._value - this._min) / (this._max - this._min || 1);
        const modPercentage = (modValue - this._min) / (this._max - this._min || 1);

        const baseAngle = this._bipolar ? (basePercentage * 2 - 1) * 135 : -90 + basePercentage * 180;

        const modAngle = this._bipolar ? (modPercentage * 2 - 1) * 135 : -90 + modPercentage * 180;

        if (Math.abs(modAngle - baseAngle) < 0.001) {
            this._modulationArc.setAttribute("d", "");
            return;
        }

        const radius = this.outerRadius + 6;

        const minAngle = this._bipolar ? 0 : -90;

        const x1 = 22 + Math.sin(minAngle * Math.PI / 180) * radius;
        const y1 = 22 - Math.cos(minAngle * Math.PI / 180) * radius;

        const x2 = 22 + Math.sin(modAngle * Math.PI / 180) * radius;
        const y2 = 22 - Math.cos(modAngle * Math.PI / 180) * radius;

        const delta = modAngle - minAngle;
        const sweep = delta >= 0 ? 1 : 0;
        const largeArc = Math.abs(delta) > 180 ? 1 : 0;

        this._modulationArc.setAttribute( "d", `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${x2} ${y2}`);
    }

    public setMute(isMuted: boolean): void {
        this.container.classList.toggle("muted", isMuted);
        this._svg.classList.toggle("muted", isMuted);
    }
}