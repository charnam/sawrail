
export default (
    typeof window === "undefined" ?
        (await import("./platform/input.sdl.mjs")).default :
        (await import("./platform/input.browser.mjs")).default
);
