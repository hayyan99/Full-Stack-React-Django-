function Help() {
    const faqs = [
        {
            question: "How do I add a transaction?",
            answer: "Go to the Transactions tab and click 'Add Transaction'. Fill in the amount, category, and description."
        },
        {
            question: "How do I set a budget?",
            answer: "Navigate to Analytics to view your spending patterns and set monthly budget limits for different categories."
        },
        {
            question: "Can I export my data?",
            answer: "Yes, you can export your transaction history as CSV from the Transactions page."
        },
        {
            question: "How do I delete a transaction?",
            answer: "In the Transactions tab, click the delete icon next to any transaction you want to remove."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Help & Support</h1>
            
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                            <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Need More Help?</h2>
                <p className="text-gray-600 mb-4">Can't find what you're looking for? Contact our support team.</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Contact Support
                </button>
            </div>
        </div>
    );
}

export default Help;