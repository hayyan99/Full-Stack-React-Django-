import { DollarSign } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { TrendingDown } from 'lucide-react';
import { Activity } from 'lucide-react';


function Boxes({ tran = [] }) {
    const formatLargerNumbers = (num) => {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2}), '0.00 PKR';
        }
    }

    const transactions = Array.isArray(tran) ? tran : [];

    const totalIncome = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0.00)

    const totalExpenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0.00)
  
    const totalBalance = totalIncome - totalExpenses;

    const thisMonthNet = transactions
        .filter(transaction => 
            new Date(transaction.date).getMonth() === new Date().getMonth() &&
            new Date(transaction.date).getFullYear() === new Date().getFullYear()
        )
        .reduce((total, transaction) => transaction.type === 'income' ? total + transaction.amount : total - transaction.amount, 0.00)
        
    const boxes = [
        { id: 1, title: 'Total Balance', content:  `${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PKR`, icon: <DollarSign  />, bgColor: 'bg-emerald-100', alt: 'totalBalance'},
        { id: 2, title: 'Total Income', content:  `${totalIncome.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} PKR`, icon: <TrendingUp />, bgColor: 'bg-emerald-50', alt: 'totalIncome' },
        { id: 3, title: 'Total Expenses', content: `${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} PKR`, icon: <TrendingDown /> , bgColor: 'bg-red-50', alt: 'totalExpenses' },
        { id: 4, title: 'This Month Net', content:  `${thisMonthNet.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} PKR`, icon: <Activity /> , bgColor: 'bg-emerald-50', alt: 'thisMonthNet' },
    ];
   
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 w-full max-w-6xl mx-auto mt-5">
            {boxes.map((box) => (
                <div key={box.id} className="flex justify-center items-center bg-white p-3 rounded-lg shadow transition-transform duration-300 ease-out hover:scale-105 hover:shadow-gray-500 h-28">
                    <div>
                        <h2 className="text-sm font-medium text-gray-600 mb-1">{box.title}</h2>
                        <p className={` ${ 
                            box.id===1 ? (totalBalance >= 0) ? 'text-emerald-600 text-2xl font-bold' : 'text-red-500 text-2xl font-bold' :
                            box.id===2 ? 'text-emerald-600 text-2xl font-bold' :
                            box.id===3 ? 'text-red-500 text-2xl font-bold' :
                            box.id===4 ? (thisMonthNet >= 0) ? 'text-emerald-600 text-2xl font-bold' : 'text-red-500 text-2xl font-bold' :
                            "text-2xl font-bold"
                        }`}>                        
                            {box.content}</p>
                    </div>
                    <div className={`flex justify-center items-center w-12 h-12 rounded ml-auto 
                    ${
                        box.id===1 ? (totalBalance >= 0) ? 'text-emerald-500' : 'text-red-500' :
                        box.id===2 ? 'text-emerald-600' :
                        box.id===3 ? 'text-red-600' :
                        box.id===4 ? (thisMonthNet >= 0) ? 'text-emerald-600' : 'text-red-600' :
                        ""
                    } 
                    ${
                        box.id===1 ? (totalBalance >= 0) ? 'bg-emerald-50' : 'bg-red-50' :
                        box.id===2 ? 'bg-emerald-50' :
                        box.id===3 ? 'bg-red-50' :
                        box.id===4 ? (thisMonthNet >= 0) ? 'bg-emerald-50' : 'bg-red-50' :
                        ""
                    }`}>
                        {box.icon}
                    </div>
                </div>
            ))}
        </div>
    );
}
export default Boxes;
