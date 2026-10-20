
export default function ChatIntro({ onStart }) {

    const particles = [
        { top: '10%', left: '15%', size: 8, color: '#60a5fa', duration: '3s', delay: '0s' },
        { top: '10%', left: '70%', size: 6, color: '#3b82f6', duration: '4s', delay: '0.5s' },
        { top: '65%', left: '25%', size: 8, color: '#93c5fd', duration: '3.5s', delay: '1s' },
        { top: '60%', left: '10%', size: 6, color: '#60a5fa', duration: '4.5s', delay: '1.5s' },
        { top: '75%', left: '75%', size: 8, color: '#3b82f6', duration: '3.8s', delay: '2s' },
        { top: '45%', left: '90%', size: 6, color: '#93c5fd', duration: '4.2s', delay: '2.5s' }
    ];

    return (
        <div className="h-full flex flex-col items-center">
            <style>{`
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-40px); }
            }
            .float-animation {
                animation: float infinite ease-in-out;
            }
            `}</style>
            <div className="bg-gray-800 text-white text-xs font-semibold rounded-full px-4 py-1 mt-5">
                Personal AI Bot
            </div>
            <div className="relative mt-8 left-3">
                {particles.map((p, i) => (
                    <div key={i} className="absolute rounded-full opacity-60 float-animation -z-10"
                        style={{
                            top: p.top,
                            left: p.left,
                            right: p.right,
                            bottom: p.bottom,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            backgroundColor: p.color,
                            animationDuration: p.duration,
                            animationDelay: p.delay
                        }} />
                ))}
                <img src="/images/robot.png" alt="AI Bot" className="relative z-10 h-74 drop-shadow-2xl" />
            </div>
            <div className="mt-5">
                <p className="text-gray-300 font-medium mb-3">How may I help you today!</p>
                <button onClick={onStart} className="bg-blue-500 text-white text-sm font-semibold rounded-lg w-full py-2
                hover:bg-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer">
                    Get Started
                </button>
            </div>
        </div>
    )
}
