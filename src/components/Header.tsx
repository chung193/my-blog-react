import Logo from './logo';
function Header() {
    return (
        <header className="aspect-3/2 border-b border-gray-200 max-h-16">
            <div className="max-w-4xl w-4xl mx-auto container mx-auto flex items-center justify-between">
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