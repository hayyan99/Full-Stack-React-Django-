import { useState } from "react";

function Capacity({ tran = [] }) {
    const transactions = Array.isArray(tran) ? tran : [];
    
    // Group transactions by type for performance
    const incomeTransactions = transactions.filter(transaction => transaction.type === 'income');
    const expenseTransactions = transactions.filter(transaction => transaction.type === 'expense');

    // Calculate totals
    const totalIncome = incomeTransactions.reduce((total, transaction) => total + transaction.amount, 0.00);
    const totalExpenses = expenseTransactions.reduce((total, transaction) => total + transaction.amount, 0.00);

    // Calculate percentage
    const getPercentage = (amount, total) => {
        if (total === 0) return "0.00";
        return ((amount / total) * 100).toFixed(2);
    };

    const expensepercents = expenseTransactions.map((transaction, index) => {    
        const percentage = getPercentage(transaction.amount, totalExpenses);
        return {
            title: 'Expense By Category',
            categories: transaction.category,
            subtitle: `${percentage}% `,
            amount: `${transaction.amount.toLocaleString('en-Us', {minimumFractionDigits:2, maximumFractionDigits: 2})}`,
            percentage: percentage,
            activeDotColor: 'bg-red-500',
            activeLineColor: 'bg-red-500'
        };
    });

    const incomepercents = transactions
    .filter(transaction => transaction.type === 'income')
    .map((transaction, index) => {    
        const percentage = ((transaction.amount / totalIncome) * 100).toFixed(2);
        return {
            title: 'Income By Category',
            categories: transaction.category,
            subtitle: `${percentage}% `,
            amount: `${transaction.amount.toLocaleString('en-Us', {minimumFractionDigits:2, maximumFractionDigits: 2})}`,
            percentage: percentage,
            activeDotColor: 'bg-emerald-700',
            activeLineColor: 'bg-emerald-700'
        };
    });
    
    return (
        <div className="mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="border border-gray-100 rounded-lg bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Expenses By Category</h3>
                    {expensepercents.length === 0 ? (
                        <p className="text-gray-500 flex justify-center py-10">No expense transactions yet</p>
                    ) : (
                        expensepercents.map((expense, index) => (
                            <div key={index} >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center mt-4 space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${expense.activeDotColor}`}></div>
                                        <p className="text-sm text-gray-900 font-medium">{expense.categories}</p>
                                    </div>
                                    <div className="flex items-center mt-4 space-x-2">
                                        <p className="text-sm text-gray-500">{expense.subtitle}</p>
                                        <p className="text-gray-900 font-medium">{expense.amount} PKR</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-lg h-2 mt-2 overflow-hidden">
                                    <div className={`h-2 rounded-lg ${expense.activeLineColor}`} style={{width: `${expense.percentage}%`}}></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="border border-gray-100 rounded-lg bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Income By Category</h3>
                    {incomepercents.length === 0 ? (
                        <p className="text-gray-500 flex justify-center py-10">No income transactions yet</p>
                    ) : (
                        incomepercents.map((income, index) => (
                            <div key={index} >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center mt-4 space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${income.activeDotColor}`}></div>
                                        <p className="text-sm text-gray-900 font-medium">{income.categories}</p>
                                    </div>
                                    <div className="flex items-center mt-4 space-x-2">
                                        <p className="text-sm text-gray-500">{income.subtitle}</p>
                                        <p className="text-gray-900 font-medium">{income.amount} PKR</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-lg h-2 mt-2 overflow-hidden">
                                    <div className={`h-2 rounded-lg ${income.activeLineColor}`} style={{width: `${income.percentage}%`}}></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* <div className="border border-gray-100 rounded-lg bg-white p-6 mt-5">
                <h3 className="text-lg font-semibold text-gray-900 flex justify-center">Charts</h3>
                {charts.length === 0 ? (
                    <p className="text-gray-500 flex justify-center py-10">No transactions yet</p>
                ) : (
                    <div></div>
                )} 
            </div> */}
        </div>

    )
}

export default Capacity
