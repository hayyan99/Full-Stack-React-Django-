import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, CheckCircle, Sparkles } from 'lucide-react'
import { motion , AnimatePresence } from 'framer-motion' //eslint-disable-line
import { userLogin } from '../services/api'

const FloatingParticles = () => {
    const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2
    })), [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
                    style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    )
}

function Signin({ onLogin }) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [rememberMe, setRememberMe] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleInputChange = (e) => {
        const {name , value} = e.target
        setFormData(prev => ({...prev, [name] : value}));
    }

    const validateForm = () => {
        const newErrors = {}
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address format'
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
        }
        
        return newErrors
    }

    const handleSubmit = async (e) => { 
        e.preventDefault() 
        const newErrors = validateForm()
        if (Object.keys(newErrors).length === 0) {
            try{
                const response = await userLogin({
                    email: formData.email,
                    password: formData.password
                })
                localStorage.setItem('user', JSON.stringify({
                    user_id: response.user_id,
                    username: response.username,
                    email: response.email,
                    isLoggedIn: true
                }))
                setIsSuccess(true)
                onLogin?.()
                setTimeout(() => navigate('/'), 1000)
            }
            catch (error) {
                setIsSuccess(false)
                setErrors({ submit: error?.message || 'Login failed' })
            }
        } else {
            setErrors(newErrors)
        }
    }

    const handleForgotPassword = () => {
        navigate('/forgot-password')
    }

    const formFields = [
        { name: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email', icon: Mail },
        { name: 'password', type: showPassword ? 'text' : 'password', label: 'Password', placeholder: 'Enter your password',
            icon: Lock, hasToggle: true }
    ]

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-800 relative">
            <FloatingParticles />
            
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}>
                        <motion.div
                            className="bg-green-500 p-8 rounded-full"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                            <CheckCircle className="w-16 h-16 text-white" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                className="w-full max-w-md mx-auto relative z-10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}>
                    
                <div className="bg-gray-700 p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-600 relative overflow-hidden">
                    <motion.div 
                        className="absolute top-4 right-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                        <Sparkles className="w-6 h-6 text-blue-400 opacity-50" />
                    </motion.div>
                    
                    <motion.div className="text-center mb-8"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}>
                        <motion.div 
                            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
                            animate={{ 
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                    "0 0 0 0 rgba(59, 130, 246, 0.7)",
                                    "0 0 0 10px rgba(59, 130, 246, 0)",
                                    "0 0 0 0 rgba(59, 130, 246, 0)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}>
                            <Lock className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-300 text-sm sm:text-base">Sign in to your account</p>
                    </motion.div>
                
                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {formFields.map((field, index) => {
                        const Icon = field.icon
                        return (
                                <motion.div 
                                    key={field.name}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                                    <div className="relative">
                                        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <motion.input 
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 ${field.hasToggle ? 'pr-12' : 'pr-4'} py-3 border rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                errors[field.name] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder={field.placeholder}
                                            whileFocus={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}/>
                                        {field.hasToggle && (
                                            <motion.button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}>
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </motion.button>
                                        )}
                                    </div>
                                    <div className='h-5'>
                                        {errors[field.name] && <p className="text-red-400 text-xs">{errors[field.name]}</p>}
                                    </div>
                                </motion.div>
                        )
                    })}

                        <motion.div 
                            className="flex items-center justify-between"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}>
                            <label className="flex items-center">
                                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 accent-blue-500 border-gray-500 rounded bg-gray-600"/>
                                <span className="ml-2 text-xs sm:text-sm text-gray-300">Remember me</span>
                            </label>
                            <motion.button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}>
                                Forgot password?
                            </motion.button>
                        </motion.div>

                        {errors.submit && (
                            <motion.div 
                                className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}>
                                <p className="text-black text-sm text-center">{errors.submit}</p>
                            </motion.div>
                        )}

                        <motion.button 
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 
                            rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer text-sm sm:text-base"
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}>
                            Sign In
                        </motion.button>
                </form>

                        <motion.div 
                            className="mt-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}>
                            <p className="text-gray-300 text-xs sm:text-sm">
                                Don't have an account?
                                <motion.button 
                                    onClick={() => navigate('/signup')}
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer ml-1"
                                    whileHover={{ scale: 1.05 }}>
                                    Sign up
                                </motion.button>
                            </p>
                        </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default Signin