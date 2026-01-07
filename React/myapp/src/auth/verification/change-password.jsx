import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2, Key } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line
import { changePassword } from '../../services/api'

// Password strength indicator
const PasswordStrengthIndicator = ({ password }) => {
    const getStrength = (pwd) => {
        let strength = 0
        if (pwd.length >= 6) strength++
        if (/[A-Z]/.test(pwd)) strength++
        if (/[0-9]/.test(pwd)) strength++
        if (/[^A-Za-z0-9]/.test(pwd)) strength++
        return strength
    }

    const strength = getStrength(password)
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
    const labels = ['Weak', 'Fair', 'Good', 'Strong']

    return (
        <div className="mt-2">
            <div className="flex space-x-1 mb-1">
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                            i < strength ? colors[strength - 1] : 'bg-gray-600'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: i < strength ? 1 : 0 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                    />
                ))}
            </div>
            {password && (
                <motion.p 
                    className={`text-xs ${
                        strength === 4 ? 'text-green-400' : 
                        strength === 3 ? 'text-yellow-400' : 
                        strength === 2 ? 'text-orange-400' : 'text-red-400'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}>
                    {labels[strength - 1] || 'Too weak'}
                </motion.p>
            )}
        </div>
    )
}

// Animated key illustration
const AnimatedKeyIllustration = () => {
    return (
        <div className="flex justify-center mb-6">
            <motion.div 
                className="relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
                <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center"
                    animate={{ 
                        boxShadow: [
                            "0 0 0 0 rgba(34, 197, 94, 0.7)",
                            "0 0 0 20px rgba(34, 197, 94, 0)",
                            "0 0 0 0 rgba(34, 197, 94, 0)"
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    <Key className="w-10 h-10 text-white" />
                </motion.div>
                
                {/* Success checkmarks floating around */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-4 h-4 text-green-400"
                        style={{
                            top: `${10 + Math.sin(i * Math.PI * 2 / 3) * 25}px`,
                            left: `${10 + Math.cos(i * Math.PI * 2 / 3) * 25}px`
                        }}
                        animate={{
                            y: [-5, 5, -5],
                            opacity: [0.5, 1, 0.5],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 3,
                            delay: i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}>
                        <CheckCircle2 className="w-4 h-4" />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default function ChangePassword() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e) => {
        const {name , value} = e.target
        setFormData(prev => ({...prev, [name] : value}));
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        return newErrors
    }

    const handleSubmit = async (e) => { 
        e.preventDefault() 
        const newErrors = validateForm()
        if (Object.keys(newErrors).length === 0) {
            const email = sessionStorage.getItem('resetEmail')
            const pin = sessionStorage.getItem('resetPin')
            
            if (!email || !pin) {
                setErrors({ password: 'Session expired. Please start the password reset process again.' })
                return
            }
            
            setIsLoading(true)
            try {
                await changePassword(email, pin, formData.password)
                sessionStorage.removeItem('resetEmail')
                sessionStorage.removeItem('resetPin')
                navigate('/')
            } catch (error) {
                setErrors({ password: error?.message || 'Failed to change password. Please try again.' })
            } finally {
                setIsLoading(false)
            }
        } else {
            setErrors(newErrors)
        }
    }

    const formFields = [
        { name: 'password', type: showPassword ? 'text' : 'password', label: 'Password', placeholder: 'Enter your password',
            icon: Lock, hasToggle: true },
        { name: 'confirmPassword', type: showConfirmPassword ? 'text' : 'password', label: 'Confirm Password', placeholder: 'Confirm your password',
            icon: Lock, hasToggle: true}
    ]

    const handleClickToggle = (fieldName) => {
        if (fieldName === 'password') {
            setShowPassword(!showPassword)
        } else if (fieldName === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword)
        }
    }

    return (
        <div className='min-h-screen md:h-screen flex items-center justify-center p-6 bg-gray-800 relative overflow-hidden'>
            {/* Animated background pattern */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-green-400 rounded-full opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 0.3, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            delay: Math.random() * 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
            
            <motion.div 
            className="flex justify-center items-center relative z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}>
                <div className="bg-gray-700/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl w-full max-w-lg h-full border border-gray-600 relative overflow-hidden">
                    <AnimatedKeyIllustration />
                    <motion.div className="text-center mb-8"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Create New Password</h1>
                            <p className="text-gray-300">Your new password must be different from previous passwords</p>            
                        </div>
                    </motion.div>
                    
                    <form onSubmit={handleSubmit} className="space-y-1">
                        {formFields.map((field, index) => {
                            const Icon = field.icon;
                            return (
                            <motion.div 
                                key={field.name}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
                                <div className="relative group">
                                    <motion.div
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                        whileHover={{ scale: 1.1, color: '#10B981' }}
                                        transition={{ duration: 0.2 }}>
                                        <Icon className="w-5 h-5" />
                                    </motion.div>
                                    <motion.input 
                                    type={field.type} 
                                    name={field.name}
                                    value={formData[field.name] }
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 ${ field.hasToggle ? 'pr-12' : 'pr-4' } py-2 border rounded-lg bg-gray-600 text-white
                                    placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                                        errors[field.name] ? 'border-red-500' : 'border-gray-500'
                                    } group-hover:border-green-400`}
                                    placeholder={field.placeholder}
                                    whileFocus={{ scale: 1.01 }}/>

                                    {field.hasToggle && (
                                        <motion.button
                                            type="button"
                                            onClick={() => handleClickToggle(field.name)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400
                                            hover:text-gray-200 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}>
                                            {(field.name === 'password' ? showPassword : showConfirmPassword) ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </motion.button>
                                    )}
                                </div>
                                
                                {field.name === 'password' && <PasswordStrengthIndicator password={formData.password} />}
                                
                                <div className="h-4">
                                    <AnimatePresence>
                                        {errors[field.name] && (
                                            <motion.p 
                                                className='text-red-400 text-xs'
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}>
                                                {errors[field.name]}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )})}

                        <motion.button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 
                            focus:ring-4 focus:ring-green-200 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer mt-4 relative overflow-hidden ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                            <motion.div
                                className="absolute inset-0 bg-white/20"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.6 }}/>
                            <span className="relative z-10">{isLoading ? 'Updating...' : 'Update Password'}</span>
                        </motion.button> 
                    </form>
                </div>
            </motion.div>
        </div>
    )
}