import React from 'react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-40 pb-20 lg:pt-48 lg:pb-24">

            <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-slate-200 to-slate-300" />
            <div
                className="absolute inset-0 -z-10 pointer-events-none mask-t-from-50% mask-radial-[50%_90%] mask-radial-from-80%"
                style={{
                    backgroundImage: `
        repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 16px),
        repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 16px),
        repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 16px)
      `,
                }}
            />

            {/* Main content */}
            <div className="relative mx-auto max-w-4xl text-center px-6">
                <h1 className="text-4xl font-bold md:text-6xl text-gray-900">
                    Handcrafted HTML, Tailwind and
                    <br />
                    Bootstrap Templates and UI Kits
                </h1>

                <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                    High-quality landing page and website templates, handcrafted with
                    Tailwind CSS, Bootstrap, and HTML. Build beautiful websites without
                    coding from scratch.
                </p>

                <button className="mt-10 inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-6 py-3 text-lg hover:bg-black transition">
                    Explore All Templates
                </button>
            </div>
        </section>
    );
}