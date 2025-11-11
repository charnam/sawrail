
import "./browser/pcm-player.js";
import "./browser/woscope.js";

await new Promise(res => {
    document.body.addEventListener("click", () => res());
});
document.body.classList.add("clicked");

// Amount of time to generate sound before outputting to the speakers.
// High values delay output more, low values can result in speakers "clicking"
const FLUSH_TIME = 0.01;

// Maximum amount of playback time left before replenishing buffer.
// Should be a lot more than the value of FLUSH_TIME to prevent clicking.
const BUFFER_REPLENISH_AT_MIN = 0.04;
// Amount of buffer to replenish at each queue check
const BUFFER_REPLENISH_AMOUNT = 0.005;

// Amount of time (in seconds) to wait between checks for replenishing audio playback queue
const QUEUE_CHECK_INTERVAL = 0.001;

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
            encoding: "32bitFloat",
            flushingTime: FLUSH_TIME * 1000
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
            const samplesOverdue = this.audioPlayer.audioCtx.currentTime + BUFFER_REPLENISH_AT_MIN - this.audioPlayer.startTime;
            if(samplesOverdue > 0) {
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