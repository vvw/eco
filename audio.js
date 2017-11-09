
var log = console.log

class Audio {
	constructor() {
		this.context = new AudioContext() //实例
		this.buffer = null  // 解码后的音频数据
		this.sourceNode = null
		this.scriptProcessorNode = null
		this.status = "init" // ready,loading,playing,pause,init
		this.currentTime = 0
		this.proceessTime = 0
		this.curt = 0
		this.m = 0
		this.s = 0
		this.oldTime = new Date()		    
	}

	// 解码音频数据，做好播放准备
	refreshCurrentBuffer(data, callback){
		var self = this;
		this.context.decodeAudioData(data, function(buf){
			self.buffer = null
			self.buffer = buf
			self.status = 'ready'
			log("buffer ready.")
			callback()
		})
	}

	//新建音源节点
	initNode() {
		this.sourceNode = this.context.createBufferSource() //创建音源节点，用于读取音源	
		this.scriptProcessorNode = this.context.createScriptProcessor(4096,2,2)
	}

	// 重新连接节点
	connectNode() {
		this.sourceNode.connect(this.scriptProcessorNode) //连接新节点
		this.scriptProcessorNode.connect(this.context.destination) //连接新节点
	}

	// 断开连接
	disconnectNode() {
		try {
			this.scriptProcessorNode.onaudioprocess = null
			this.sourceNode.onended = null
			this.sourceNode.disconnect(this.scriptProcessorNode) //旧节点断开连接
			this.scriptProcessorNode.disconnect(this.context.destination) //旧节点断开连接						
			delete this.sourceNode.buffer
			this.sourceNode = null
			this.scriptProcessorNode = null
		} catch(e) {
			log('### error: ', e)
		}
	}

	// 初始化
	init(data, callback) {
		var self = this
		this.refreshCurrentBuffer(data, function(){
			self.initNode()
			self.connectNode()
			self.scriptProcessorNode.onaudioprocess = function(event){
					var inputBuffer = event.inputBuffer
					var outputBuffer = event.outputBuffer

					var now = Date.now()
					var pastTime = now - self.oldTime

					for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
						let inputData = inputBuffer.getChannelData(channel);
						let outputData = outputBuffer.getChannelData(channel);
						for (let i = 0; i < inputBuffer.length; i++) {
							outputData[i] = inputData[i]
						}
					}

					self.currentTime += pastTime
					self.proceessTime += pastTime
					self.curt = self.currentTime / 1000

					self.m = parseInt(self.curt / 60)
				    self.s = parseInt(self.curt % 60)
				    self.oldTime = now

				    log(self.m, self.s, self.curt, self.status)

				    if ( self.proceessTime > 500 ) {
						self.proceessTime = 0
					}
			}
			self.oldTime = new Date()
			log('play ready.')
			callback()
		})
	}

	play() {
		this.status = 'play'
		log(this.status)
		this.sourceNode.onended = function(event) {
			this.currentTime = 0
			this.status = 'stop'
			log('########## play end.')
		}
		this.sourceNode.start(0, 0, 15) // start offset how-long
	}
}

var audio = new Audio()

export default audio

//var a = new Audio()
//log(a._oldTime)

//export function x() {
//	log('xxx...')
//}

