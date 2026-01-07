import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Footer() {
    const navigate = useNavigate();
    const socialMedia = [
        {src: "./images/facebook.png", alt: "facebook", url: "https://www.facebook.com/"},
        {src: "./images/insta.png", alt: "instagram", url: "https://www.instagram.com/"},
        {src: "./images/linki.png", alt: "linkedin", url: "https://www.linkedin.com/"},
        {src: "./images/twitter.png", alt: "twitter", url: "https://x.com/"},
    ];

    const links = [
        "Home", "Transactions", "Analytics", "Help", "Privacy Policy"
    ];

    return (
        <footer className="bg-gray-900 overflow-hidden mt-10">
            <div className="text-center mx-auto py-10 px-6 md:px-0 max-w-2xl">
                <h1 className="text-white text-center font-bold text-2xl">FinanceTracker</h1>
                <p className="text-gray-400 mt-3 text-sm">Take control of your finances with our easy-to-use expense tracking platform. 
                    Monitor your spending, set budgets, and achieve your financial goals.
                Start your journey to financial freedom today!</p>
                <a onClick={() => {navigate('/login'); window.scrollTo(0,0);}} className="text-white border-2 rounded-full px-4 py-2 mt-4 text-sm bg-blue-700 inline-block hover:bg-blue-900 cursor-pointer">Get Started</a>
                <div className="flex justify-center gap-6 mt-6 cursor-pointer">
                    {socialMedia.map((icon, index) => (
                        <a href={icon.url} key={index} target="_blank" rel="noopener noreferrer">
                            <img src={icon.src} alt={icon.alt} className="w-8 h-8 object-contain opacity-70 hover:opacity-100"/>
                        </a>
                    ))}
                </div>
            </div>
            
            <div className="bg-gray-800 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm mx-8">
                    <p className="text-center text-gray-500 font-light text-1xl">Copyright© 2024 FinanceTracker</p>
                    <ul className="flex justify-center flex-wrap gap-6 text-white mt-2 md:mt-0">
                        {links.map((link, index) => (
                            <li key={index} className="cursor-pointer hover:text-blue-400">
                                {link === 'Home' ? (
                                    <Link to='/' onClick={() => window.scrollTo(0, 0)}>{link}</Link>
                                ) : link === 'Transactions' ? (
                                    <Link to='/transactions' onClick={() => window.scrollTo(0, 0)}>{link}</Link>
                                ) : link === 'Analytics' ? (
                                    <Link to='/analytics' onClick={() => window.scrollTo(0, 0)}>{link}</Link>
                                ) : link === 'Help' ? (
                                    <Link to='/help' onClick={() => window.scrollTo(0, 0)}>{link}</Link>
                                ) : link === 'Privacy Policy' ? (
                                    <Link to='/privacy' onClick={() => window.scrollTo(0, 0)}>{link}</Link>
                                ):(
                                    <span>{link}</span>
                                )}
                            </li>
                        ))}
                        
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer;