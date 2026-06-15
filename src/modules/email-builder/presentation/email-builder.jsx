"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
	Plus, Trash2, ChevronUp, ChevronDown, Copy, Check, RotateCcw,
	Type, AlignLeft, MessageSquare, MousePointerClick, FileSignature,
	Minus, Heading, List, ListOrdered, Hash, X, Eye, Code2,
	Download, Languages, Loader2, AlertCircle
} from "lucide-react";

// =========================================================================
// CONSTANTES
// =========================================================================

const LANGS = [
	{ code: "es", label: "ES", name: "Español" },
	{ code: "en", label: "EN", name: "English" },
	{ code: "pt", label: "PT", name: "Português" },
];
const LANG_CODES = LANGS.map(l => l.code);

const HEADER_HTML = `<tr align="center">
        <td align="center" style='padding-top: 40px; padding-bottom: 16px;font-size:21px; vertical-align: middle; text-align: center;'>
            <a href="https://midi.io/" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/Logo.png" alt="Midi" style="height: 20px; text-align: center; border: 0;"></a>
        </td>
    </tr>`;

const FOOTER_HTML_BY_LANG = {
	es: `<tr align="center">
        <td align='center'>
            <div align='center' style='max-width: 540px; margin-left: 20px; margin-right: 20px; border-top:1px solid rgba(151, 151, 151, 0.2)'></div>
        </td>
    </tr>
    <tr>
        <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr align='left'>
                    <td align='left' style='padding-top: 48px; padding-bottom: 24px; padding-left: 28px;'>
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style='padding-right: 16px;'><a href="https://www.linkedin.com/company/midiglobal" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/Linkedin.png" alt="LinkedIn" style="height: 24px; display: block; border: 0;"></a></td>
                                <td style='padding-right: 16px;'><a href="https://www.instagram.com/midiglobal/" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/Instagram.png" alt="Instagram" style="height: 24px; display: block; border: 0;"></a></td>
                                <td style='padding-right: 16px;'><a href="https://www.tiktok.com/@midi.global?_t=8rkDcYPnPCZ&_r=1" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/Tiktok.png" alt="TikTok" style="height: 24px; display: block; border: 0;"></a></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr align='left'>
                    <td align='left' style='font-family: HelveticaNeue-Light, helvetica, arial; font-size:14px; color:#8b959e; line-height: 150%; padding-bottom: 16px; padding-left: 28px;'>
                        <span>Copyright &reg; 2026; <a href='https://midi.io/' target='_blank' style='text-decoration:none; color:#0000EE; text-decoration: underline;'>Midi</a>; All rights reserved.</span>
                    </td>
                </tr>
                <tr align='left'>
                    <td align='left' style='font-family: HelveticaNeue-Light, helvetica, arial; font-size:14px; color:#8b959e; line-height: 150%; padding: 0 28px 24px 28px; text-align: left;'>
                        Si quieres conocer m&aacute;s sobre Midi, la entidad que presta el servicio, haz clic <a href='https://midi.io/' target='_blank' style='text-decoration:none; color:#0000EE; text-decoration: underline;'>aqu&iacute;</a>. Tambi&eacute;n puedes escribirnos a <a href="mailto:support@midi.io" style='text-decoration:none; color:#0000EE; text-decoration: underline;'>info@midi.io</a> o contactarnos desde el chat de la app.
                    </td>
                </tr>
                <tr align='center'>
                    <td align='center' style='padding-bottom: 80px;'><a href="https://midi.io/" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/LogoFooter.png" alt="Midi" style="height: 20px; display: block; border: 0;"></a></td>
                </tr>
            </table>
        </td>
    </tr>`,
	en: `<tr align="center">
        <td align='center'>
            <div align='center' style='max-width: 540px; margin-left: 20px; margin-right: 20px; border-top:1px solid rgba(151, 151, 151, 0.2)'></div>
        </td>
    </tr>
    <tr>
        <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr align='left'>
                    <td align='left' style='padding-top: 48px; padding-bottom: 24px; padding-left: 28px;'>
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style='padding-right: 16px;'><a href="https://www.linkedin.com/company/midiglobal" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/Linkedin.png" alt="LinkedIn" style="height: 24px; display: block; border: 0;"></a></td>
                                <td style='padding-right: 16px;'><a href="https://www.instagram.com/midiglobal/" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/Instagram.png" alt="Instagram" style="height: 24px; display: block; border: 0;"></a></td>
                                <td style='padding-right: 16px;'><a href="https://www.tiktok.com/@midi.global?_t=8rkDcYPnPCZ&_r=1" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/Tiktok.png" alt="TikTok" style="height: 24px; display: block; border: 0;"></a></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr align='left'>
                    <td align='left' style='font-family: HelveticaNeue-Light, helvetica, arial; font-size:14px; color:#8b959e; line-height: 150%; padding-bottom: 16px; padding-left: 28px;'>
                        <span>Copyright &reg; 2026; <a href='https://midi.io/' target='_blank' style='text-decoration:none; color:#0000EE; text-decoration: underline;'>Midi</a>; All rights reserved.</span>
                    </td>
                </tr>
                <tr align='left'>
                    <td align='left' style='font-family: HelveticaNeue-Light, helvetica, arial; font-size:14px; color:#8b959e; line-height: 150%; padding: 0 28px 24px 28px; text-align: left;'>
                        To learn more about Midi, the entity providing the service, click <a href='https://midi.io/' target='_blank' style='text-decoration:none; color:#0000EE; text-decoration: underline;'>here</a>. You can also write to us at <a href="mailto:support@midi.io" style='text-decoration:none; color:#0000EE; text-decoration: underline;'>info@midi.io</a> or contact us via the chat in the app.
                    </td>
                </tr>
                <tr align='center'>
                    <td align='center' style='padding-bottom: 80px;'><a href="https://midi.io/" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/LogoFooter.png" alt="Midi" style="height: 20px; display: block; border: 0;"></a></td>
                </tr>
            </table>
        </td>
    </tr>`,
	pt: `<tr align="center">
        <td align='center'>
            <div align='center' style='max-width: 540px; margin-left: 20px; margin-right: 20px; border-top:1px solid rgba(151, 151, 151, 0.2)'></div>
        </td>
    </tr>
    <tr>
        <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr align='left'>
                    <td align='left' style='padding-top: 48px; padding-bottom: 24px; padding-left: 28px;'>
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style='padding-right: 16px;'><a href="https://www.linkedin.com/company/midiglobal" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/Linkedin.png" alt="LinkedIn" style="height: 24px; display: block; border: 0;"></a></td>
                                <td style='padding-right: 16px;'><a href="https://www.instagram.com/midiglobal/" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/Instagram.png" alt="Instagram" style="height: 24px; display: block; border: 0;"></a></td>
                                <td style='padding-right: 16px;'><a href="https://www.tiktok.com/@midi.global?_t=8rkDcYPnPCZ&_r=1" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/Tiktok.png" alt="TikTok" style="height: 24px; display: block; border: 0;"></a></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr align='left'>
                    <td align='left' style='font-family: HelveticaNeue-Light, helvetica, arial; font-size:14px; color:#8b959e; line-height: 150%; padding-bottom: 16px; padding-left: 28px;'>
                        <span>Copyright &reg; 2026; <a href='https://midi.io/' target='_blank' style='text-decoration:none; color:#0000EE; text-decoration: underline;'>Midi</a>; Todos os direitos reservados.</span>
                    </td>
                </tr>
                <tr align='left'>
                    <td align='left' style='font-family: HelveticaNeue-Light, helvetica, arial; font-size:14px; color:#8b959e; line-height: 150%; padding: 0 28px 24px 28px; text-align: left;'>
                        Para saber mais sobre a Midi, a entidade que presta o servi&ccedil;o, clique <a href='https://midi.io/' target='_blank' style='text-decoration:none; color:#0000EE; text-decoration: underline;'>aqui</a>. Voc&ecirc; tamb&eacute;m pode nos escrever para <a href="mailto:support@midi.io" style='text-decoration:none; color:#0000EE; text-decoration: underline;'>info@midi.io</a> ou nos contatar pelo chat do app.
                    </td>
                </tr>
                <tr align='center'>
                    <td align='center' style='padding-bottom: 80px;'><a href="https://midi.io/" target='_blank'><img src="https://midi-images.s3.eu-west-3.amazonaws.com/e-mails/LogoFooter.png" alt="Midi" style="height: 20px; display: block; border: 0;"></a></td>
                </tr>
            </table>
        </td>
    </tr>`,
};

