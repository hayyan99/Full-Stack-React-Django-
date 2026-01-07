import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { deleteTransaction } from "../services/api";

function Lists({ tran = [], onDelete }) {
    const [input, setInput] = useState("")
    const [type, setType] = useState("All types")
    const [category, setCategory] = useState("All Categories")
    
    const transactions = Array.isArray(tran) ? tran : [];
    
    const filtertrans = transactions.filter(transaction => {
        
        const searchMatch = 
        transaction.description.toLowerCase().includes(input.toLowerCase()) || 
        transaction.category.toLowerCase().includes(input.toLowerCase());

        const typeMatch = 
        type === 'All types' ||
        transaction.type.toLowerCase() === type.toLowerCase(); 

        const categoryMatch = 
        category === 'All Categories' ||
        transaction.category.toLowerCase() === category.toLowerCase();

        return searchMatch && typeMatch && categoryMatch;
    })

    const filtering = [
        {id: 1, label: "Transactions Types", type: 'select', placeholder: 'All types'},
        {id: 2, label: "transactions Categories", type: 'select', placeholder: 'All Categories'}
    ]

    const types = [
        'All types', 'Income', 'Expense'
    ];

    const categories= [
        'All Categories', 'Salary','Freelance','Investment','Other Income', 'Food & Dining','Transportation','Shopping','Entertainment','Bills & Utilities', 'Healthcare', 'Other Expenses'
    ];

    const handleChange = (value) => {
        setInput(value)
    }

    const deletetransaction = async (deleteId) => {
        try {
            await deleteTransaction({ id: deleteId });
            onDelete(deleteId);
        }catch (error) {
            alert('Failed to delete transaction' + error.message);
        }
    } 

    return (
        <div className="rounded-lg border border-gray-100 bg-white gap-6 p-4 w-full max-w-6xl mx-auto mt-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute top-1/2 left-3 translate-y-[-50%] h-4 w-4 text-gray-400"></Search>
                    <input type='search' placeholder="Search transactions..." value={input} onChange={(e) => handleChange(e.target.value)} className="border border-gray-300 rounded-lg w-full h-10 pl-10 pr-4"></input>
                </div>
                {filtering.map((filter) => (
                    <div key={filter.id} className="flex rounded-lg border border-gray-300 px-3 py-2 hover:border-blue-500">
                        <select value={filter.id===1 ? type : category} onChange={(e) => filter.id===1 ? setType(e.target.value) : setCategory(e.target.value)} className="border-none outline-none bg-transparent text-gray-700 ">
                            {filter.type === 'select' && filter.id === 1 ? (
                                types.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))
                                ) : (
                                    categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))
                            )}                                   
                        </select>
                    </div>
                ))}
            </div>
            {filtertrans.length === 0 ? (
                <div className="flex flex-col items-center mt-10 text-gray-500">
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    
                </div>
                ): (
                <ul className="divide-y divide-gray-200 mt-4 w-full">
                    {filtertrans.map((item,index) => (
                        <li key={index} className="py-3">
                            <div className="flex gap-4 items-center">
                                <div className={`w-3 h-3 rounded-full ${item.type === 'expense' ? 'bg-red-500' : 'bg-emerald-600'}`}></div>
                                <div>
                                    <p className="font-medium text-gray-900">{item.description}</p>
                                    <p className="text-sm text-gray-500">{item.category}</p>
                                </div> 
                                <div className= {`ml-auto font-medium pr-4 ${item.type === 'expense' ? 'text-red-500' : 'text-emerald-600'}`}>
                                    {item.type === 'expense' ? '-' : '+'}{item.amount.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits: 2})} PKR</div>   

                                <div>
                                    <button onClick={() => deletetransaction(item.id)}><Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"/></button>
                                </div>
                            </div>
                        </li>
                    ))}
                    </ul>
                )
            }
        </div>
    )
}

export default Lists
