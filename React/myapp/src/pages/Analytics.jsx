import Capacity from '../components/Capacity';
import { Wallet, ChartColumnIncreasing } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Analytics({ transactions }) {
    const navigate = useNavigate();
    
    const tabs = [
        { icon: <Wallet className="h-4 w-4"/>, id: "overview", label: "Overview"},
        { icon: <ChartColumnIncreasing className="h-4 w-4"/>, id: "transactions", label: "Transactions"},
        { icon: <ChartColumnIncreasing className="h-4 w-4"/>, id: "analytics", label: "Analytics"}
    ];

    return (
        <div className="px-3 pt-25 sm:pt-24 w-full max-w-6xl mx-auto">
            <div className="rounded-2xl bg-gray-100 text-white p-3 border justify-center items-center flex flex-col sm:flex-row gap-4">
                {tabs.map((tab) => (
                    <button 
                        onClick={() => navigate(tab.id === 'overview' ? '/' : `/${tab.id}`)} 
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

export default Analytics;