
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
const context = new AudioContext()
const req = new XMLHttpRequest()
req.open('GET', url, true)
req.responseType = 'arraybuffer'

req.onload = function() {
	context.decodeAudioData(
		req.response,
		function(buf) {
			log('### buf: ', buf)

			var status = null
			var currentTime = 0
			var proceessTime = 0
			var curt = 0
			var m = 0
			var s = 0

			var oldTime = new Date()

			// play(offset)
			    status = 'play'
				// _readFormCurrentBuffer();//读取当前buffer中的音源
					// _initNode();//新建音源节点
						var sourceNode = context.createBufferSource() //创建音源节点，用于读取音源	
						var scriptProcessorNode = context.createScriptProcessor(4096,2,2)
						sourceNode.buffer = buf //当前音源赋值给新节点
		                var duration = buf.duration
		                // _connectNode();//重新连接
		                	sourceNode.connect(scriptProcessorNode) //连接新节点
							scriptProcessorNode.connect(context.destination) //连接新节点
							log("读取当前buffer完毕")
							oldTime = new Date()
				sourceNode.onended = function(event) {
						// _disconnectNode() //断开连接
							try {
								scriptProcessorNode.onaudioprocess = null
								sourceNode.onended = null
								sourceNode.disconnect(scriptProcessorNode) //旧节点断开连接
								scriptProcessorNode.disconnect(context.destination) //旧节点断开连接						
								delete sourceNode.buffer
								sourceNode = null
								scriptProcessorNode = null
							} catch(e) {
								log('### error: ', e)
							}
						currentTime = 0
						status = 'stop'
						log("播放完毕")
				}

				scriptProcessorNode.onaudioprocess = function(event){
					var inputBuffer = event.inputBuffer
					var outputBuffer = event.outputBuffer

					var now = Date.now()
					var pastTime = now - oldTime

					for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
						let inputData = inputBuffer.getChannelData(channel);
						let outputData = outputBuffer.getChannelData(channel);
						for (let i = 0; i < inputBuffer.length; i++) {
							outputData[i] = inputData[i]
						}
					}

					currentTime += pastTime
					proceessTime += pastTime
					curt = currentTime / 1000

					m = parseInt(curt / 60)
				    s = parseInt(curt % 60)
				    oldTime = now

				    log(m, s, curt)

				    if( proceessTime > 500 ) {
						proceessTime = 0
					}

				}

				sourceNode.start(0, 0, 15) // start offset how-long

		},
		function(e) {
			log('error: ', e)
		}
	)
}
req.send()