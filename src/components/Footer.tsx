function Footer() {
  return (
    <footer className="max-w-4xl w-full mx-auto py-4 px-4 sm:px-6 border-y border-slate-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:text-slate-300">
      <p className="text-sm">
        Xây dựng bởi{" "}
        <a href="" className="text-sky-700 font-bold hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200" target="_blank">
          Tôi
        </a>
      </p>
      <ul className="flex space-x-4">
        <li>
          <a href="javascript:;" className="hover:text-slate-400 dark:hover:text-slate-200">
            <img src="/github.png" alt="GitHub" className="hover:scale-150 transition-transform duration-200 max-h-6 max-w-6 object-contain block overflow-hidden" />
          </a>
        </li>
        <li>
          <a href="javascript:;" className="hover:text-slate-400 dark:hover:text-slate-200">
            <img src="/email.png" alt="mail" className="hover:scale-150 transition-transform duration-200 h-6 w-6 object-contain block overflow-hidden" />
          </a>
        </li>
        <li>
          <a href="javascript:;" className="hover:text-slate-400 dark:hover:text-slate-200">
            <img src="/twitter.png" alt="twitter" className="hover:scale-150 transition-transform duration-200 h-6 w-6 object-contain block overflow-hidden" />
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
