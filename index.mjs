
import system from "./game.mjs";

while(true) {
    await new Promise(res => setTimeout(res, 10));
    await system.iterate();
}
