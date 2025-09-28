import React, { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';

const Chat = () => {
  const { TargetUserId: targetUserId } = useParams();
  const location = useLocation();
  const user = useSelector(store => store?.user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // ✅ store all chat messages
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Get target user info from location state
  const targetUser = location.state || null;

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  useEffect(() => {
    if (!user) return;

    const newSocket = createSocketConnection();
    setSocket(newSocket);

    newSocket.emit("joinChat", { userId: user._id, targetUserId });

    newSocket.on("messageReceived", ({ firstName, newMessage, userId }) => {
      // If userId is undefined, use targetUserId as the sender
      const senderId = userId || targetUserId;
      setMessages(prev => [...prev, { 
        firstName, 
        newMessage, 
        userId: senderId,
        timestamp: new Date()
      }]);
    });

    return () => {
      newSocket.disconnect();
    }
  }, [user, targetUserId]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    const newMsg = {
      firstName: user.firstName,
      userId: user._id,
      targetUserId,
      newMessage: message,
      timestamp: new Date()
    };

    // Emit to server
    socket.emit("sendMessage", newMsg);

    // ✅ Add message locally so it shows immediately
    setMessages(prev => [...prev, newMsg]);

    // Clear input and scroll to bottom
    setMessage('');
    setTimeout(() => scrollToBottom(), 100);
  };

  return (
    <div className="pt-16 pb-16 h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col bg-base-100 shadow-lg">

        {/* Chat Header */}
        <div className="bg-base-100 border-b border-base-300 px-4 py-2 flex items-center gap-3 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                alt={targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "User"}
                src={targetUser?.photoUrl || "https://img.daisyui.com/images/profile/demo/kenobee@192.webp"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://img.daisyui.com/images/profile/demo/kenobee@192.webp";
                }}
              />
            </div>
            <div>
              <h2 className="font-semibold text-base-content text-base">
                {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "Chat"}
              </h2>
            </div>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-base-200 p-3 min-h-0">
          <div className="space-y-2">
            {messages.map((msg, idx) => {
              const isCurrentUser = msg.userId === user._id;
              const imageUrl = isCurrentUser
                ? (user?.photoUrl || "https://img.daisyui.com/images/profile/demo/kenobee@192.webp")
                : (targetUser?.photoUrl || "https://img.daisyui.com/images/profile/demo/others@192.webp");
              
              const formatTime = (timestamp) => {
                if (!timestamp) return '';
                const date = new Date(timestamp);
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              };

              return (
              <div
                key={idx}
                className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full">
                    <img
                      alt={msg.firstName || "User"}
                      src={imageUrl}
                      onError={(e) => {
                        e.target.src = isCurrentUser
                          ? "https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                          : "https://img.daisyui.com/images/profile/demo/others@192.webp";
                      }}
                    />
                  </div>
                </div>
                <div className="chat-bubble px-3 py-2 text-sm">
                  {msg.newMessage}
                </div>
                <div className="chat-footer opacity-50 text-xs">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input - Fixed at bottom */}
        <div className="bg-base-100 border-t border-base-300 p-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="w-full px-3 py-2 pr-10 bg-base-200 border border-base-300 rounded-full focus:outline-none text-sm text-base-content placeholder-base-content/50"
              />
            </div>
            <button
              disabled={!message.trim()}
              onClick={sendMessage}
              className={`p-2 rounded-full transition-colors duration-200 ${message.trim()
                ? 'bg-primary hover:bg-primary/80 text-primary-content'
                : 'bg-base-300 text-base-content/40'
                }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat;
