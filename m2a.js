const context = new AudioContext()
var buffer = null
var sourceNode = null
var scriptProcessorNode = null
var status = null
var duration = null
var currentTime = 0
var proceessTime = 0
var oldTime = new Date()
var curt = 0
var m = 0
var s = 0
var log = console.log

// 新建音源节点
function initNode() {
	sourceNode = context.createBufferSource() //创建音源节点，用于读取音源	
	scriptProcessorNode = context.createScriptProcessor(4096, 2, 2)
}

// 重新连接结点
function connectNode() {
	sourceNode.connect(scriptProcessorNode) //连接新节点
	scriptProcessorNode.connect(context.destination) //连接新节点
}

// 断开连接
function disconnectNode() {
	try {
		scriptProcessorNode.onaudioprocess = null
		sourceNode.onended = null
		sourceNode.disconnect(scriptProcessorNode) //旧节点断开连接
		scriptProcessorNode.disconnect(context.destination) //旧节点断开连接						
		delete sourceNode.buffer
		sourceNode = null
		scriptProcessorNode = null
	} catch (e) {
		log('### error: ', e)
	}
}

// 处理音频流事件，结束播放事件
function setUpEvents() {
	sourceNode.onended = function(event) {
		disconnectNode() //断开连接
		currentTime = 0
		status = 'stop'
		log("播放完毕")
	}

	scriptProcessorNode.onaudioprocess = function(event) {
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

		if (proceessTime > 500) {
			proceessTime = 0
		}
	}
}

function play(data) {
	context.decodeAudioData(
		data,
		function(buf) {
			log('### buf: ', buf)
			buffer = buf
			status = 'play'
				// _readFormCurrentBuffer();//读取当前buffer中的音源
				// _initNode();//新建音源节点
			initNode()
			sourceNode.buffer = buf //当前音源赋值给新节点
			duration = buf.duration
			connectNode() //重新连接
			log("读取当前buffer完毕")
			oldTime = new Date()
			setUpEvents() // 处理音频流事件，结束播放事件
			
			sourceNode.start(0, 0, 15) // start offset how-long
		}
	)
}

export default play