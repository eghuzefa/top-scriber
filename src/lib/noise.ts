/**
 * Background "office/line" noise for adaptability drills: looped filtered
 * white noise through the WebAudio API. Started from a click handler, so the
 * autoplay policy is satisfied.
 */

const GAINS = { low: 0.035, high: 0.09 } as const

export type ActiveNoiseLevel = keyof typeof GAINS

export class NoisePlayer {
  private ctx: AudioContext | null = null
  private source: AudioBufferSourceNode | null = null

  get supported(): boolean {
    return typeof window !== 'undefined' && 'AudioContext' in window
  }

  /** Returns false when audio could not be started. */
  start(level: ActiveNoiseLevel): boolean {
    if (!this.supported) return false
    try {
      if (!this.ctx) this.ctx = new AudioContext()
      void this.ctx.resume()
      this.stop()
      const seconds = 2
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * seconds, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      const source = this.ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 950
      const gain = this.ctx.createGain()
      gain.gain.value = GAINS[level]
      source.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)
      source.start()
      this.source = source
      return true
    } catch (err) {
      console.warn('Background noise unavailable:', err)
      return false
    }
  }

  stop(): void {
    if (this.source) {
      try {
        this.source.stop()
      } catch {
        // already stopped
      }
      this.source.disconnect()
      this.source = null
    }
  }

  dispose(): void {
    this.stop()
    if (this.ctx) {
      this.ctx.close().catch(() => {})
      this.ctx = null
    }
  }
}
