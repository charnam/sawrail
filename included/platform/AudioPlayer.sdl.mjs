import sdl from "@kmamal/sdl";

// Amount of samples for the underlying SDL engine to receive before flushing to the speakers
const SDL_BUFFER_COUNT = 1024;

const BUFFER_REPLENISH_AMOUNT = 0.05;
const BUFFER_REPLENISH_AT_MIN = 0.4;

// Amount of time (in seconds) to wait between checks for replenishing audio playback queue
const QUEUE_CHECK_INTERVAL = 0.05;

const SDL_AUDIO_FORMAT = "s16";
const BYTES_PER_SAMPLE = sdl.audio.bytesPerSample(SDL_AUDIO_FORMAT);

const MIN_SAMPLE_VALUE = sdl.audio.minSampleValue(SDL_AUDIO_FORMAT);
const MAX_SAMPLE_VALUE = sdl.audio.maxSampleValue(SDL_AUDIO_FORMAT);

class AudioPlayer_SDL {

    sampleRate = 8000;
    currentIndex = 0;
    
    get _samplesReplenishAt() {
        return Math.floor(this.sampleRate * BUFFER_REPLENISH_AT_MIN) * 2; // both audio channels (2)
    }
    get _samplesReplenishTo() {
        return Math.floor(this.sampleRate * BUFFER_REPLENISH_AMOUNT) * 2; // both audio channels (2)
    }

    constructor(sampleRate, getSample = null) {
        this.sampleRate = sampleRate;
        this.audioPlayer = sdl.audio.openDevice({ type: 'playback' }, {
            channels: 2, // up/down and left/right
            frequency: sampleRate,
            format: SDL_AUDIO_FORMAT,
            buffered: SDL_BUFFER_COUNT
        });
        if(getSample === null) {
            this.getSample = (time, channel) => 0;
        } else {
            this.getSample = getSample;
        }
        setInterval(() => {
            if(this.audioPlayer.queued <= this._samplesReplenishAt) {
                const finalBuffer = Buffer.alloc(this._samplesReplenishTo * BYTES_PER_SAMPLE);
                for(let i = 0; i < finalBuffer.length; i+=BYTES_PER_SAMPLE) {
                    const currentTime = (this.currentIndex + (Math.floor(i / 2) / BYTES_PER_SAMPLE)) / this.sampleRate;
                    const channel = (i / BYTES_PER_SAMPLE) % 2;
                    let sample = this.getSample(currentTime, channel);
                    sample = sample * MAX_SAMPLE_VALUE;
                    sample = Math.min(Math.max(MIN_SAMPLE_VALUE, sample), MAX_SAMPLE_VALUE);
                    sdl.audio.writeSample(
                        SDL_AUDIO_FORMAT,
                        finalBuffer,
                        sample,
                        i
                    );
                }
                this.currentIndex += Math.floor(finalBuffer.length / 2 / BYTES_PER_SAMPLE);
                this.audioPlayer.enqueue(finalBuffer);
                if(!this.audioPlayer.playing) {
                    this.audioPlayer.play();
                }
            }
        }, 1000 * QUEUE_CHECK_INTERVAL);
    }
}

export default AudioPlayer_SDL;