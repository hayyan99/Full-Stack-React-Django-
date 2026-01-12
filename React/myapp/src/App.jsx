import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './ProtectedRoute'
import Overview from './pages/Overview'
import Transactions from './pages/Transactions'
import Analytics from './pages/Analytics'
import Help from './pages/Help'
import Privacy from './pages/Privacy'
import Signin from './auth/sign-in'
import Signup from './auth/sign-up'
import ForgotPassword from './auth/verification/forgot-password'
import Pin from './auth/verification/pin'
import ChangePassword from './auth/verification/change-password'
import { fetchTransactions } from './services/api'

function App() {
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
    
    return (
    <>
      <div className='bg-gray-50'>
        {!isAuthRoute && <Header setTransactions={setTransactions} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>}
        <Routes>
          <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Overview transactions={transactions} onDelete={deletetransaction} /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Transactions transactions={transactions} onDelete={deletetransaction} /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Analytics transactions={transactions} /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Help /></ProtectedRoute>} />
          <Route path="/privacy" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Privacy /></ProtectedRoute>} />
          <Route path="/login" element={<Signin onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pin" element={<Pin />} /> 
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
        {!isAuthRoute && <Footer />}
      </div>
    </>
  )
}

export default App

