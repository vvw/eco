
var log = console.log
import audio from './audio.js'

function sayhi() {
	log('hi,,,')
	log(audio.oldTime)
	audio.play(0)
}
sayhi()
// export default sayhi

