import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/header'
import Footer from './components/footer'
import Overview from './pages/overview'
import Transactions from './pages/transaction'
import Analytics from './pages/analytics'
import Help from './pages/help'
import Privacy from './pages/privacy'
import Contact from './pages/contact'
import Signin from './auth/sign-in'
import Signup from './auth/sign-up'
import ForgotPassword from './auth/verification/forgot-password'
import Pin from './auth/verification/pin'
import ChangePassword from './auth/verification/change-password'
import { fetchTransactions } from './services/api'

export default function App() {
    const [transactions, setTransactions] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
      const user =  JSON.parse(localStorage.getItem('user'))
      return user ? user.isLoggedIn : false
    })
    const location = useLocation()

    const deletetransaction = (id) => {
      setTransactions(transactions.filter((tran) => tran.id !== id))
    }

    const isAuthRoute = [
      '/login', 
      '/signup', 
      '/forgot-password', 
      '/pin', 
      '/change-password'].includes(location.pathname)

    useEffect(() => {
      const getTransactions = async () => {
          if (!isAuthenticated) {
              return; 
          }
          try {
              const data = await fetchTransactions();
              const normalizedData = data.transactions?.map(transaction => ({
                  ...transaction,
                  type: transaction.transaction_type,
                  amount: parseFloat(transaction.amount)
              })) || [];
              setTransactions(normalizedData);
          } catch (error) {
              console.error('Failed to fetch transactions:', error);
              setTransactions([]);
              setIsAuthenticated(false);
          }
      };
      getTransactions();
    }, [isAuthenticated]);

    useEffect(() => {
      setTimeout(() => {
        if (!isAuthRoute) {
          window.scrollTo(0, 0)
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0
        } else {
          window.scrollTo(0, 0)
        }
      }, 100)
    }, [location, isAuthRoute])

    return (
    <>
      <div className='bg-gray-50 min-h-screen flex flex-col'>
        {!isAuthRoute && <Header setTransactions={setTransactions} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Overview transactions={transactions} onDelete={deletetransaction} isAuthenticated={isAuthenticated} />}/>
            <Route path="/transactions" element={<Transactions transactions={transactions} onDelete={deletetransaction} isAuthenticated={isAuthenticated}/>} />
            <Route path="/analytics" element={<Analytics transactions={transactions} isAuthenticated={isAuthenticated}/>} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={<Signin onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/pin" element={<Pin />} /> 
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        {!isAuthRoute && <Footer />}
      </div>
    </>
  )
}

