import { useEffect, useState } from 'react'
import { fetchFAQs } from '../services/api';
import { Link } from 'react-router-dom';

function Help() {
    const [ faqs, setFaqs ] = useState([]);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const loadFAQs = async () => {
            try {
                const response = await fetchFAQs();
                setFaqs(response.faqs);
            } catch (err) {
                setError(err.message);
            } 
        };
        loadFAQs();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Help & Support</h1>
            
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                            <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    ))}

                    {error && (
                        <p className="text-red-500">Error Loading FAQs: {error}</p>
                    )}
                </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Need More Help?</h2>
                <p className="text-gray-600 mb-4">Can't find what you're looking for? Contact our support team.</p>
                <Link className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" to="/contact">
                    Contact Support
                </Link>
            </div>
        </div>
    );
}

export default Help;