
export default (
    typeof window === "undefined" ?
        (await import("./platform/AudioPlayer.sdl.mjs")).default :
        (await import("./platform/AudioPlayer.browser.mjs")).default
);
