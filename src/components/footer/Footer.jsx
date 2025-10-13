import "./Footer.css"


function Footer() {


    return (
        <div className="footer">
            <div className="footer-left">
                <span>© {new Date().getFullYear()} CFB Website</span>
            </div>
            <div className="footer-links">
                <a href="/about">About</a>
                <a href="/faq">FAQ</a>
                <a href="/contact">Contact</a>
            </div>
            <div className="footer-right">
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                    <img src="/icons/twitter.svg" alt="Twitter" />
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer">
                    <img src="/icons/github.svg" alt="GitHub" />
                </a>
            </div>
        </div>
    );
}
export default Footer;