// =========================================================================
// HELPERS — i18n
// =========================================================================

const i18n = (es = "", en = "", pt = "") => ({ es, en, pt });
const newId = (prefix = "b") => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const ensureI18n = (val) => {
	if (typeof val === "string") return { es: val, en: "", pt: "" };
	if (val && typeof val === "object") {
		return { es: val.es || "", en: val.en || "", pt: val.pt || "" };
	}
	return { es: "", en: "", pt: "" };
};

const get = (field, lang) => (field || {})[lang] || "";

const migrateBlock = (block) => {
	const next = { ...block };
	switch (block.type) {
		case "title":
			next.text = ensureI18n(block.text);
			break;
		case "paragraph":
			next.greeting = ensureI18n(block.greeting);
			next.body = ensureI18n(block.body);
			break;
		case "callout":
			next.items = (block.items || []).map(item => {
				if (item.kind === "heading" || item.kind === "text") {
					return { ...item, text: ensureI18n(item.text) };
				} else if (item.kind === "bullets" || item.kind === "numbered") {
					return { ...item, items: (item.items || []).map(ensureI18n) };
				} else if (item.kind === "code") {
					return { ...item, text: ensureI18n(item.text), subtitle: ensureI18n(item.subtitle) };
				}
				return item;
			});
			break;
		case "code_callout":
			next.code = ensureI18n(block.code);
			next.subtitle = ensureI18n(block.subtitle);
			break;
		case "cta":
			next.text = ensureI18n(block.text);
			break;
		case "closing":
			next.body = ensureI18n(block.body);
			next.signature = ensureI18n(block.signature);
			break;
	}
	return next;
};

// =========================================================================
// GLOSARIO MIDI — extraído de 46 emails históricos ES/EN/PT
// Las decisiones de greeting/signature/closing son canónicas según uso histórico
// y validadas con Mar. La AI usa esto como referencia para mantener consistencia.
// =========================================================================

const MIDI_GLOSSARY = {
	greetings: [
		{ es: "Hola ${nameUser},", en: "Hi ${nameUser},", pt: "Olá ${nameUser}," },
	],
	signatures: [
		{ es: "Equipo Midi", en: "The Midi Team", pt: "Equipe Midi" },
	],
	closings: [
		{
			es: "Si tienes alguna pregunta, puedes escribirnos desde el chat de la app o a info@midi.io.",
			en: "If you need any help, feel free to contact us through our in-app chat or via email at info@midi.io.",
			pt: "Se tiver alguma dúvida, fale com a gente pelo chat do app ou pelo e-mail info@midi.io.",
		},
	],
	ctas: [
		{ es: "Ver mis tarjetas", en: "Review my cards", pt: "Ver meus cartões" },
		{ es: "Enviar dinero", en: "Send money", pt: "Enviar dinheiro" },
		{ es: "Ir a mi cuenta Midi", en: "Go to my Midi account", pt: "Acessar minha conta Midi" },
		{ es: "Contactar soporte", en: "Contact support", pt: "Contatar o suporte" },
		{ es: "Solicitar nueva tarjeta", en: "Request a new card", pt: "Solicitar um novo cartão" },
		{ es: "Actualizar prueba de residencia", en: "Update proof of address", pt: "Atualizar comprovante de residência" },
		{ es: "Autorizar pago", en: "Authorize payment", pt: "Autorizar pagamento" },
		{ es: "Verificar email", en: "Verify email", pt: "Verificar e-mail" },
		{ es: "Verificar documento", en: "Verify ID", pt: "Verificar documento" },
		{ es: "Descargar Midi", en: "Download Midi", pt: "Baixar Midi" },
		{ es: "Iniciar sesión", en: "Log in", pt: "Entrar" },
		{ es: "Verificar identidad", en: "Verify identity", pt: "Verificar identidade" },
		{ es: "Actualizar datos fiscales", en: "Update tax information", pt: "Atualizar informações fiscais" },
		{ es: "Abrir Midi", en: "Open Midi", pt: "Abrir Midi" },
		{ es: "Revisar términos", en: "Review terms", pt: "Revisar termos" },
		{ es: "Ver mi perfil", en: "Go to my profile", pt: "Ver meu perfil" },
		{ es: "Actualizar W-8BEN", en: "Update W-8BEN", pt: "Atualizar W-8BEN" },
		{ es: "Actualizar documento", en: "Update document", pt: "Atualizar documento de identidade" },
	],
	common: [
		{ es: "Fecha:", en: "Date:", pt: "Data:" },
		{ es: "${month} ${day}, ${year}", en: "${month} ${day}, ${year}", pt: "${day} de ${month} de ${year}" },
		{ es: "Inconsistencias en la información fiscal", en: "Inconsistencies in your tax information", pt: "Inconsistências nas informações fiscais" },
		{ es: "Tu tarjeta ${cardNumber} ha caducado", en: "Your ${cardNumber} card has expired", pt: "Seu cartão ${cardNumber} expirou" },
		{ es: "Tu prueba de residencia fue verificada correctamente.", en: "Your proof of address has been successfully verified.", pt: "Seu comprovante de residência foi verificado com sucesso." },
		{ es: "Tu cuenta Midi está activa y puedes continuar operando con normalidad.", en: "Your Midi account is active, and you may continue using it as usual.", pt: "Sua conta Midi está ativa e você pode continuar usando normalmente." },
	],
};

// Genera la sección del prompt con el glosario formateado
const formatGlossaryForPrompt = () => {
	const sections = [
		{ label: "SALUDOS", entries: MIDI_GLOSSARY.greetings },
		{ label: "FIRMAS", entries: MIDI_GLOSSARY.signatures },
		{ label: "CIERRES", entries: MIDI_GLOSSARY.closings },
		{ label: "CTAs (textos de botón)", entries: MIDI_GLOSSARY.ctas },
		{ label: "FRASES COMUNES", entries: MIDI_GLOSSARY.common },
	];
	let out = "";
	sections.forEach(s => {
		if (!s.entries.length) return;
		out += `\n### ${s.label}\n`;
		s.entries.forEach(e => {
			out += `- ES: "${e.es}"\n  EN: "${e.en}"\n  PT: "${e.pt}"\n`;
		});
	});
	return out;
};

// =========================================================================
// HELPERS — render HTML
// =========================================================================

