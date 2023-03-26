var chatSence = [{
	title: 'AI回答',
	desc: '轻松获取',
	icon: '/static/images/answer.png',
	scene: 1,
	tips: '请输入您的问题',
	question: '{question}',
	placeholder: '请详细描述您的问题,描述越详尽,得到的据结果越精准(支持长按粘贴您的问题哦)',
	btnText: '获取答案'
}, {
	title: '引导写作',
	desc: '生成论文大纲',
	icon: '/static/images/ai-writing.png',
	scene: 2,
	tips: '生成一份关于_____的论文大纲',
	question: '生成一份关于{question}的论文大纲',
	placeholder: '请输入您的研究主题(支持长按粘贴您的描述哦)',
	btnText: '生成大纲'
}, {
	title: '语法修正',
	desc: '修复错误语法',
	icon: '/static/images/ai-answer.png',
	scene: 3,
	tips: '将下面文字更正为标准',
	question: '将下面文字更正为标准{lang}：{question}',
	placeholder: '请输入您需要修正语法的文案内容(支持长按粘贴您的描述哦)',
	btnText: '修正语法'
}, {
	title: '提取关键词',
	desc: '免去繁琐搜索',
	icon: '/static/images/ai-code.png',
	scene: 4,
	tips: '提取下面文案中的关键词',
	question: '提取下面文案中的关键词：{question}',
	placeholder: '请输入您需要提取关键词的文案内容(支持长按粘贴您的描述哦)',
	btnText: '提取关键词'
}, {
	title: '智能翻译',
	desc: '让语言无国界',
	icon: '/static/images/ai-limit.png',
	scene: 5,
	tips: '将下面文案翻译成',
	question: '将下面文案翻译成{lang}：{question}',
	placeholder: '请输入您需要翻译的文案内容(支持长按粘贴您的描述哦)',
	btnText: '智能翻译'
}, {
	title: '更多场景',
	desc: '正在开发中...',
	icon: '/static/images/ai-online.png',
	scene: 6,
	tips: '',
	question: '',
	placeholder: '',
	btnText: ''
}];


export default {
	chatSence
}
