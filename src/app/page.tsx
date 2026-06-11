import EmailBuilder from "./components/email_builder";
import SlackChat from "./components/slack_chat";

export default function Home() {
	return (
		<>
			<EmailBuilder />
			<SlackChat />
		</>
	);
}
