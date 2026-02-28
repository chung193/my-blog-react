function Footer() {
    return (
        <footer className="max-w-4xl w-4xl mx-auto aspect-3/2 py-4 flex justify-between max-h-16 border-y border-gray-200">
            <p className="text-sm">Xây dựng bởi <a href="" className="text-sky-700 font-bold hover:text-sky-900" target="_blank">tôi</a></p>
            <ul className="flex space-x-4 mt-2">
                <li>
                    <a href="javascript:;" className="hover:text-gray-400">
                        <img src="/github.png" alt="GitHub" className="hover:scale-150 transition-transform duration-200 max-h-6 max-w-6 object-contain block overflow-hidden" />
                    </a>
                </li>
                <li>
                    <a href="javascript:;" className="hover:text-gray-400">
                        <img src="/email.png" alt="mail" className="hover:scale-150 transition-transform duration-200 h-6 w-6 object-contain block overflow-hidden" />
                    </a>
                </li>
                <li>
                    <a href="javascript:;" className="hover:text-gray-400">
                        <img src="/twitter.png" alt="twitter" className="hover:scale-150 transition-transform duration-200 h-6 w-6 object-contain block overflow-hidden" />
                    </a>
                </li>
            </ul>
        </footer>
    );
}

export default Footer;