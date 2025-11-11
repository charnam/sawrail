
function debug(time) {
	return time*120;
}
function slow(time) {
	return time*32;
}

function stage_switch(time) {
	return time * Math.floor(time * 16 + 4)**4;
}

function ticktock(stage) {
	return time => {
		if(stage == 0) {
			return time * Math.floor(time + 1) * 30 * ((time % 1) * 0.05 + 1);
		}
		
		time = time * stage;
		
		if(time % 8 >= 6.5 && time % 0.5 < 0.01) {
			return time * Math.floor(time % 8) ** 5;
		}
		
		if(time % 1 < 0.01)
			return time * 240;
		else if(time % 0.5 < 0.01)
			return time * 120;
		else if(time % 0.25 < 0.01)
			return time * 60;
		
		let a = time*4+1;
		let char = Math.floor(a)**2;
		let out = 65.4;
		let loops = 0;
		while(loops < 100000) {
			if(char & (1<<(loops))) {
				let root = (loops/2)*5;
				for(let i = 0; i < root; i++) {
					out*=1.06;
				}
				break;
			}
			loops++;
		}
		
		return time * out;
	}
}

function sawpi(time) {
	let a = time*4+1;
	let char = Math.floor(a)**2;
	let out = 65.4;
	let loops = 0;
	while(loops < 100000) {
		if(char & (1<<(loops))) {
			let root = (loops/2)*5;
			for(let i = 0; i < root; i++) {
				out*=1.06
			}
			break;
		}
		loops++;
	}
	if((time*2) & 32)
		time*=2;
	if((time*2) & 16) {
		time*=4;
		time*=((time*64)&127)/128;
	}
	return time*out; // + Math.random();
}

export {
    sawpi,
	debug,
	slow,
	ticktock,
	stage_switch
};
