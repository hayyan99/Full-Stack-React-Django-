import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line
import { userRegister } from '../services/api'

export default function SignUp() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isSuccess, setIsSuccess] = useState(false)

    const handleInputChange = (e) => {
        const {name , value} = e.target
        setFormData(prev => ({...prev, [name] : value}));
    }

    const validateForm = () => {
        const newErrors = {}
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const phoneRegex = /^\+?[1-9]\d{1,14}$/
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email address format'
        }

        if(!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required'
        } else if(!phoneRegex.test(formData.phone)){
            newErrors.phone = 'Invalid phone number format'
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must contain at least 6 characters, including uppercase, lowercase, numbers, and special characters'
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
            try{
                await userRegister({
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                })
                setIsSuccess(true)
                setTimeout(() => navigate('/login'), 2000)
            }
            catch (error) {
                setErrors({ submit: error?.message || 'Registration failed' })
            }
        } else {
            setErrors(newErrors)
        }
    }

    const formFields = [
        { name: 'username', type: 'text', label: 'Username', placeholder: 'Enter your username', icon: User },
        { name: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email', icon: Mail },
        { name: 'phone', type: 'tel', label: 'Phone Number', placeholder: 'Enter your phone number', icon: Phone },
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
        <div className='min-h-screen md:h-screen flex items-center justify-center p-6 bg-gray-800'>
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
                className="bg-gray-700 rounded-2xl shadow-xl w-full max-w-6xl min-h-[600px] md:h-[700px] border border-gray-600 grid md:grid-cols-2 overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}>
                    
                {/* Left side - Image */}
                <motion.div 
                    className='relative bg-gray-900 flex flex-col justify-center items-center p-8 text-white'
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}>
                    <motion.img 
                        src="/images/signup.png" 
                        alt="Sign Up" 
                        className="w-full max-w-full object-contain rounded-3xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}/>
                    <motion.div 
                        className="bottom-10 text-center px-4 mt-17"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}>
                        <h2 className="text-3xl font-bold mb-2 text-white">Welcome to Join Us!</h2>
                        <p className="text-gray-300">Create an account to get started with our services.</p>
                    </motion.div>
                </motion.div>

                {/* Right side - Form */}
                <motion.div 
                    className='flex items-start justify-center p-8 overflow-y-auto'
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}>
                    <div className="w-full max-w-md py-4">
                        <motion.div 
                            className="text-center mb-4"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}>
                            <h1 className="text-2xl font-bold text-white mb-2">Sign Up</h1>
                            <p className="text-gray-300 text-sm">Let's get started with your 30 days free trial</p>
                        </motion.div>
                        
                        <form onSubmit={handleSubmit} noValidate className="space-y-1">
                            {formFields.map((field, index) => {
                                const Icon = field.icon;
                                return (
                                <motion.div 
                                    key={field.name}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
                                    <div className="relative">
                                        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input 
                                        type={field.type} 
                                        name={field.name}
                                        value={formData[field.name] }
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 ${ field.hasToggle ? 'pr-12' : 'pr-4' } py-2 border rounded-lg bg-gray-600 text-white
                                        placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                            errors[field.name] ? 'border-red-500' : 'border-gray-500'
                                        }`}
                                        placeholder={field.placeholder}/>

                                        {field.hasToggle && (
                                            <button
                                                type="button"
                                                onClick={() => handleClickToggle(field.name)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400
                                                hover:text-gray-200 transition-colors">
                                                {(field.name === 'password' ? showPassword : showConfirmPassword) ? 
                                                <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        )}
                                    </div>
                                    <div className="h-4">
                                        {errors[field.name] && <p className="text-red-400 text-[0.55rem]">{errors[field.name]}</p>}
                                    </div>
                                </motion.div>
                            )})}

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
                                className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 
                                focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer mt-4"
                                initial={{ y: 0, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}>
                                Sign Up
                            </motion.button> 
                        </form>

                        <motion.div 
                            className="mt-3 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.5 }}>
                            <p className="text-gray-300 text-sm">
                                <span>Already have an account?</span>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer ml-1">
                                    Sign in 
                                </button>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}