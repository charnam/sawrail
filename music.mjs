
function getAbacabaFrequencyAtTime(time) {
	let a = time+1;
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
	return out;
}

function debug(time) {
	return time*120;
}
function slow(time) {
	return time*32;
}

function stage_switch(time) {
	return time * Math.floor(time * 16 + 4)**2.1;
}

function ticktock(stage) {
	return function(time) {
		if(stage == 0) {
			let out = time * Math.floor(time + 1) * 30;
			if(time % 4 < 3)
				out *= ((time % 1) * 0.1 + 1);
			else
				out *= 1.2;
			return out;
		}
		
		if(time * stage % 8 >= 6.5 && time * stage % 0.5 < 0.01 * stage) {
			return time * Math.floor(time * stage % 8) ** 5;
		}
		
		if(time * stage % 1 < 0.01 * stage)
			time *= 240;
		else if(time * stage % 0.5 < 0.01 * stage)
			return time * 120;
		else if(time * stage % 0.25 < 0.01 * stage)
			return time * 60;
		
		
		return time * getAbacabaFrequencyAtTime(time*4*stage);
	}
}

function sawpi(time) {
	const out = getAbacabaFrequencyAtTime(time*4);
	
	if((time*2) & 32)
		time*=2;
	if((time*2) & 16) {
		time*=4;
		time*=((time*64)&127)/128;
	}
	
	return time*out;
}

export {
    sawpi,
	debug,
	slow,
	ticktock,
	stage_switch
};
