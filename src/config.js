export default {
	startLink: 'video_0001',
	videos: {
		video_0001:{
			sources: [
				{src: '/video/video_1.mp4', type: 'video/mp4'},
				//{src: 'http://mazwai.com/system/posts/videos/000/000/219/original/karekare-penn_productions.mp4?1460897027', type: 'video/mp4'},
			]
		},
		video_0002: {
			sources: [
				{src: '/video/video_2.mp4', type: 'video/mp4', qty: 'sd'}
				//{src: 'http://mazwai.com/system/posts/videos/000/000/205/original/goomalling-storm.mp4?1446983738', type: 'video/mp4', qty: 'sd'}
			]
		}
	},
	plugins: [{
		plugin: 'videolink',
		params: {
			scope: 'video', // video or player
			video: 'video_0001',
			timeStart: 1,
			timeEnd: 5,
			x: .5,
			y: .5,
			// z: 1,
			anchor: ''	// t/b/l/r/m -> top/bottom/left/right/middle => tl, br, mm, ... default: tl
		},
		settings: {

		}
	}]
}