const formatBody = (text) => {
	if (!text) return "";
	let html = text;
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
		return `<a href="${url}" target='_blank' style="color: #0000EE; text-decoration: underline;">${label}</a>`;
	});
	html = html.replace(/(?<!["'>])info@midi\.io(?!<\/a>)/g, '<a href="mailto:support@midi.io" style="color: #0000EE; text-decoration: underline;">info@midi.io</a>');
	html = html.split(/\n/).map(s => s.trim()).filter(Boolean).join("<br><br>\n            ");
	return html;
};

// Como formatBody pero con salto de línea simple (<br>) en lugar de párrafo (<br><br>)
const formatInline = (text) => {
	if (!text) return "";
	let html = text;
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
		return `<a href="${url}" target='_blank' style="color: #0000EE; text-decoration: underline;">${label}</a>`;
	});
	html = html.replace(/(?<!["'>])info@midi\.io(?!<\/a>)/g, '<a href="mailto:support@midi.io" style="color: #0000EE; text-decoration: underline;">info@midi.io</a>');
	html = html.split(/\n/).map(s => s.trim()).filter(Boolean).join("<br>\n                        ");
	return html;
};

const escapeAttr = (s) => (s || "").replace(/'/g, "&#39;").replace(/"/g, "&quot;");

const renderBlockHtml = (block, lang) => {
	switch (block.type) {
		case "title":
			return `    <tr align="center">
        <td align='center' style='font-size: 44px; font-weight: 800; text-align: center; line-height: 130%; letter-spacing: -0.4px; word-break: break-word; background: #ffffff; padding: 28px; padding-top: 24px; padding-bottom:24px; color: #1a1c1f;'>
            ${get(block.text, lang)}
        </td>
    </tr>`;

		case "paragraph": {
			const greetingVal = get(block.greeting, lang);
			const greeting = greetingVal ? `${greetingVal}\n            <br><br>\n            ` : "";
			const body = formatBody(get(block.body, lang));
			return `    <tr align="center">
        <td align='left' style='font-size: 18px; line-height: 150%; background: #ffffff; padding: 28px; padding-top: 0px; padding-bottom:32px; color: #1a1c1f;'>
            ${greeting}${body}
        </td>
    </tr>`;
		}

		case "callout": {
			const inner = (block.items || []).map(it => renderCalloutItem(it, lang)).join("\n                ");
			return `    <tr align="center">
        <td align='center' style='padding: 0 20px;'>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f5; border: 1px solid rgba(151, 151, 151, 0.2); border-radius: 24px;">
                ${inner}
            </table>
        </td>
    </tr>`;
		}

		case "code_callout": {
			const codeText = get(block.code, lang) || "######";
			const subtitleVal = formatInline(get(block.subtitle, lang));
			return `    <tr align="center">
        <td align='center' style='padding: 0 20px;'>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f5; border: 1px solid rgba(151, 151, 151, 0.2); border-radius: 24px;">
                <tr>
                    <td align='center' style='font-size: 32px; font-weight: 800; line-height: 150%; padding: 32px 32px 16px 32px; color: #1a1c1f; text-align: center; letter-spacing: 4px;'>
                        ${codeText}
                    </td>
                </tr>${subtitleVal ? `
                <tr>
                    <td align='center' style='font-size: 18px; line-height: 150%; padding: 0px 32px 32px 32px; color: #1a1c1f; text-align: center;'>
                        ${subtitleVal}
                    </td>
                </tr>` : ""}
            </table>
        </td>
    </tr>`;
		}

		case "cta": {
			const text = get(block.text, lang) || "Continuar";
			const url = block.url || "https://linkto.midi.io/openApp";
			return `    <tr align="center">
        <td align='center' style='font-size: 18px; line-height: 150%; background: #ffffff; padding: 28px; padding-top: 0px; padding-bottom:32px; color: #1a1c1f; vertical-align: middle;'>
            <a href="${escapeAttr(url)}" target='_blank' style='font-size: 18px; color: #ffffff; font-weight: 500; letter-spacing: 0.4px; max-width: 300px; text-decoration: none; border-radius: 80px; background-color: #7646FF; padding: 18px 32px; display: inline-block;'>
                ${text}
            </a>
        </td>
    </tr>`;
		}

		case "closing": {
			const body = formatBody(get(block.body, lang));
			const sigVal = get(block.signature, lang);
			const sig = sigVal ? `<br><br>\n            ${sigVal}` : "";
			return `    <tr align="center">
        <td align='left' style='font-size: 18px; line-height: 150%; background: #ffffff; padding: 0 28px 48px 28px; color: #1a1c1f;'>
            ${body}${sig}
        </td>
    </tr>`;
		}

		case "spacer":
			return `    <tr><td height="32"></td></tr>`;

		default:
			return "";
	}
};

const renderCalloutItem = (item, lang) => {
	switch (item.kind) {
		case "heading":
			return `<tr>
                    <td align='left' style='font-size: 18px; line-height: 150%; padding: 32px 32px 0 32px; color: #1a1c1f; text-align: left;'>
                        <strong>${get(item.text, lang)}</strong>
                    </td>
                </tr>`;
		case "text":
			return `<tr>
                    <td align='left' style='font-size: 18px; line-height: 150%; padding: 16px 32px; color: #1a1c1f; text-align: left;'>
                        ${formatBody(get(item.text, lang))}
                    </td>
                </tr>`;
		case "bullets": {
			const lis = (item.items || []).map((li, i, arr) =>
				`<li${i < arr.length - 1 ? ` style="margin-bottom: 8px;"` : ""}>${get(li, lang)}</li>`
			).join("\n                            ");
			return `<tr>
                    <td align='left' style='font-size: 18px; line-height: 150%; padding: 16px 32px 32px 32px; color: #1a1c1f; text-align: left;'>
                        <ul style="padding-left: 20px; margin: 0;">
                            ${lis}
                        </ul>
                    </td>
                </tr>`;
		}
		case "numbered": {
			const lis = (item.items || []).map((li, i, arr) =>
				`<li${i < arr.length - 1 ? ` style="margin-bottom: 8px;"` : ""}>${get(li, lang)}</li>`
			).join("\n                            ");
			return `<tr>
                    <td align='left' style='font-size: 18px; line-height: 150%; padding: 16px 32px 32px 32px; color: #1a1c1f; text-align: left;'>
                        <ol style="padding-left: 20px; margin: 0;">
                            ${lis}
                        </ol>
                    </td>
                </tr>`;
		}
		case "code": {
			const codeText = get(item.text, lang) || "######";
			const subtitleVal = formatInline(get(item.subtitle, lang));
			return `<tr>
                    <td align='center' style='font-size: 32px; font-weight: 800; line-height: 150%; padding: 32px 32px 16px 32px; color: #1a1c1f; text-align: center; letter-spacing: 4px;'>
                        ${codeText}
                    </td>
                </tr>${subtitleVal ? `
                <tr>
                    <td align='center' style='font-size: 18px; line-height: 150%; padding: 0px 32px 32px 32px; color: #1a1c1f; text-align: center;'>
                        ${subtitleVal}
                    </td>
                </tr>` : ""}`;
		}
		default:
			return "";
	}
};

// Padding top/bottom efectivo de cada tipo de bloque (lo que aporta al espaciado externo).
// Los callouts NO tienen padding externo (el padding va dentro de la tabla del callout).
const BLOCK_PADDING = {
	title: { top: 24, bottom: 24 },
	paragraph: { top: 0, bottom: 32 },
	callout: { top: 0, bottom: 0 },
	code_callout: { top: 0, bottom: 0 },
	cta: { top: 0, bottom: 32 },
	closing: { top: 0, bottom: 48 },
	spacer: { top: 0, bottom: 32 },
};

// Espaciado mínimo deseado entre dos bloques contiguos.
const MIN_BLOCK_SPACING = 32;

const generateEmailHtml = (blocks, lang) => {
	const parts = [];
	blocks.forEach((b, i) => {
		parts.push(renderBlockHtml(b, lang));
		if (i < blocks.length - 1) {
			const next = blocks[i + 1];
			const currentBottom = BLOCK_PADDING[b.type]?.bottom || 0;
			const nextTop = BLOCK_PADDING[next.type]?.top || 0;
			const total = currentBottom + nextTop;
			if (total < MIN_BLOCK_SPACING) {
				const needed = MIN_BLOCK_SPACING - total;
				parts.push(`    <tr><td height="${needed}"></td></tr>`);
			}
		}
	});
	const blocksHtml = parts.join("\n");
	const footer = FOOTER_HTML_BY_LANG[lang] || FOOTER_HTML_BY_LANG.es;
	return `<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN' 'http://www.w3.org/TR/REC-html40/loose.dtd'>
<html>
<head>
    <meta content='text/html;' http-equiv='content-type' charset='utf-8'>
</head>
<body style='background: #ffffff;font-family: Basier Circle,Helvetica Neue,Arial,sans-serif; letter-spacing: 0px;color: #1a1c1f;margin:0px;'>
<table align='center' style="max-width: 594px; width: 100%; border-collapse: collapse;">
    ${HEADER_HTML}
${blocksHtml}
    ${footer}
</table>
</body>
</html>`;
};

// =========================================================================
// HELPERS — recolección y aplicación de traducciones
// =========================================================================

const collectStrings = (blocks, lang) => {
	const result = {};
	blocks.forEach((block) => {
		const bid = block.id;
		switch (block.type) {
			case "title":
				result[`${bid}.text`] = get(block.text, lang);
				break;
			case "paragraph":
				result[`${bid}.greeting`] = get(block.greeting, lang);
				result[`${bid}.body`] = get(block.body, lang);
				break;
			case "callout":
				(block.items || []).forEach((item) => {
					const iid = item.id;
					if (item.kind === "heading" || item.kind === "text") {
						result[`${bid}.${iid}.text`] = get(item.text, lang);
					} else if (item.kind === "bullets" || item.kind === "numbered") {
						(item.items || []).forEach((li, idx) => {
							result[`${bid}.${iid}.${idx}`] = get(li, lang);
						});
					} else if (item.kind === "code") {
						result[`${bid}.${iid}.text`] = get(item.text, lang);
						result[`${bid}.${iid}.subtitle`] = get(item.subtitle, lang);
					}
				});
				break;
			case "code_callout":
				result[`${bid}.code`] = get(block.code, lang);
				result[`${bid}.subtitle`] = get(block.subtitle, lang);
				break;
			case "cta":
				result[`${bid}.text`] = get(block.text, lang);
				break;
			case "closing":
				result[`${bid}.body`] = get(block.body, lang);
				result[`${bid}.signature`] = get(block.signature, lang);
				break;
		}
	});
	return result;
};

const applyTranslations = (blocks, translationsByLang) => {
	return blocks.map((block) => {
		const bid = block.id;
		const next = { ...block };
		const apply = (field, key) => {
			const updated = { ...field };
			LANG_CODES.forEach(lang => {
				const val = translationsByLang[lang]?.[key];
				if (val !== undefined && val !== null && (!updated[lang] || !updated[lang].trim())) {
					updated[lang] = val;
				}
			});
			return updated;
		};
		switch (block.type) {
			case "title":
				next.text = apply(block.text, `${bid}.text`);
				break;
			case "paragraph":
				next.greeting = apply(block.greeting, `${bid}.greeting`);
				next.body = apply(block.body, `${bid}.body`);
				break;
			case "callout":
				next.items = (block.items || []).map(item => {
					const iid = item.id;
					if (item.kind === "heading" || item.kind === "text") {
						return { ...item, text: apply(item.text, `${bid}.${iid}.text`) };
					} else if (item.kind === "bullets" || item.kind === "numbered") {
						return {
							...item,
							items: (item.items || []).map((li, idx) => apply(li, `${bid}.${iid}.${idx}`))
						};
					} else if (item.kind === "code") {
						return {
							...item,
							text: apply(item.text, `${bid}.${iid}.text`),
							subtitle: apply(item.subtitle, `${bid}.${iid}.subtitle`),
						};
					}
					return item;
				});
				break;
			case "code_callout":
				next.code = apply(block.code, `${bid}.code`);
				next.subtitle = apply(block.subtitle, `${bid}.subtitle`);
				break;
			case "cta":
				next.text = apply(block.text, `${bid}.text`);
				break;
			case "closing":
				next.body = apply(block.body, `${bid}.body`);
				next.signature = apply(block.signature, `${bid}.signature`);
				break;
		}
		return next;
	});
};

// =========================================================================
// DEFAULTS
// =========================================================================

const defaultBlock = (type) => {
	const id = newId();
	switch (type) {
		case "title":
			return { id, type, text: i18n("Título de tu mailing") };
		case "paragraph":
			return {
				id, type,
				greeting: i18n("Hola ${nameUser},"),
				body: i18n("Escribí el cuerpo del mensaje.\nCada salto de línea = párrafo nuevo.\nUsá variables como ${nameUser} o <%Amount%> y enlaces tipo [texto](https://...)."),
			};
		case "callout":
			return {
				id, type,
				items: [
					{ id: newId("i"), kind: "heading", text: i18n("Encabezado del callout:") },
					{ id: newId("i"), kind: "bullets", items: [i18n("Primer punto"), i18n("Segundo punto")] },
				],
			};
		case "code_callout":
			return {
				id, type,
				code: i18n("######"),
				subtitle: i18n("Este código es personal y no debe compartirse."),
			};
		case "cta":
			return { id, type, text: i18n("Continuar en la app"), url: "https://linkto.midi.io/openApp" };
		case "closing":
			return {
				id, type,
				body: i18n("Si tienes alguna pregunta, puedes escribirnos desde el chat de la app o a info@midi.io."),
				signature: i18n("Equipo Midi"),
			};
		case "spacer":
			return { id, type };
		default:
			return null;
	}
};

const defaultCalloutItem = (kind) => {
	const id = newId("i");
	switch (kind) {
		case "heading": return { id, kind, text: i18n("Encabezado:") };
		case "text": return { id, kind, text: i18n("Texto del callout.") };
		case "bullets": return { id, kind, items: [i18n("Primer punto"), i18n("Segundo punto")] };
		case "numbered": return { id, kind, items: [i18n("Paso 1"), i18n("Paso 2")] };
		default: return null;
	}
};

const STARTER_BLOCKS = () => [
	defaultBlock("title"),
	defaultBlock("paragraph"),
	defaultBlock("cta"),
	defaultBlock("closing"),
];

const BLOCK_META = {
	title: { label: "Título", icon: Type, color: "#7646FF" },
	paragraph: { label: "Párrafo", icon: AlignLeft, color: "#1a1c1f" },
	callout: { label: "Callout", icon: MessageSquare, color: "#1a1c1f" },
	code_callout: { label: "Callout con código", icon: Hash, color: "#7646FF" },
	cta: { label: "Botón CTA", icon: MousePointerClick, color: "#7646FF" },
	closing: { label: "Cierre", icon: FileSignature, color: "#1a1c1f" },
	spacer: { label: "Espaciador", icon: Minus, color: "#8b959e" },
};

const CALLOUT_ITEM_META = {
	heading: { label: "Encabezado", icon: Heading },
	text: { label: "Texto", icon: AlignLeft },
	bullets: { label: "Lista con bullets", icon: List },
	numbered: { label: "Lista numerada", icon: ListOrdered },
};

const blockFieldCompleteness = (block) => {
	const result = { es: false, en: false, pt: false };
	if (block.type === "spacer") return { es: true, en: true, pt: true };
	const checkField = (f) => {
		if (!f) return;
		LANG_CODES.forEach(l => { if ((f[l] || "").trim()) result[l] = true; });
	};
	switch (block.type) {
		case "title": checkField(block.text); break;
		case "paragraph":
			checkField(block.greeting);
			checkField(block.body);
			break;
		case "callout":
			(block.items || []).forEach(item => {
				if (item.kind === "heading" || item.kind === "text") checkField(item.text);
				else if (item.kind === "bullets" || item.kind === "numbered") {
					(item.items || []).forEach(checkField);
				} else if (item.kind === "code") {
					checkField(item.text);
					checkField(item.subtitle);
				}
			});
			break;
		case "code_callout":
			checkField(block.code);
			checkField(block.subtitle);
			break;
		case "cta": checkField(block.text); break;
		case "closing":
			checkField(block.body);
			checkField(block.signature);
			break;
	}
	return result;
};

// =========================================================================
// COMPONENTES — inputs i18n-aware
// =========================================================================

function I18nField({ label, field, lang, onChange, placeholder, multiline, hint, rows = 3 }) {
	const Tag = multiline ? "textarea" : "input";
	const val = get(field, lang);
	const completeness = LANG_CODES.map(l => ({
		code: l,
		complete: !!(field?.[l] || "").trim(),
	}));

	return (
		<div style={{ marginBottom: 12 }}>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
				{label ? (
					<div style={{ fontSize: 12, fontWeight: 600, color: "#5a6268", textTransform: "uppercase", letterSpacing: 0.4 }}>
						{label}
					</div>
				) : <span />}
				<div style={{ display: "flex", gap: 4 }}>
					{completeness.map(c => (
						<span key={c.code} style={{
							fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 3,
							background: c.complete ? "#E8F5EE" : "#F5F5F7",
							color: c.complete ? "#1A8748" : "#C7C9CD",
							textTransform: "uppercase", letterSpacing: 0.4,
						}}>
							{c.code}
						</span>
					))}
				</div>
			</div>
			<Tag
				value={val}
				onChange={(e) => onChange({ ...field, [lang]: e.target.value })}
				placeholder={placeholder}
				rows={multiline ? rows : undefined}
				style={{
					width: "100%",
					padding: "10px 12px",
					border: "1px solid #E5E7EB",
					borderRadius: 8,
					fontSize: 14,
					fontFamily: "inherit",
					color: "#1a1c1f",
					backgroundColor: "#fff",
					outline: "none",
					transition: "border-color 0.15s, box-shadow 0.15s",
					resize: multiline ? "vertical" : "none",
					boxSizing: "border-box",
					lineHeight: 1.5,
				}}
				onFocus={(e) => {
					e.target.style.borderColor = "#7646FF";
					e.target.style.boxShadow = "0 0 0 3px rgba(118, 70, 255, 0.12)";
				}}
				onBlur={(e) => {
					e.target.style.borderColor = "#E5E7EB";
					e.target.style.boxShadow = "none";
				}}
			/>
			{hint && (
				<div style={{ fontSize: 12, color: "#8b959e", marginTop: 6 }}>{hint}</div>
			)}
		</div>
	);
}

function I18nListEditor({ label, items, lang, onChange }) {
	const update = (i, v) => {
		const next = [...items];
		next[i] = { ...next[i], [lang]: v };
		onChange(next);
	};
	const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
	const add = () => onChange([...items, i18n("Nuevo punto")]);

	return (
		<div style={{ marginBottom: 12 }}>
			<div style={{ fontSize: 12, fontWeight: 600, color: "#5a6268", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
				{label}
			</div>
			{items.map((item, i) => (
				<div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
					<input
						value={get(item, lang)}
						onChange={(e) => update(i, e.target.value)}
						style={{
							flex: 1,
							padding: "8px 10px",
							border: "1px solid #E5E7EB",
							borderRadius: 6,
							fontSize: 14,
							fontFamily: "inherit",
							color: "#1a1c1f",
							outline: "none",
							boxSizing: "border-box",
						}}
						onFocus={(e) => { e.target.style.borderColor = "#7646FF"; }}
						onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; }}
					/>
					<button
						onClick={() => remove(i)}
						disabled={items.length <= 1}
						style={{
							padding: 8, border: "1px solid #E5E7EB", borderRadius: 6,
							background: "#fff", cursor: items.length > 1 ? "pointer" : "not-allowed",
							color: items.length > 1 ? "#8b959e" : "#d0d4d8",
							display: "flex", alignItems: "center",
						}}
						title="Eliminar"
					>
						<X size={14} />
					</button>
				</div>
			))}
			<button
				onClick={add}
				style={{
					padding: "6px 10px", border: "1px dashed #d0d4d8", borderRadius: 6,
					background: "transparent", cursor: "pointer", fontSize: 13, color: "#5a6268",
					display: "inline-flex", alignItems: "center", gap: 4,
				}}
			>
				<Plus size={12} /> Agregar item
			</button>
		</div>
	);
}

function CalloutItemEditor({ item, lang, onChange, onRemove, canRemove }) {
	const Meta = CALLOUT_ITEM_META[item.kind];
	const Icon = Meta.icon;
	return (
		<div style={{
			border: "1px solid #E5E7EB", borderRadius: 10, padding: 12,
			marginBottom: 8, background: "#FAFAFA",
		}}>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
				<div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#5a6268", textTransform: "uppercase", letterSpacing: 0.4 }}>
					<Icon size={12} /> {Meta.label}
				</div>
				{canRemove && (
					<button
						onClick={onRemove}
						style={{
							padding: 4, border: "none", borderRadius: 4,
							background: "transparent", cursor: "pointer", color: "#8b959e",
							display: "flex", alignItems: "center",
						}}
						title="Eliminar"
					>
						<X size={14} />
					</button>
				)}
			</div>
			{(item.kind === "heading" || item.kind === "text") && (
				<I18nField
					field={item.text}
					lang={lang}
					onChange={(v) => onChange({ ...item, text: v })}
					multiline={item.kind === "text"}
					rows={2}
				/>
			)}
			{(item.kind === "bullets" || item.kind === "numbered") && (
				<I18nListEditor
					label="Items"
					items={item.items}
					lang={lang}
					onChange={(items) => onChange({ ...item, items })}
				/>
			)}
			{item.kind === "code" && (
				<>
					<I18nField
						label="Código"
						field={item.text}
						lang={lang}
						onChange={(v) => onChange({ ...item, text: v })}
						placeholder="######"
					/>
					<I18nField
						label="Subtítulo (opcional)"
						field={item.subtitle}
						lang={lang}
						onChange={(v) => onChange({ ...item, subtitle: v })}
					/>
				</>
			)}
		</div>
	);
}

function CalloutEditor({ block, lang, onChange }) {
	const update = (id, patch) => onChange({
		...block,
		items: block.items.map(it => it.id === id ? patch : it),
	});
	const remove = (id) => onChange({ ...block, items: block.items.filter(it => it.id !== id) });
	const add = (kind) => onChange({ ...block, items: [...block.items, defaultCalloutItem(kind)] });

	return (
		<div>
			{block.items.map((item) => (
				<CalloutItemEditor
					key={item.id}
					item={item}
					lang={lang}
					onChange={(p) => update(item.id, p)}
					onRemove={() => remove(item.id)}
					canRemove={block.items.length > 1}
				/>
			))}
			<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
				{Object.entries(CALLOUT_ITEM_META).map(([k, m]) => {
					const Icon = m.icon;
					return (
						<button
							key={k}
							onClick={() => add(k)}
							style={{
								padding: "6px 10px", border: "1px dashed #d0d4d8", borderRadius: 6,
								background: "transparent", cursor: "pointer", fontSize: 12, color: "#5a6268",
								display: "inline-flex", alignItems: "center", gap: 4,
							}}
						>
							<Icon size={12} /> {m.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}

function BlockCard({ block, index, total, lang, onChange, onRemove, onMove, isSelected, onSelect }) {
	const Meta = BLOCK_META[block.type];
	const Icon = Meta.icon;
	const completeness = blockFieldCompleteness(block);

	return (
		<div
			onClick={onSelect}
			style={{
				border: `1px solid ${isSelected ? "#7646FF" : "#E5E7EB"}`,
				borderRadius: 12,
				background: "#fff",
				marginBottom: 12,
				boxShadow: isSelected ? "0 0 0 3px rgba(118, 70, 255, 0.10)" : "0 1px 2px rgba(0,0,0,0.02)",
				transition: "all 0.15s",
				overflow: "hidden",
			}}
		>
			<div style={{
				display: "flex", alignItems: "center", justifyContent: "space-between",
				padding: "10px 14px", background: isSelected ? "#FAF8FF" : "#FAFAFA",
				borderBottom: "1px solid #F0F0F2",
			}}>
				<div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
					<Icon size={14} style={{ color: Meta.color, flexShrink: 0 }} />
					<span style={{ fontSize: 13, fontWeight: 600, color: "#1a1c1f" }}>{Meta.label}</span>
					<span style={{ fontSize: 11, color: "#8b959e" }}>#{index + 1}</span>
					{block.type !== "spacer" && (
						<div style={{ display: "flex", gap: 3, marginLeft: 4 }}>
							{LANG_CODES.map(l => (
								<span key={l} style={{
									fontSize: 9, fontWeight: 700, padding: "2px 4px", borderRadius: 3,
									background: completeness[l] ? "#E8F5EE" : "#F5F5F7",
									color: completeness[l] ? "#1A8748" : "#C7C9CD",
									textTransform: "uppercase", letterSpacing: 0.4,
								}}>
									{l}
								</span>
							))}
						</div>
					)}
				</div>
				<div style={{ display: "flex", alignItems: "center", gap: 2 }}>
					<button
						onClick={(e) => { e.stopPropagation(); onMove(-1); }}
						disabled={index === 0}
						style={{
							padding: 6, border: "none", borderRadius: 4,
							background: "transparent", cursor: index === 0 ? "not-allowed" : "pointer",
							color: index === 0 ? "#d0d4d8" : "#5a6268",
							display: "flex", alignItems: "center",
						}}
						title="Mover arriba"
					>
						<ChevronUp size={14} />
					</button>
					<button
						onClick={(e) => { e.stopPropagation(); onMove(1); }}
						disabled={index === total - 1}
						style={{
							padding: 6, border: "none", borderRadius: 4,
							background: "transparent", cursor: index === total - 1 ? "not-allowed" : "pointer",
							color: index === total - 1 ? "#d0d4d8" : "#5a6268",
							display: "flex", alignItems: "center",
						}}
						title="Mover abajo"
					>
						<ChevronDown size={14} />
					</button>
					<button
						onClick={(e) => { e.stopPropagation(); onRemove(); }}
						style={{
							padding: 6, border: "none", borderRadius: 4,
							background: "transparent", cursor: "pointer", color: "#8b959e",
							display: "flex", alignItems: "center",
						}}
						title="Eliminar bloque"
					>
						<Trash2 size={14} />
					</button>
				</div>
			</div>

			{block.type !== "spacer" && (
				<div style={{ padding: 14 }}>
					{block.type === "title" && (
						<I18nField
							field={block.text}
							lang={lang}
							onChange={(v) => onChange({ ...block, text: v })}
							placeholder="Título principal"
							multiline
							rows={2}
						/>
					)}
					{block.type === "paragraph" && (
						<>
							<I18nField
								label="Saludo (opcional)"
								field={block.greeting}
								lang={lang}
								onChange={(v) => onChange({ ...block, greeting: v })}
								placeholder="Hola ${nameUser},"
								hint="Variables como ${...} y <%...%> se preservan literales (no se traducen)."
							/>
							<I18nField
								label="Cuerpo"
								field={block.body}
								lang={lang}
								onChange={(v) => onChange({ ...block, body: v })}
								multiline
								rows={5}
								hint='Cada Enter = párrafo nuevo. Soporta [texto](url). "info@midi.io" → enlace mailto automático.'
							/>
						</>
					)}
					{block.type === "callout" && (
						<CalloutEditor block={block} lang={lang} onChange={onChange} />
					)}
					{block.type === "code_callout" && (
						<>
							<I18nField
								label="Código"
								field={block.code}
								lang={lang}
								onChange={(v) => onChange({ ...block, code: v })}
								placeholder="######"
								hint="Se renderiza grande, en negrita y centrado (32px, weight 800, letter-spacing 4px)."
							/>
							<I18nField
								label="Subtítulo"
								field={block.subtitle}
								lang={lang}
								onChange={(v) => onChange({ ...block, subtitle: v })}
								multiline
								rows={3}
								hint="Cada Enter = nueva línea (sin espacio extra)."
							/>
						</>
					)}
					{block.type === "cta" && (
						<>
							<I18nField
								label="Texto del botón"
								field={block.text}
								lang={lang}
								onChange={(v) => onChange({ ...block, text: v })}
							/>
							<div style={{ marginBottom: 12 }}>
								<div style={{ fontSize: 12, fontWeight: 600, color: "#5a6268", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
									URL <span style={{ fontSize: 10, color: "#8b959e", textTransform: "none", letterSpacing: 0 }}>(compartida entre los 3 idiomas)</span>
								</div>
								<input
									value={block.url || ""}
									onChange={(e) => onChange({ ...block, url: e.target.value })}
									placeholder="https://linkto.midi.io/openApp"
									style={{
										width: "100%", padding: "10px 12px",
										border: "1px solid #E5E7EB", borderRadius: 8,
										fontSize: 14, fontFamily: "inherit", color: "#1a1c1f",
										backgroundColor: "#fff", outline: "none", boxSizing: "border-box",
									}}
									onFocus={(e) => { e.target.style.borderColor = "#7646FF"; }}
									onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; }}
								/>
							</div>
						</>
					)}
					{block.type === "closing" && (
						<>
							<I18nField
								label="Texto de cierre"
								field={block.body}
								lang={lang}
								onChange={(v) => onChange({ ...block, body: v })}
								multiline
								rows={3}
							/>
							<I18nField
								label="Firma"
								field={block.signature}
								lang={lang}
								onChange={(v) => onChange({ ...block, signature: v })}
								placeholder="Equipo Midi"
							/>
						</>
					)}
				</div>
			)}
			{block.type === "spacer" && (
				<div style={{ padding: "10px 14px", fontSize: 12, color: "#8b959e", textAlign: "center" }}>
					Espacio vertical de 32px
				</div>
			)}
		</div>
	);
}

// =========================================================================
// PREVIEW
// =========================================================================

function EmailPreview({ html }) {
	const iframeRef = useRef(null);
	const [height, setHeight] = useState(800);

	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) return;
		const doc = iframe.contentDocument;
		if (!doc) return;
		doc.open();
		doc.write(html);
		doc.close();
		const resize = () => {
			try {
				const body = doc.body;
				const docEl = doc.documentElement;
				if (body && docEl) {
					const h = Math.max(body.scrollHeight, docEl.scrollHeight) + 24;
					setHeight(h);
				}
			} catch { /* ignore */ }
		};
		const imgs = doc.images;
		if (imgs && imgs.length > 0) {
			let pending = imgs.length;
			const done = () => { pending--; if (pending <= 0) resize(); };
			Array.from(imgs).forEach(img => {
				if (img.complete) done();
				else { img.addEventListener("load", done); img.addEventListener("error", done); }
			});
			setTimeout(resize, 800);
		} else {
			setTimeout(resize, 50);
		}
	}, [html]);

	return (
		<iframe
			ref={iframeRef}
			title="Email preview"
			style={{
				width: "100%",
				height,
				border: "none",
				borderRadius: 12,
				background: "#fff",
				boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
				display: "block",
			}}
		/>
	);
}

// =========================================================================
// COMPONENTE PRINCIPAL
// =========================================================================

export default function EmailBuilder() {
	const [blocks, setBlocks] = useState(STARTER_BLOCKS());
	const [activeLang, setActiveLang] = useState("es");
	const [mailName, setMailName] = useState("nuevo_mailing");
	const [selectedId, setSelectedId] = useState(null);
	const [showAddMenu, setShowAddMenu] = useState(false);
	const [view, setView] = useState("preview");
	const [hydrated, setHydrated] = useState(false);
	const [translating, setTranslating] = useState(false);
	const [translateError, setTranslateError] = useState(null);
	const [toast, setToast] = useState(null);
	const addMenuRef = useRef(null);

	useEffect(() => {
		if (!showAddMenu) return;
		const handler = (e) => {
			if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
				setShowAddMenu(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [showAddMenu]);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const result = await window.storage?.get("midi_email_draft_v2");
				if (!cancelled && result?.value) {
					const parsed = JSON.parse(result.value);
					if (parsed.blocks && Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
						setBlocks(parsed.blocks.map(migrateBlock));
						if (parsed.mailName) setMailName(parsed.mailName);
						if (parsed.activeLang) setActiveLang(parsed.activeLang);
						if (!cancelled) setHydrated(true);
						return;
					}
				}
				const v1 = await window.storage?.get("midi_email_draft");
				if (!cancelled && v1?.value) {
					const parsed = JSON.parse(v1.value);
					if (Array.isArray(parsed) && parsed.length > 0) {
						setBlocks(parsed.map(migrateBlock));
					}
				}
			} catch { /* ignore */ }
			finally {
				if (!cancelled) setHydrated(true);
			}
		})();
		return () => { cancelled = true; };
	}, []);

	useEffect(() => {
		if (!hydrated) return;
		const timer = setTimeout(async () => {
			try {
				await window.storage?.set("midi_email_draft_v2", JSON.stringify({
					blocks, mailName, activeLang
				}));
			} catch { /* ignore */ }
		}, 500);
		return () => clearTimeout(timer);
	}, [blocks, mailName, activeLang, hydrated]);

	const html = useMemo(() => generateEmailHtml(blocks, activeLang), [blocks, activeLang]);

	const updateBlock = (id, patch) => setBlocks(blocks.map(b => b.id === id ? patch : b));
	const removeBlock = (id) => setBlocks(blocks.filter(b => b.id !== id));
	const moveBlock = (id, direction) => {
		const idx = blocks.findIndex(b => b.id === id);
		const newIdx = idx + direction;
		if (newIdx < 0 || newIdx >= blocks.length) return;
		const next = [...blocks];
		[next[idx], next[newIdx]] = [next[newIdx], next[idx]];
		setBlocks(next);
	};
	const addBlock = (type) => {
		setBlocks([...blocks, defaultBlock(type)]);
		setShowAddMenu(false);
	};

	const reset = () => {
		if (confirm("¿Descartar el email actual y empezar de cero?")) {
			setBlocks(STARTER_BLOCKS());
			setMailName("nuevo_mailing");
			setSelectedId(null);
		}
	};

	const showToast = (msg, type = "success") => {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 3000);
	};

	const downloadFile = (filename, content) => {
		const blob = new Blob([content], { type: "text/html;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const sanitizeName = (n) => (n || "mailing").replace(/[^a-zA-Z0-9_-]/g, "_");

	const downloadCurrent = () => {
		const name = sanitizeName(mailName);
		const filename = `${name}_${activeLang.toUpperCase()}.html`;
		downloadFile(filename, html);
		showToast(`Descargado ${filename}`);
	};

	const downloadAll = () => {
		const name = sanitizeName(mailName);
		LANG_CODES.forEach((lang, i) => {
			setTimeout(() => {
				const content = generateEmailHtml(blocks, lang);
				downloadFile(`${name}_${lang.toUpperCase()}.html`, content);
			}, i * 250);
		});
		showToast("Descargando los 3 idiomas...");
	};

	const copyHtml = async () => {
		try {
			await navigator.clipboard.writeText(html);
			showToast(`HTML del idioma ${activeLang.toUpperCase()} copiado`);
		} catch {
			showToast("No se pudo copiar al clipboard", "error");
		}
	};

	const translate = async () => {
		setTranslating(true);
		setTranslateError(null);
		try {
			const sourceStrings = collectStrings(blocks, "es");
			const enStrings = collectStrings(blocks, "en");
			const ptStrings = collectStrings(blocks, "pt");

			const toTranslate = {};
			Object.entries(sourceStrings).forEach(([key, val]) => {
				if (!val || !val.trim()) return;
				const enEmpty = !(enStrings[key] || "").trim();
				const ptEmpty = !(ptStrings[key] || "").trim();
				if (enEmpty || ptEmpty) {
					toTranslate[key] = val;
				}
			});

			if (Object.keys(toTranslate).length === 0) {
				setTranslating(false);
				showToast("No hay nada para traducir (EN y PT ya están completos)");
				return;
			}

			const prompt = `Eres un traductor profesional para Midi, una fintech de Latinoamérica. Vas a recibir strings en español y debes traducirlos al inglés (en) y portugués brasileño (pt).

REGLAS CRÍTICAS:
1. NUNCA traduzcas variables del tipo \${nombreVar} ni <%Var%>. Déjalas EXACTAMENTE como están.
2. NUNCA traduzcas estos términos: PIX, Bre-B, SWIFT, FIAT, OFAC, USDC, W8BEN, Midi, CLABE, CBU, DICT, KYC, USD, USDT, IBAN.
3. Tono: claro, profesional, neutral, NO alarmista. Evita lenguaje que sugiera urgencia innecesaria o pérdida.
4. En español está en tuteo (tú). En inglés usa "you" en tono CASUAL (preferí "Hi" sobre "Hello"). En portugués brasileño usa "você" (NO portugués europeo).
5. Si un texto tiene markdown link [texto](url), traduce solo "texto", deja la url igual.
6. Mantén el largo aproximado: los emails tienen restricciones de espacio.
7. Mantén URLs y emails sin cambios (info@midi.io, support@midi.io, midi.io).
8. Si el valor es un placeholder tipo "######" o un código, déjalo idéntico.

GLOSARIO MIDI — TRADUCCIONES CANÓNICAS (EXTRAÍDAS DE 46 EMAILS HISTÓRICOS):
Si una frase del input coincide EXACTAMENTE con una entrada del glosario, USA esa traducción literal.
Si una frase del input CONTIENE términos del glosario (ej: "Equipo Midi", "tarjeta", "comprobante de residencia"), MANTÉN consistencia con cómo se traducen en el glosario.
${formatGlossaryForPrompt()}

INPUT (JSON con strings en español):
${JSON.stringify(toTranslate, null, 2)}

OUTPUT: Devuelve EXCLUSIVAMENTE un objeto JSON válido (sin markdown, sin backticks, sin texto adicional antes o después) con esta estructura exacta:

{
  "en": { ...mismas claves del input, valores traducidos al inglés... },
  "pt": { ...mismas claves del input, valores traducidos al portugués brasileño... }
}`;

			const response = await fetch("https://api.anthropic.com/v1/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: "claude-sonnet-4-20250514",
					max_tokens: 4000,
					messages: [{ role: "user", content: prompt }]
				})
			});

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}

			const data = await response.json();
			const text = (data.content || [])
				.filter(c => c.type === "text")
				.map(c => c.text)
				.join("\n");

			const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
			const translations = JSON.parse(cleaned);

			if (!translations.en || !translations.pt) {
				throw new Error("La respuesta no tiene las claves esperadas (en, pt).");
			}

			const updated = applyTranslations(blocks, translations);
			setBlocks(updated);

			const count = Object.keys(toTranslate).length;
			showToast(`Traducidos ${count} ${count === 1 ? "campo" : "campos"} a EN y PT. Revisá las versiones.`);
		} catch (err) {
			console.error("Translation error:", err);
			setTranslateError(err.message || "Error al traducir");
		} finally {
			setTranslating(false);
		}
	};

	return (
		<div style={{
			minHeight: "100vh",
			background: "#F5F5F7",
			fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
			color: "#1a1c1f",
		}}>
			<div style={{
				position: "sticky", top: 0, zIndex: 10,
				background: "rgba(255,255,255,0.92)",
				backdropFilter: "saturate(180%) blur(20px)",
				WebkitBackdropFilter: "saturate(180%) blur(20px)",
				borderBottom: "1px solid #E5E5E8",
				padding: "12px 24px",
				display: "flex", alignItems: "center", justifyContent: "space-between",
				gap: 16, flexWrap: "wrap",
			}}>
				<div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 280 }}>
					<div style={{
						width: 28, height: 28, borderRadius: 8,
						background: "#7646FF",
						display: "flex", alignItems: "center", justifyContent: "center",
						color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0,
					}}>M</div>
					<div style={{ flex: 1, minWidth: 0 }}>
						<div style={{ fontSize: 15, fontWeight: 600 }}>Desconstructor de mailings</div>
						<div style={{ fontSize: 12, color: "#8b959e" }}>{blocks.length} {blocks.length === 1 ? "bloque" : "bloques"} · auto-guardado</div>
					</div>
					<input
						value={mailName}
						onChange={(e) => setMailName(e.target.value)}
						placeholder="nombre_del_mailing"
						style={{
							padding: "8px 12px", border: "1px solid #E5E5E8", borderRadius: 8,
							fontSize: 13, fontFamily: "'SF Mono', Monaco, monospace", color: "#1a1c1f",
							background: "#fff", outline: "none", minWidth: 200,
							maxWidth: 280, flex: 1,
						}}
						onFocus={(e) => { e.target.style.borderColor = "#7646FF"; }}
						onBlur={(e) => { e.target.style.borderColor = "#E5E5E8"; }}
					/>
				</div>
				<div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
					<div style={{ display: "flex", background: "#F0F0F2", borderRadius: 8, padding: 2 }}>
						{LANGS.map(l => (
							<button
								key={l.code}
								onClick={() => setActiveLang(l.code)}
								style={{
									padding: "6px 12px", border: "none", borderRadius: 6,
									background: activeLang === l.code ? "#fff" : "transparent",
									cursor: "pointer", fontSize: 13, fontWeight: 600,
									color: activeLang === l.code ? "#1a1c1f" : "#8b959e",
									boxShadow: activeLang === l.code ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
									transition: "all 0.15s",
									letterSpacing: 0.4,
								}}
								title={l.name}
							>
								{l.label}
							</button>
						))}
					</div>

					<div style={{ display: "flex", background: "#F0F0F2", borderRadius: 8, padding: 2 }}>
						<button
							onClick={() => setView("preview")}
							style={{
								padding: "6px 12px", border: "none", borderRadius: 6,
								background: view === "preview" ? "#fff" : "transparent",
								cursor: "pointer", fontSize: 13, fontWeight: 500,
								color: view === "preview" ? "#1a1c1f" : "#8b959e",
								display: "flex", alignItems: "center", gap: 4,
								boxShadow: view === "preview" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
							}}
						>
							<Eye size={13} /> Preview
						</button>
						<button
							onClick={() => setView("code")}
							style={{
								padding: "6px 12px", border: "none", borderRadius: 6,
								background: view === "code" ? "#fff" : "transparent",
								cursor: "pointer", fontSize: 13, fontWeight: 500,
								color: view === "code" ? "#1a1c1f" : "#8b959e",
								display: "flex", alignItems: "center", gap: 4,
								boxShadow: view === "code" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
							}}
						>
							<Code2 size={13} /> HTML
						</button>
					</div>

					<button
						onClick={translate}
						disabled={translating}
						style={{
							padding: "8px 12px", border: "1px solid #E5E5E8", borderRadius: 8,
							background: "#fff", cursor: translating ? "wait" : "pointer",
							fontSize: 13, fontWeight: 500, color: "#5a6268",
							display: "flex", alignItems: "center", gap: 6,
							opacity: translating ? 0.6 : 1,
						}}
						title="Generar traducciones EN/PT desde el ES (usa glosario Midi de 46 mails históricos)"
					>
						{translating ? (
							<><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Traduciendo...</>
						) : (
							<><Languages size={13} /> Traducir ES → EN/PT</>
						)}
					</button>

					<button
						onClick={reset}
						style={{
							padding: "8px 12px", border: "1px solid #E5E5E8", borderRadius: 8,
							background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500,
							color: "#5a6268", display: "flex", alignItems: "center", gap: 6,
						}}
						title="Empezar de cero"
					>
						<RotateCcw size={13} />
					</button>

					<button
						onClick={copyHtml}
						style={{
							padding: "8px 12px", border: "1px solid #E5E5E8", borderRadius: 8,
							background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500,
							color: "#5a6268", display: "flex", alignItems: "center", gap: 6,
						}}
						title={`Copiar HTML del idioma ${activeLang.toUpperCase()}`}
					>
						<Copy size={13} /> Copiar
					</button>

					<button
						onClick={downloadCurrent}
						style={{
							padding: "8px 14px", border: "none", borderRadius: 8,
							background: "#1a1c1f", cursor: "pointer", fontSize: 13, fontWeight: 600,
							color: "#fff", display: "flex", alignItems: "center", gap: 6,
						}}
						title={`Descargar HTML del idioma ${activeLang.toUpperCase()}`}
					>
						<Download size={13} /> {activeLang.toUpperCase()}
					</button>

					<button
						onClick={downloadAll}
						style={{
							padding: "8px 14px", border: "none", borderRadius: 8,
							background: "#7646FF", cursor: "pointer", fontSize: 13, fontWeight: 600,
							color: "#fff", display: "flex", alignItems: "center", gap: 6,
						}}
						title="Descargar los 3 archivos .html"
					>
						<Download size={13} /> Los 3
					</button>
				</div>
			</div>

			{translateError && (
				<div style={{
					padding: "12px 24px", background: "#FEF2F2", borderBottom: "1px solid #FCA5A5",
					color: "#991B1B", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
				}}>
					<AlertCircle size={14} />
					Error al traducir: {translateError}
					<button
						onClick={() => setTranslateError(null)}
						style={{ marginLeft: "auto", border: "none", background: "transparent", cursor: "pointer", color: "#991B1B" }}
					><X size={14} /></button>
				</div>
			)}

			{toast && (
				<div style={{
					position: "fixed", bottom: 24, right: 24, zIndex: 100,
					padding: "12px 16px", borderRadius: 10,
					background: "#1a1c1f",
					color: "#fff", fontSize: 13, fontWeight: 500,
					display: "flex", alignItems: "center", gap: 8,
					boxShadow: "0 12px 32px rgba(0,0,0,0.16)",
					animation: "slideIn 0.2s ease-out",
				}}>
					<Check size={14} style={{ color: "#22C55E" }} />
					{toast.msg}
				</div>
			)}

			<div style={{
				display: "grid",
				gridTemplateColumns: "minmax(380px, 480px) 1fr",
				gap: 24,
				padding: 24,
				maxWidth: 1600,
				margin: "0 auto",
			}}>
				<div>
					<div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
						<div style={{ fontSize: 12, fontWeight: 600, color: "#5a6268", textTransform: "uppercase", letterSpacing: 0.5 }}>
							Bloques · editando {LANGS.find(l => l.code === activeLang)?.name}
						</div>
					</div>

					{blocks.map((block, i) => (
						<BlockCard
							key={block.id}
							block={block}
							index={i}
							total={blocks.length}
							lang={activeLang}
							onChange={(p) => updateBlock(block.id, p)}
							onRemove={() => removeBlock(block.id)}
							onMove={(dir) => moveBlock(block.id, dir)}
							isSelected={selectedId === block.id}
							onSelect={() => setSelectedId(block.id === selectedId ? null : block.id)}
						/>
					))}

					<div ref={addMenuRef} style={{ position: "relative" }}>
						<button
							onClick={() => setShowAddMenu(!showAddMenu)}
							style={{
								width: "100%", padding: "12px 14px",
								border: "1px dashed #C7C9CD", borderRadius: 12,
								background: "#FAFAFA", cursor: "pointer",
								fontSize: 14, fontWeight: 500, color: "#5a6268",
								display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
								transition: "all 0.15s",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.borderColor = "#7646FF";
								e.currentTarget.style.background = "#FAF8FF";
								e.currentTarget.style.color = "#7646FF";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.borderColor = "#C7C9CD";
								e.currentTarget.style.background = "#FAFAFA";
								e.currentTarget.style.color = "#5a6268";
							}}
						>
							<Plus size={16} /> Agregar bloque
						</button>
						{showAddMenu && (
							<div style={{
								position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6,
								background: "#fff", border: "1px solid #E5E5E8", borderRadius: 12,
								boxShadow: "0 12px 32px rgba(0,0,0,0.08)", overflow: "hidden",
								zIndex: 5,
							}}>
								{Object.entries(BLOCK_META).map(([k, m]) => {
									const Icon = m.icon;
									return (
										<button
											key={k}
											onClick={() => addBlock(k)}
											style={{
												width: "100%", padding: "10px 14px",
												border: "none", background: "#fff", cursor: "pointer",
												fontSize: 14, color: "#1a1c1f", textAlign: "left",
												display: "flex", alignItems: "center", gap: 10,
											}}
											onMouseEnter={(e) => { e.currentTarget.style.background = "#FAFAFA"; }}
											onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
										>
											<Icon size={14} style={{ color: m.color }} />
											{m.label}
										</button>
									);
								})}
							</div>
						)}
					</div>

					<div style={{
						marginTop: 24, padding: 14,
						background: "#FAF8FF", border: "1px solid #E8DEFF", borderRadius: 12,
						fontSize: 12, color: "#5a6268", lineHeight: 1.6,
					}}>
						<strong style={{ color: "#7646FF", display: "block", marginBottom: 6 }}>💡 Flujo recomendado</strong>
						<div style={{ marginBottom: 4 }}>1. Armá el mail completo en <strong>ES</strong>.</div>
						<div style={{ marginBottom: 4 }}>2. Click <strong>Traducir ES → EN/PT</strong>: usa el glosario Midi (46 mails históricos) y llena los vacíos.</div>
						<div style={{ marginBottom: 4 }}>3. Cambiá al toggle <strong>EN</strong> y luego <strong>PT</strong> para revisar.</div>
						<div>4. <strong>Descargar Los 3</strong> → bajás los 3 archivos listos.</div>
					</div>
				</div>

				<div>
					<div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
						<div style={{ fontSize: 12, fontWeight: 600, color: "#5a6268", textTransform: "uppercase", letterSpacing: 0.5 }}>
							{view === "preview" ? "Preview" : "HTML"} · {LANGS.find(l => l.code === activeLang)?.name}
						</div>
						<div style={{ fontSize: 11, color: "#8b959e", fontFamily: "'SF Mono', Monaco, monospace" }}>
							{sanitizeName(mailName)}_{activeLang.toUpperCase()}.html
						</div>
					</div>
					{view === "preview" ? (
						<EmailPreview html={html} key={activeLang} />
					) : (
						<div style={{
							background: "#1E1E22", borderRadius: 12, padding: 20,
							fontFamily: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace",
							fontSize: 12, lineHeight: 1.6, color: "#E8E8EB",
							overflow: "auto", maxHeight: "calc(100vh - 180px)",
							boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
						}}>
							<pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{html}</pre>
						</div>
					)}
				</div>
			</div>

			<style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
		</div>
	);
}
