// Copyright (c) John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

// EffectState.ts is *not* at the point it should be, so I'm
// reminding myself to finish this /synth rebuild in the future.

export class Grain {
    public delayLinePosition: number; // Relative to latest sample

    public ageInSamples: number;
    public maxAgeInSamples: number;
    public delay: number;

    //parabolic envelope implementation
    public parabolicEnvelopeAmplitude: number;
    public parabolicEnvelopeSlope: number;
    public parabolicEnvelopeCurve: number;

    //raised cosine bell envelope implementation
    public rcbEnvelopeAmplitude: number;
    public rcbEnvelopeAttackIndex: number;
    public rcbEnvelopeReleaseIndex: number;
    public rcbEnvelopeSustain: number;

    constructor() {
        this.delayLinePosition = 0;

        this.ageInSamples = 0;
        this.maxAgeInSamples = 0;
        this.delay = 0;

        this.parabolicEnvelopeAmplitude = 0;
        this.parabolicEnvelopeSlope = 0;
        this.parabolicEnvelopeCurve = 0;

        this.rcbEnvelopeAmplitude = 0;
        this.rcbEnvelopeAttackIndex = 0;
        this.rcbEnvelopeReleaseIndex = 0;
        this.rcbEnvelopeSustain = 0;
    }

    public initializeParabolicEnvelope(durationInSamples: number, amplitude: number): void {
        this.parabolicEnvelopeAmplitude = 0;
        if (durationInSamples == 0) durationInSamples++; //prevent division by 0
        const invDuration: number = 1.0 / durationInSamples;
        const invDurationSquared: number = invDuration * invDuration;
        this.parabolicEnvelopeSlope = 4.0 * amplitude * (invDuration - invDurationSquared);
        this.parabolicEnvelopeCurve = -8.0 * amplitude * invDurationSquared;
    }

    public updateParabolicEnvelope(): void {
        this.parabolicEnvelopeAmplitude += this.parabolicEnvelopeSlope;
        this.parabolicEnvelopeSlope += this.parabolicEnvelopeCurve;
    }

    //rcb is unfinished and unused rn
    public initializeRCBEnvelope(durationInSamples: number, amplitude: number): void {
        // attack:
        this.rcbEnvelopeAttackIndex = Math.floor(durationInSamples / 6);
        // sustain:
        this.rcbEnvelopeSustain = amplitude;
        // release:
        this.rcbEnvelopeReleaseIndex = Math.floor(durationInSamples * 5 / 6);
    }

    public updateRCBEnvelope(): void {
        if (this.ageInSamples < this.rcbEnvelopeAttackIndex) { //attack
            this.rcbEnvelopeAmplitude = (1.0 + Math.cos(Math.PI + (Math.PI * (this.ageInSamples / this.rcbEnvelopeAttackIndex) * (this.rcbEnvelopeSustain / 2.0))));
        } else if (this.ageInSamples > this.rcbEnvelopeReleaseIndex) { //release
            this.rcbEnvelopeAmplitude = (1.0 + Math.cos(Math.PI * ((this.ageInSamples - this.rcbEnvelopeReleaseIndex) / this.rcbEnvelopeAttackIndex)) * (this.rcbEnvelopeSustain / 2.0));
        } //sustain covered by the end of attack
    }

    public addDelay(delay: number): void {
        this.delay = delay;
    }
}