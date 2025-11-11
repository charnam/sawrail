
import "./browser/pcm-player.js";
import "./browser/woscope.js";

await new Promise(res => {
    document.body.addEventListener("click", () => res());
});
document.body.classList.add("clicked");

const FLUSH_TIME = 0.2;

const BUFFER_REPLENISH_AMOUNT = 0.05;
const BUFFER_REPLENISH_AT_MIN = 0.4;

// Amount of time (in seconds) to wait between checks for replenishing audio playback queue
const QUEUE_CHECK_INTERVAL = 0.05;

class AudioPlayer_Browser {

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
        this.audioPlayer = new PCMPlayer({
            channels: 2, // up/down and left/right
            sampleRate: sampleRate,
            inputCodec: "Float32",
            flushTime: FLUSH_TIME
        });
        if(getSample === null) {
            this.getSample = (time, channel) => 0;
        } else {
            this.getSample = getSample;
        }
        woscope({
            canvas: document.getElementById("woscope"),
            audioCtx: this.audioPlayer.audioCtx,
            sourceNode: this.audioPlayer.gainNode,
            live: "scriptProcessor",
            bloom: 1,
            callback: () => {
            },
            error: (msg) => {
                console.log("woscope failed with error ", msg);
            }
        });
        setInterval(() => {
            //console.log(this.audioPlayer.samples);
            if(this.audioPlayer.startTime > this.audioPlayer.audioCtx.currentTime - BUFFER_REPLENISH_AT_MIN) {
                const finalBuffer = new Float32Array(this._samplesReplenishTo);
                for(let i in finalBuffer) {
                    const currentTime = (this.currentIndex + Math.floor(i / 2)) / this.sampleRate;
                    const channel = i % 2;
                    finalBuffer[i] = this.getSample(currentTime, channel);
                }
                this.currentIndex += finalBuffer.length / 2;
                this.audioPlayer.feed(finalBuffer);
            }
        }, 1000 * QUEUE_CHECK_INTERVAL);
    }
}

export default AudioPlayer_Browser;