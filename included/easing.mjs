
function clamp01(x) {
    return Math.max(0, Math.min(x, 1));
}
function easeIn(x) {
    return 1-clamp01(x)**2;
}
function easeOut(x) {
    return clamp01(1-x)**2;
}
function easeInOut(t){
    return 1-clamp01(t > 0.5 ? 4*Math.pow((t-1),3)+1 : 4*Math.pow(t,3),1);
}

export {
    clamp01,
    easeIn,
    easeInOut,
    easeOut
};
