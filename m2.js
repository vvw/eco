import play from './m2a.js'

// https://github.com/changelime/player/blob/master/src/js/lib/audio.js

var log = console.log
var AudioContext =
	window.AudioContext ||
	window.webkitAudioContext ||
	window.mozAudioContext ||
	window.oAudioContext ||
	window.msAudioContext

var hasWebAudioAPI = {
	data: !!AudioContext && location.protocol.indexOf('http') !== -1
}

log(AudioContext, hasWebAudioAPI.data)

const url = '015 United States - Obamacare repeal.mp3' //'http://127.0.0.1:8888'

const req = new XMLHttpRequest()
req.open('GET', url, true)
req.responseType = 'arraybuffer'

req.onload = function() {
	play(req.response)
}
req.send()