
import AudioPlayer from "./AudioPlayer.mjs";

function distancePoints(x1, y1, x2, y2) {
	let x = y2 - y1;
	let y = x2 - x1;
	return Math.sqrt(x * x + y * y);
}

class Engine {
    framebuffer = [];
    musicStartTime = 0;
    volume = 1;

    get musicCurrentTime() {
        return (Date.now() - this.musicStartTime);
    }

    get simplifiedFramebuffer() {
        let currentTime = 0;
        let lastPoint = [0,0];
        return this.framebuffer.map(polygon => {
            return polygon.pointsOut.map((point, pointOfPolygon) => {
                const dist = distancePoints(
                    point[0], point[1],
                    lastPoint[0], lastPoint[1]
                );
                lastPoint = point;
                if(pointOfPolygon === 0) {
                    return [currentTime, ...point];
                } else {
                    return [currentTime += dist * polygon.brightness, ...point];
                }
            });
        }).flat().map(strange => [
            strange[0] / currentTime,
            ...strange.filter((_item, index) => index > 0)
        ]);
    }

    getWaveAt(time, channel) {
        const framebuffer = this.simplifiedFramebuffer;
        if(framebuffer.length == 0) {
            return 0;
        }
        time = time % 1;

        let pointsToInterpolate = [null, null];
        for(let point of framebuffer) {
            if(point[0] <= time)
                pointsToInterpolate[0] = point;
            else if(point[0] > time && pointsToInterpolate[1] === null)
                pointsToInterpolate[1] = point;
        }

        if(pointsToInterpolate.filter(point => point !== null).length == 2) {
            const interpolation = 
                (time - pointsToInterpolate[0][0]) / 
                (pointsToInterpolate[1][0] - pointsToInterpolate[0][0]);
            return (
                pointsToInterpolate[0][channel + 1] * (1 - interpolation) +
                pointsToInterpolate[1][channel + 1] * interpolation
            ) * (channel === 1 ? -1 : 1);
        } else {
            return 0;
        }
    }

    music(time, channel) {
        return this.getWaveAt(time * 60, channel);
    }
    setMusic(music) {
        this.audioPlayer.currentIndex = 0;
        this.musicStartTime = Date.now();
        this.music = music;
    }
    constructor(frequency) {
        this.audioPlayer = new AudioPlayer(frequency, (time, channel) => {
            const output = this.getWaveAt(this.music(time), channel);
            return output;
        });
    }
}

export default Engine;
