
var log = console.log
import audio from './audio.js'

const url = '015 United States - Obamacare repeal.mp3' //'http://127.0.0.1:8888'
const req = new XMLHttpRequest()
req.open('GET', url, true)
req.responseType = 'arraybuffer'
req.onload = function() {
	log('mp3 loaded.')
	log('audio data decoding...')
	audio.init(req.response, function(){
		log('audio data decoded.')
		log('now mp3 playing...')
		audio.play(0)
	})
}
log('mp3 loading...')
req.send()


/*
function sayhi() {
	log('hi,,,')
	log(audio.oldTime)
	audio.play(0)
}
sayhi()*/
// export default sayhi

