import Capacity from '../components/capacity.jsx';
import { Wallet, ChartColumnIncreasing, ChartNoAxesCombined } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default  function Analytics({ isAuthenticated, transactions }) {
    const navigate = useNavigate();
    
    const tabs = [
        { icon: <Wallet className="h-4 w-4"/>, id: "overview", label: "Overview"},
        { icon: <ChartColumnIncreasing className="h-4 w-4"/>, id: "transactions", label: "Transactions"},
        { icon: <ChartNoAxesCombined className="h-4 w-4"/>, id: "analytics", label: "Analytics"}
    ];

    if (!isAuthenticated) {
        return (
            <div className="px-3 pt-2 sm:pt-7 w-full max-w-6xl mx-auto">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
                    <p className="text-gray-600 mb-6">Sign in to view your financial analytics and insights</p>
                    <button onClick={() => navigate('/login')} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="px-3 pt-2 sm:pt-7 w-full max-w-6xl mx-auto">
            <div className="hidden md:flex flex-col rounded-2xl bg-gray-100 text-white p-3 border justify-center items-center sm:flex-row gap-4">
                {tabs.map((tab) => (
                    <button 
                        onClick={() => navigate(tab.id === 'overview' ? '/' : `/${tab.id}`) } 
                        key={tab.label} 
                        className={`rounded flex justify-center items-center font-semibold py-2 px-4 w-full cursor-pointer ${
                            tab.id === 'analytics' ? 'bg-white text-blue-500' : 'text-gray-500 hover:bg-white hover:text-blue-500'
                        }`}
                    >
                        <span className="opacity-70 mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>
            <Capacity tran={transactions}/>
        </div>
    );
}

