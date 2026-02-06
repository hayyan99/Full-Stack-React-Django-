import { useState } from 'react';
import  { MessagesSquare } from 'lucide-react';
import ChatWindow from './chatwindow';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => {
        setIsOpen(!isOpen);
    };  

    return (
        <>
            {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
            <div className="fixed bottom-6 right-6 w-13 h-13 rounded-full bg-gray-900 border-2 border-gray-700 shadow-2xl 
            hover:scale-105 hover:shadow-purple-500/50 active:scale-95 transition-all duration-300" 
            onClick={handleClick}>
                <div className="flex items-center justify-center h-full text-white cursor-pointer">
                    <MessagesSquare alt="ChatBot" width={17} height={17} />
                </div>
            </div>
        </>
    );
}
