import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Shield, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line
import { forgotPassword } from '../../services/api'

const AnimatedLockIllustration = () => {
    return (
        <div className="flex justify-center mb-6">
            <motion.div 
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
                <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                    animate={{ 
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                    <Shield className="w-10 h-10 text-white" />
                </motion.div>
                
                {/* Floating dots around the lock */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full"
                        style={{
                            top: `${20 + Math.sin(i * Math.PI / 3) * 30}px`,
                            left: `${20 + Math.cos(i * Math.PI / 3) * 30}px`
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        />
                ))}
            </motion.div>
        </div>
    )
}

export default function ForgotPassword() {
    const navigate = useNavigate()
    // const timeoutRef = useRef(null)
    const [formData, setFormData] = useState({
        email: ''
    })
    const [errors, setErrors] = useState({})
    const [isSuccess, setIsSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // useEffect(() => {
    //     return () => {
    //         if (timeoutRef.current) {
    //             clearTimeout(timeoutRef.current)
    //         }
    //     }
    // }, [])

    const handleInputChange = (e) => {
        const {name , value} = e.target
        setFormData(prev => ({...prev, [name] : value}));
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }
        return newErrors
    }

    const handleSubmit = async (e) => { 
        e.preventDefault() 
        const newErrors = validateForm()
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true)
            try{
                await forgotPassword(formData.email)
                sessionStorage.setItem('resetEmail', formData.email)
                setIsSuccess(true)
            }
            catch (error) {
                setErrors({ email: error?.message || 'Failed to send reset code. Please try again.' })
            } finally {
                setIsLoading(false)
            }
        } else {
            setErrors(newErrors)
        }
    }

    const formFields = [
        { 
            name: 'email', 
            type: 'email', 
            label: 'Email', 
            placeholder: 'Enter your email', 
            icon: Mail 
        },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center p-6 pt-30 bg-gray-800 relative overflow-hidden">
            {/* Animated background gradient */}
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
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            onAnimationComplete={() => navigate('/pin')}>
                            <CheckCircle className="w-16 h-16 text-white" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"
                animate={{
                    background: [
                        "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
                        "linear-gradient(225deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
                        "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))"
                    ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}/>
            
            <motion.div 
                className="flex justify-center items-center relative z-10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}>
                <div className="bg-gray-700/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl w-full max-w-lg h-full border border-gray-600">
                    <AnimatedLockIllustration />
                    <motion.div className="text-center mb-8"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
                            <p className="text-gray-300">Please enter your registered email ID.</p>            
                            <p className="text-gray-300 text-sm">We will send a verification code to your registered email ID.</p>
                        </div>
                    </motion.div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {formFields.map((field, index) => {
                            const Icon = field.icon;
                            return (
                            <motion.div 
                                key={field.name}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}>
                                <div className="relative group">
                                    <motion.div
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                        whileHover={{ scale: 1.1, color: '#60A5FA' }}
                                        transition={{ duration: 0.2 }}>
                                        <Icon className="w-5 h-5" />
                                    </motion.div>
                                    <motion.input 
                                        type={field.type} 
                                        name={field.name}
                                        value={formData[field.name] }
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className={`w-full pl-10 pr-4 py-3 border bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                        transition-all duration-300 ${
                                            errors[field.name] ? 'border-red-500 shake' : 'border-gray-300'
                                        } group-hover:border-blue-400`}
                                        placeholder={field.placeholder}
                                        whileFocus={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}/>
                                </div>
                                <AnimatePresence>
                                    {errors[field.name] && (
                                        <motion.p 
                                            className="text-red-400 text-sm mt-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}>
                                            {errors[field.name]}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )})}

                        <motion.button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 
                            rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 
                            transform hover:scale-[1.02] cursor-pointer relative overflow-hidden ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                            <motion.div
                                className="absolute inset-0 bg-white/20"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.6 }}/>
                            <span className="relative z-10">{isLoading ? 'Sending...' : 'Send Reset Code'}</span>
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}