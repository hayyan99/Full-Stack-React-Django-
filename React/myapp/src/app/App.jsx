import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import Overview from '@/features/transactions/pages/overview'
import Transactions from '@/features/transactions/pages/transactions'
import Analytics from '@/features/analytics/pages/analytics'
import Help from '@/features/support/pages/help'
import Privacy from '@/features/support/pages/privacy'
import Contact from '@/features/support/pages/contact'
import Signin from '@/features/auth/pages/sign-in'
import Signup from '@/features/auth/pages/sign-up'
import ForgotPassword from '@/features/auth/pages/forgot-password'
import Pin from '@/features/auth/pages/pin'
import ChangePassword from '@/features/auth/pages/change-password'
import { fetchTransactions } from '@/features/transactions/api/transactions.api'
import ChatWidget from '@/features/chatbot/components/chatwidget'

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'))
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
        {!isAuthRoute && <Header setTransactions={setTransactions} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Overview transactions={transactions} onDelete={deletetransaction} isAuthenticated={isAuthenticated} />} />
            <Route path="/transactions" element={<Transactions transactions={transactions} onDelete={deletetransaction} isAuthenticated={isAuthenticated} />} />
            <Route path="/analytics" element={<Analytics transactions={transactions} isAuthenticated={isAuthenticated} />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Signin onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
            <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />} />
            <Route path="/pin" element={isAuthenticated ? <Navigate to="/" replace /> : <Pin />} />
            <Route path="/change-password" element={isAuthenticated ? <Navigate to="/" replace /> : <ChangePassword />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          {isAuthenticated && <ChatWidget />}
        </div>
        {!isAuthRoute && <Footer />}
      </div>
    </>
  )
}

