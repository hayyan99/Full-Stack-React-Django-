import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { CirclePlus, X, Wallet, LogOut, Menu, ChartColumnIncreasing, ChartNoAxesCombined, LogIn } from 'lucide-react';
import { createTransaction, userLogout } from "../services/api";  

export default function Header({ setTransactions, isAuthenticated, setIsAuthenticated }) {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const buttons = [
        { id: 1, label: "Expense", activeColor: "bg-red-500 text-white" },
        { id: 2, label: "Income", activeColor: "bg-emerald-500 text-white" },
    ];

    const lists = [
        {id: 1, label: 'Amount', type: 'number', placeholder: '0.00'},
        {id: 2, label: 'Description', type: 'text', placeholder: 'Enter description...'},
        {id: 3, label: 'Category', type: 'select', placeholder: 'Select a category'},
        {id: 4, label: 'Date', type: 'date'}
    ];

    const expensecategories = [
        'Food & Dining','Transportation','Shopping','Entertainment','Bills & Utilities', 'Healthcare', 'Other Expenses'

    ];

    const incomecategories = [
        'Salary','Freelance','Investment','Other Income'
    ];

    const link = [
        {label: 'Overview', to:'/', icon: <Wallet className="h-4 w-4"/>},
        {label: 'Transactions', to:'/transactions', icon: <ChartColumnIncreasing className="h-4 w-4"/>},
        {label: 'Analytics', to:'/analytics', icon: <ChartNoAxesCombined className="h-4 w-4"/>},
    ]

    const [activeButton, setActiveButton] = useState(1);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleChange = (field, value) => {
        //prev is previous formdata object and ...prev makes the shallow copy of the previous state
        //A computed property name in the object meaning it sets the property whose name is the value of the field.
        setFormData(prev => ({...prev, [field] : value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.description || !formData.category || !formData.date) {
            alert('Please fill in all fields');
            return;
        }

        const transactionData = {
            title: formData.description,
            amount: parseFloat(formData.amount),
            transaction_type: activeButton === 1 ? 'expense' : 'income',
            category: formData.category,
            description: formData.description
        };

        try{
            const newTransaction = await createTransaction(transactionData);
            setTransactions(prev => [...prev, {
                id: newTransaction.id,
                type: newTransaction.transaction_type,
                amount: parseFloat(newTransaction.amount),
                description: newTransaction.title,
                category: newTransaction.category,
                date: newTransaction.date.split('T')[0] 
            }]);

            setFormData({
                amount: '',
                description: '',
                category: '',
                date: new Date().toISOString().split('T')[0]
            });
            setActiveButton(1);
            setIsOpen(false);
        } catch (error) {
            alert('Failed to add transaction' + error.message);
        } 
    };  
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpen && !event.target.closest('.menu-container')) {
                setIsMenuOpen(false);
            }
        };
        
        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);
   
    return (
        <div className="w-full bg-gray-800 z-50">
            <div className="max-w-6xl mx-auto px-3">
                <nav className="flex items-center py-4 justify-between relative">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <div style={{background: "linear-gradient(90deg, rgba(93, 42, 155, 1) 0%, rgba(96, 83, 237, 1) 100%)"}} className="h-10 w-10 mr-2 rounded-lg flex items-center justify-center">
                                <Wallet size={20} className="text-white"/>
                            </div>
                        </Link>
                        <div>
                            <h1 className="text-white font-bold md:text-lg sm:text-sm text-sm">FinanceTracker</h1>
                            <h6 className="text-gray-400 md:text-sm sm:text-xs text-xs">Manage your finances with ease</h6>
                        </div>
                    </div>

                    {isAuthenticated && (
                        <div className="hidden md:flex text-white font-medium absolute left-1/2 transform -translate-x-1/2">
                            👋 Hi, <span className="ml-1">{user?.username}</span>
                        </div>
                    )}
                     
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <>
                                <button onClick={() => { setIsOpen(!isOpen)}} className="hidden md:flex justify-center items-center rounded-lg bg-blue-500 text-white font-semibold py-2 px-4 gap-1
                                hover:bg-blue-700 sm:text-sm text-sm md:text-sm cursor-pointer">
                                <CirclePlus className="h-4 w-4"/> Add Transaction
                                </button>
                                <div className="ml-3 hidden md:block cursor-pointer" onClick={async () => {
                                    try {
                                        await userLogout();
                                        setIsAuthenticated(false);
                                        localStorage.removeItem('user');
                                        navigate('/');
                                    } catch (error) {
                                        alert('Logout failed: ' + error.message);
                                    }
                                }}>
                                    <LogOut className="text-white w-5 h-5" />
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link to="/login" className="text-white hover:text-blue-300 font-medium">
                                    Sign In
                                </Link>
                                <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                        
                        <div className="menu-container ml-3 md:hidden relative">
                            <Menu size={32} onClick={toggleMenu} className="text-white cursor-pointer"/>
                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 bg-black/40 z-40"></div>
                            <div className="absolute right-0 top-10 z-50 w-64 bg-gray-800 rounded-xl shadow-xl p-4">
                                {isAuthenticated ? (
                                    <>
                                        <div className="flex mt-1">
                                            <div className="border-b border-gray-500 pb-3 mb-3">
                                                <p className="text-white font-semibold">{user?.username}</p>
                                                <p className="text-gray-400 text-sm">{user?.email}</p>
                                            </div>
                                            <button onClick={() => {setIsMenuOpen(false)}} 
                                            className="absolute top-6 right-4 text-gray-400 ">
                                                <X className="w-5 h-5"/>
                                            </button>
                                        </div>
                                        <button onClick={() => { 
                                            setIsOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex justify-center items-center rounded-lg bg-blue-500 text-white font-semibold py-2 px-4 gap-1
                                        hover:bg-blue-700 cursor-pointer">
                                            <CirclePlus className="h-4 w-4"/> Add Transaction
                                        </button>
                                        {link.map((l) => (
                                            <Link key={l.label} to={l.to} onClick={() => {setIsMenuOpen(false)}} className="flex items-center mt-5 gap-3 px-2 py-1 text-gray-300">
                                                {l.icon}
                                                <p>{l.label}</p>
                                            </Link>
                                        ))}
                                        <div className="flex items-center ml-2 mb-4 cursor-pointer mt-5 gap-1" onClick={async () => {
                                            try {
                                                await userLogout();
                                                setIsAuthenticated(false);
                                                localStorage.removeItem('user');
                                                setIsMenuOpen(false);
                                                navigate('/');
                                            } catch (error) {
                                                alert('Logout failed: ' + error.message);
                                            }
                                        }}>
                                            <LogOut className="w-5 h-5 text-red-500"/>
                                            <span className="text-red-500">Logout</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => {setIsMenuOpen(false)}} 
                                        className="absolute top-6 right-4 text-gray-400 ">
                                            <X className="w-5 h-5"/>
                                        </button>
                                        <div className="mt-9 space-y-3">
                                            <Link to="/login" onClick={() => {setIsMenuOpen(false)}} className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                                                Sign In
                                            </Link>
                                            <Link to="/signup" onClick={() => {setIsMenuOpen(false)}} className="block w-full text-center border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-50">
                                                Sign Up
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                        </div>
                    </div>
                </nav>
            </div>

            {isAuthenticated && isOpen && (
                <div className="fixed inset-0 flex justify-center items-center pr-4 pl-4 bg-black/40 z-40">
                    <div className="bg-white rounded-lg shadow-lg w-100 p-6 relative">
                        <div className="flex gap-3">
                            <h1 className="font-bold text-lg">Add Transaction</h1>
                            <button onClick={() => {setIsOpen(false)}} className="ml-auto text-gray-400 hover:text-gray-800 cursor-pointer">
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="flex justify-center gap-1.5 mt-5">
                            {buttons.map((bt) => (                                
                                <button key={bt.id} onClick={() => setActiveButton(bt.id)} className={`rounded-lg w-full font-semibold py-2 px-4 ${activeButton === bt.id ? bt.activeColor : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}>
                                    {bt.label}
                                </button>
                            ))}
                        </div>
                        {lists.map((list) =>(
                            <div key={list.id} className="mt-5">
                                <label className="text-sm font-semibold text-gray-700" >{list.label}</label>
                                {list.type === 'select' ? (
                                    <select onChange={(e) => handleChange('category', e.target.value)} value={formData.category} className="flex border border-gray-300 rounded-lg w-full mt-1 py-2 px-3">
                                        <option value="">{list.placeholder}</option>
                                        {(activeButton === 1 ? expensecategories :incomecategories).map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    ) : (
                                    <input type={list.type} onChange={(e) => handleChange(list.label.toLowerCase(), e.target.value)} value={formData[list.label.toLowerCase()]} placeholder={list.placeholder} className="flex border border-gray-300 rounded-lg w-full mt-1 py-2 px-3"></input>
                                )}
                            </div>
                        ))}
                        <div className="mt-5">
                            <button onClick={handleSubmit} className="border rounded-lg w-full bg-blue-500 text-white font-semibold py-3 hover:bg-blue-600 cursor-pointer">
                                + Add Transaction
                            </button> 
                        </div>
                    </div>
                </div>
            )}
        </div>
        
    )
}

