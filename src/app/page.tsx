import { EmailBuilder } from "@/modules/email-builder";
import { SlackChat } from "@/modules/slack/presentation";

export default function Home() {
	return (
		<>
			<EmailBuilder />
			<SlackChat />
		</>
	);
}
