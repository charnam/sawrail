
import system from "./game.mjs";

const TICKS_PER_SECOND = 240;

while(true) {
    await new Promise(res => setTimeout(res, 1000 / TICKS_PER_SECOND));
    await system.iterate();
}
