import { useState, useEffect } from "react";

interface DonateButtonProps {
    imageUrl: string;
    donateUrl: string;
    tooltip?: string;
}

export default function DonateButton({
    imageUrl,
    donateUrl,
    tooltip = "Ủng hộ tôi ☕",
}: DonateButtonProps) {
    const [visible, setVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

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
            {/* Tooltip */}
            {showTooltip && (
                <div className="
                    hidden sm:block
                    absolute right-20 top-1/2 -translate-y-1/2
                    bg-gray-800 text-white text-xs
                    px-3 py-1.5 rounded-lg whitespace-nowrap
                    shadow-lg
                    before:content-[''] before:absolute before:left-full before:top-1/2
                    before:-translate-y-1/2 before:border-4
                    before:border-transparent before:border-l-gray-800
                ">
                    {tooltip}
                </div>
            )}

            {/* Button */}
            <a
                href={donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="
            block w-14 h-14 sm:w-20 sm:h-20
            ring-2 ring-white
            overflow-hidden cursor-pointer
            transition-all duration-200
            "
            >
                <img
                    src={imageUrl}
                    alt="Donate"
                    className="w-full h-full object-cover rounded-2xl"
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
