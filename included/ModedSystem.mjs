
class ModedSystem {
    modes = {};
    modeState = null;
    currentMode = null;
    modeInitData = null;
    _iteratedMode = null;

    setMode(mode, modeInitData = null) {
        this.currentMode = mode;
        this.modeInitData = modeInitData;
    }

    async iterate() {
        if(this.currentMode == null) return;

        if(this.currentMode !== this._iteratedMode) {
            this.modeState = await this.modes[this.currentMode].init(this.modeInitData);
            this._iteratedMode = this.currentMode;
            this.modeInitData = null;
        }

        await this.modes[this.currentMode].loop(this.modeState);
    }

    constructor(modes) {
        this.modes = modes;
    }
}

export default ModedSystem;
