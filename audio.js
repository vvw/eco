
var log = console.log

class Audio {
	constructor() {
		this.status = "init" // ready,loading,playing,pause,init
		this.currentTime = 0
		this.proceessTime = 0
		this.curt = 0
		this.m = 0
		this.s = 0
		this.oldTime = new Date()			    
	}

	play() {
		this.status = 'play'
		log(this.status)
	}
}

var audio = new Audio()

export default audio

//var a = new Audio()
//log(a._oldTime)

//export function x() {
//	log('xxx...')
//}

