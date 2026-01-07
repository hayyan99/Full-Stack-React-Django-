import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line
import { CheckCircle, Mail, Sparkles } from 'lucide-react'
import { forgotPassword, verifyPin } from '../../services/api'

// Floating particles component
const FloatingParticles = () => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2
    }))

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

export default function Pin() {
    const navigate = useNavigate()
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [errors, setErrors] = useState({})
    const [isSuccess, setIsSuccess] = useState(false)
    const inputRefs = useRef([]);

    const handleInputChange = (index, value) => {
        if (!/^\d*$/.test(value)) return
        
        const newPin = [...pin]
        newPin[index] = value.slice(-1)
        setPin(newPin)
        
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const validateForm = () => {
        const newErrors = {}
        const pinString = pin.join('');
        if (pinString.length !== 6) {
            newErrors.pin = 'Please enter all 6 digits'
        }
        return newErrors
    }

    const handleSubmit = async (e) => { 
        e.preventDefault() 
        const newErrors = validateForm()
        if (Object.keys(newErrors).length === 0) {
            const pinString = pin.join('');
            const email = sessionStorage.getItem('resetEmail');
                                    
            try {
                await verifyPin(email, pinString);
                sessionStorage.setItem('resetPin', pinString);
                setIsSuccess(true);
                navigate('/change-password');
            } catch (error) {
                setErrors({ pin: error.message });
                // refresh pin form
                setPin(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } else {
            setErrors(newErrors)
        }
    }

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
                        <div className="text-center mb-8">
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
                                <Mail className="w-8 h-8 text-white" />
                            </motion.div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Verification Code</h1>
                            <p className="text-gray-300 text-sm sm:text-base">Please enter your verification code.</p>            
                            <p className="text-gray-300 text-xs sm:text-sm">We sent a 6-digit code to your email.</p>
                        </div>
                    </motion.div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {pin.map((digit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}>
                                    <motion.input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        ref={el => inputRefs.current[index] = el}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        value={digit}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-semibold border rounded-lg 
                                        bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                        transition-all duration-300 ${errors.pin ? 'border-red-500' : 'border-gray-300'} 
                                        ${digit ? 'bg-blue-600 border-blue-500 shadow-lg' : ''}`}
                                        transition={{ duration: 0.2 }}/>
                                </motion.div>
                            ))}
                        </div>
                        {errors.pin && <p className="text-red-500 text-sm text-center">{errors.pin}</p>}
                        
                        <div className="text-center">
                            <p className="text-gray-300 text-xs sm:text-sm">
                                Didn't receive the code? 
                                <a href="#" className="text-blue-500 hover:underline ml-1"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    const email = sessionStorage.getItem('resetEmail');
                                    if (email) {
                                        try {
                                            await forgotPassword(email);
                                        } catch (error) {
                                            setErrors({ pin: 'Failed to resend code. Please try again.' });
                                        }
                                    }
                                }}>
                                Resend
                                </a>
                            </p>
                        </div>

                        <motion.div className="mb-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}>
                        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 
                        rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 
                        transform hover:scale-[1.02] cursor-pointer text-sm sm:text-base">
                            Done
                        </button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
          
        </div>
    )
}