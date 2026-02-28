function Logo() {
    return (
        <div className="flex items-center space-x-2  overflow-visible">
            <a href="/">
                <img
                    src="/logo.gif"
                    alt="Logo"
                    width="50"
                    height="50"
                    className="hover:scale-200 origin-top hover:translate-y-1 transition-transform duration-200 cursor-pointer"
                />
            </a>
        </div>
    );
}

export default Logo;