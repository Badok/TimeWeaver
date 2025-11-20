import type { Metadata } from "next";
import "./globals.css";
import { Arsenal, Sedan, Shadows_Into_Light, Cutive_Mono } from "next/font/google";

const arsenal = Arsenal({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-arsenal",
});

const sedan = Sedan({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-sedan",
});

const shadows = Shadows_Into_Light({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-shadows",
});

const cutive = Cutive_Mono({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-cutive",
});


export const metadata = {
    title: "TimeWeaver",
    description: "AI-assisted scheduling that speaks your language.",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${arsenal.variable} ${sedan.variable} ${shadows.variable} ${cutive.variable}`}
        >
        <body className="font-sans bg-frame text-[--color-text-dark]">
        {children}
        </body>
        </html>
    );
}
