import { readFileSync } from "fs";
import { resolve } from "path";
import { ABOUT, SOCIALS } from "site:config";

export const buildVcard = () => {
	const imagePath = resolve(`public/images/profile/bw.jpeg`);

	let imageBase64: string = "";
	if (imagePath) {
		const imageBuffer = readFileSync(imagePath ?? "");
		imageBase64 = imageBuffer.toString("base64");
	}

	const lines = [
		`BEGIN:VCARD`,
		`VERSION:3.0`,
		`FN;CHARSET=UTF-8:${ABOUT.name}`,
		`N;CHARSET=UTF-8:${ABOUT.lastName};${ABOUT.firstName};;;`,
		`EMAIL;CHARSET=UTF-8;type=WORK,INTERNET:${SOCIALS.email.href.replace("mailto:", "")}`,
		imagePath ? `PHOTO;ENCODING=b;TYPE=JPEG:${imageBase64}` : "",
		`TEL;TYPE=CELL:${SOCIALS.phone.href.replace("tel:", "")}`,
		`ADR;CHARSET=UTF-8;TYPE=HOME:;;;${ABOUT.location?.city};;;${ABOUT.location?.region}`,
		`ROLE;CHARSET=UTF-8:${ABOUT.jobTitles[0]}`,
		`URL;CHARSET=UTF-8:${import.meta.env.SITE_URL ?? import.meta.env.URL}`,
		`X-SOCIALPROFILE;TYPE=linkedin:${SOCIALS.linkedin.href}`,
		`X-SOCIALPROFILE;TYPE=github:${SOCIALS.github.href}`,
		`X-SOCIALPROFILE;TYPE=facebook:${SOCIALS.facebook.href}`,
		`REV:${new Date().toISOString()}`,
		`END:VCARD`,
	].filter(Boolean);

	return lines.join("\n");
};
