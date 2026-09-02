/**
 * Facebook reviews and testimonials from the FLIC Sites freelancing years.
 *
 * Screenshots rather than transcribed text, because the point is that they are
 * someone else's words in someone else's account, not a quote I typed.
 */
export interface Testimonial {
	name: string;
	src: string;
	width: number;
	height: number;
}

export const TESTIMONIALS: Testimonial[] = [
	{ name: "Jo Murray", src: "/images/testimonials/Jo Murray.jpg", width: 382, height: 248 },
	{ name: "Kylie Snowley-Noden", src: "/images/testimonials/Kylie Snowley-Noden.jpg", width: 382, height: 232 },
	{ name: "Adam Bridgford", src: "/images/testimonials/Adam Bridgford.jpg", width: 382, height: 470 },
	{ name: "Tom Cartwright", src: "/images/testimonials/Tom Cartwright.jpg", width: 382, height: 248 },
	{ name: "Vanessa Medling", src: "/images/testimonials/Vanessa Medling.jpg", width: 382, height: 232 },
	{ name: "Harry McGowan", src: "/images/testimonials/Harry McGowan.jpg", width: 382, height: 177 },
	{ name: "Marc Miles", src: "/images/testimonials/Marc Miles.jpg", width: 382, height: 249 },
	{ name: "Jade Varley", src: "/images/testimonials/Jade Varley.jpg", width: 382, height: 230 },
	{ name: "Patti Williams", src: "/images/testimonials/Patti Williams.jpg", width: 382, height: 253 },
	{ name: "Sandra Karamitelios", src: "/images/testimonials/Sandra Karamitelios.jpg", width: 382, height: 578 },
];
