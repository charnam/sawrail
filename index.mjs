
import * as game from "./game.mjs";
import ModedSystem from "./included/ModedSystem.mjs";

const system = new ModedSystem(game.modes);

system.setMode(game.initialMode);
while(true) {
    await new Promise(res => setTimeout(res, 10));
    await system.iterate();
}
