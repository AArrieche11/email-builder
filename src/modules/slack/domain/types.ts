export type Session = {
	slackUserId: string;
	threadTs?: string;
};

export type ChatMessage = {
	id: string;
	text: string;
	ts: string;
	isFromBot: boolean;
};
