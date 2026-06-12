"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Loader2, Lock } from "lucide-react";

const POLL_INTERVAL_MS = 3000;

export default function SlackChat() {
	const [isOpen, setIsOpen] = useState(() => {
		if (typeof window === "undefined") return false;
		return new URLSearchParams(window.location.search).get("chat") === "open";
	});
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isCheckingSession, setIsCheckingSession] = useState(true);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const messagesEndRef = useRef(null);
	const pollRef = useRef(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const fetchMessages = useCallback(async ({ showLoading = false } = {}) => {
		if (showLoading) setIsLoading(true);

		try {
			const response = await fetch("/api/slack/chat");
			const data = await response.json();

			if (response.status === 401) {
				setIsAuthenticated(false);
				throw new Error(data.error ?? "Sesión expirada. Pedile un nuevo enlace a GENAIBOT.");
			}

			if (!response.ok || !data.ok) {
				throw new Error(data.error ?? "No se pudieron cargar los mensajes");
			}

			setMessages(data.messages ?? []);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al cargar mensajes");
		} finally {
			if (showLoading) setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				const response = await fetch("/api/slack/session");
				const data = await response.json();
				const authed = Boolean(data.ok && data.authenticated);

				if (cancelled) return;
				setIsAuthenticated(authed);

				if (authed) {
					await fetchMessages({ showLoading: true });
				}
			} catch {
				if (!cancelled) setIsAuthenticated(false);
			} finally {
				if (!cancelled) setIsCheckingSession(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [fetchMessages]);

	useEffect(() => {
		if (!isOpen || !isAuthenticated) return;

		pollRef.current = setInterval(() => {
			void fetchMessages();
		}, POLL_INTERVAL_MS);

		return () => {
			if (pollRef.current) clearInterval(pollRef.current);
		};
	}, [isOpen, isAuthenticated, fetchMessages]);

	const toggleChat = () => {
		setIsOpen((open) => {
			const next = !open;
			if (next && isAuthenticated) {
				void fetchMessages({ showLoading: true });
			}
			return next;
		});
	};

	useEffect(() => {
		if (isOpen) scrollToBottom();
	}, [messages, isOpen, scrollToBottom]);

	const sendMessage = async (event) => {
		event.preventDefault();
		const text = input.trim();
		if (!text || isSending || !isAuthenticated) return;

		setIsSending(true);
		setError(null);

		try {
			const response = await fetch("/api/slack/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text }),
			});
			const data = await response.json();

			if (response.status === 401) {
				setIsAuthenticated(false);
				throw new Error(data.error ?? "Sesión expirada. Pedile un nuevo enlace a GENAIBOT.");
			}

			if (!response.ok || !data.ok) {
				throw new Error(data.error ?? "No se pudo enviar el mensaje");
			}

			setInput("");
			await fetchMessages();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al enviar mensaje");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<>
			{isOpen && (
				<div
					style={{
						position: "fixed",
						bottom: 88,
						right: 24,
						width: 360,
						maxWidth: "calc(100vw - 48px)",
						height: 480,
						maxHeight: "calc(100vh - 120px)",
						background: "#fff",
						borderRadius: 16,
						boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
						display: "flex",
						flexDirection: "column",
						zIndex: 9999,
						overflow: "hidden",
						animation: "slackChatSlideIn 0.2s ease-out",
					}}
				>
					<div
						style={{
							padding: "16px 18px",
							background: "linear-gradient(135deg, #7646FF 0%, #5B2FD9 100%)",
							color: "#fff",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<div>
							<div style={{ fontWeight: 600, fontSize: 15 }}>GENAIBOT</div>
							<div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
								Asistente de textos para email
							</div>
						</div>
						<button
							type="button"
							onClick={toggleChat}
							aria-label="Cerrar chat"
							style={{
								background: "rgba(255,255,255,0.15)",
								border: "none",
								borderRadius: 8,
								padding: 6,
								cursor: "pointer",
								color: "#fff",
								display: "flex",
							}}
						>
							<X size={18} />
						</button>
					</div>

					<div
						style={{
							flex: 1,
							overflowY: "auto",
							padding: 16,
							background: "#F7F8FA",
							display: "flex",
							flexDirection: "column",
							gap: 10,
						}}
					>
						{isCheckingSession ? (
							<div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
								<Loader2 size={24} style={{ color: "#7646FF", animation: "spin 1s linear infinite" }} />
							</div>
						) : !isAuthenticated ? (
							<div style={{ textAlign: "center", color: "#5a6268", fontSize: 13, padding: "24px 16px", lineHeight: 1.6 }}>
								<Lock size={28} style={{ color: "#7646FF", marginBottom: 12 }} />
								<div style={{ fontWeight: 600, marginBottom: 8 }}>Chat privado con GENAIBOT</div>
								<div>
									Escribile a <strong>GENAIBOT</strong> en Slack y pedile el enlace al Email Builder
									(o enviá <em>web</em>, <em>builder</em> o <em>enlace</em>).
								</div>
							</div>
						) : isLoading && messages.length === 0 ? (
							<div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
								<Loader2 size={24} style={{ color: "#7646FF", animation: "spin 1s linear infinite" }} />
							</div>
						) : messages.length === 0 ? (
							<div style={{ textAlign: "center", color: "#8b959e", fontSize: 13, padding: "24px 12px" }}>
								Tu conversación con GENAIBOT está lista. Escribí tu primer mensaje.
							</div>
						) : (
							messages.map((message) => (
								<div
									key={message.id}
									style={{
										alignSelf: message.isFromBot ? "flex-start" : "flex-end",
										maxWidth: "85%",
									}}
								>
									<div
										style={{
											padding: "10px 14px",
											borderRadius: message.isFromBot ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
											background: message.isFromBot ? "#fff" : "#7646FF",
											color: message.isFromBot ? "#1a1c1f" : "#fff",
											fontSize: 14,
											lineHeight: 1.5,
											boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
										}}
									>
										{message.text}
									</div>
								</div>
							))
						)}
						<div ref={messagesEndRef} />
					</div>

					{error && (
						<div style={{ padding: "8px 16px", background: "#FEF2F2", color: "#B91C1C", fontSize: 12 }}>
							{error}
						</div>
					)}

					{isAuthenticated && (
						<form
							onSubmit={sendMessage}
							style={{
								padding: 12,
								borderTop: "1px solid #E8EAED",
								display: "flex",
								gap: 8,
								background: "#fff",
							}}
						>
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Escribí tu mensaje..."
								disabled={isSending}
								style={{
									flex: 1,
									padding: "10px 14px",
									border: "1px solid #E8EAED",
									borderRadius: 10,
									fontSize: 14,
									outline: "none",
									color: "#000",
								}}
							/>
							<button
								type="submit"
								disabled={isSending || !input.trim()}
								aria-label="Enviar mensaje"
								style={{
									background: "#7646FF",
									border: "none",
									borderRadius: 10,
									padding: "10px 14px",
									cursor: isSending || !input.trim() ? "not-allowed" : "pointer",
									opacity: isSending || !input.trim() ? 0.5 : 1,
									color: "#fff",
									display: "flex",
									alignItems: "center",
								}}
							>
								{isSending ? (
									<Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
								) : (
									<Send size={18} />
								)}
							</button>
						</form>
					)}
				</div>
			)}

			<button
				type="button"
				onClick={toggleChat}
				aria-label={isOpen ? "Cerrar chat de GENAIBOT" : "Abrir chat de GENAIBOT"}
				style={{
					position: "fixed",
					bottom: 24,
					right: 24,
					width: 56,
					height: 56,
					borderRadius: "50%",
					background: "linear-gradient(135deg, #7646FF 0%, #5B2FD9 100%)",
					border: "none",
					boxShadow: "0 4px 16px rgba(118, 70, 255, 0.4)",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "#fff",
					zIndex: 9999,
					transition: "transform 0.2s ease",
				}}
				onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
				onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
			>
				{isOpen ? <X size={24} /> : <MessageSquare size={24} />}
			</button>

			<style>{`
				@keyframes slackChatSlideIn {
					from { transform: translateY(12px); opacity: 0; }
					to { transform: translateY(0); opacity: 1; }
				}
				@keyframes spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
			`}</style>
		</>
	);
}
