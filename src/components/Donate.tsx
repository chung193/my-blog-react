import { useState, useEffect } from "react";

interface DonateButtonProps {
    imageUrl: string;
    donateUrl: string;
    tooltip?: string;
}

export default function DonateButton({
    imageUrl,
    donateUrl,
    tooltip = "Ủng hộ dự án nuôi anh 1 cốc ☕",
}: DonateButtonProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`
                fixed bottom-20 right-3 sm:top-20 sm:bottom-auto sm:right-6 z-50
                transition-all duration-500 ease-in-out
                ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
            `}
        >
            <div className="hidden sm:block
                    absolute right-20 top-1/2 -translate-y-1/2
                    dark:text-slate-200 text-xs
                    px-3 py-1.5 whitespace-nowrap
                    before:content-[''] before:absolute before:left-full before:top-1/2
                    before:-translate-y-1/2"
            >
                {tooltip}
            </div>
            {/* Button */}
            <a
                href={donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="block w-14 h-14 sm:w-20 sm:h-20
                overflow-hidden cursor-pointer
                transition-all duration-200"
            >
                <img
                    src={imageUrl}
                    alt="Donate"
                    className="w-full h-full object-cover"
                />
            </a>

            {/* Ping animation */}
            <span className="
                absolute -top-0 -right-0
                flex h-3 w-3
            ">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500" />
            </span>
        </div>
    );
}

