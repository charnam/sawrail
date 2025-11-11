
class ModedSystem {
    modes = {};
    modeState = null;
    currentMode = null;
    _iteratedMode = null;

    setMode(mode) {
        this.currentMode = mode;
    }

    async iterate() {
        if(this.currentMode == null) return;

        if(this.currentMode !== this._iteratedMode) {
            this.modeState = await this.modes[this.currentMode].init();
            this._iteratedMode = this.currentMode;
        }

        await this.modes[this.currentMode].loop(this.modeState);
    }

    constructor(modes) {
        this.modes = modes;
    }
}

export default ModedSystem;
