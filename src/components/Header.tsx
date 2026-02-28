import Logo from './Logo';
function Header() {
    return (
        <header className="border-b border-gray-200">
            <div className="max-w-4xl w-full mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
                <div className="flex items-center space-x-2">
                    <Logo />
                </div>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="/" className="hover:text-gray-400">Blogs</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
