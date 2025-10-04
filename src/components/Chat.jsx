import React, { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios'
import { BASE_URL } from '../utils/constants'

const Chat = () => {
  const { TargetUserId: targetUserId } = useParams();
  const location = useLocation();
  const user = useSelector(store => store?.user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // ✅ store all chat messages
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  // Get target user info from location state
  const targetUser = location.state || null;

  // Helper function to generate name initials
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U';
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  // Helper function to get user display info
  const getUserDisplayInfo = (userData) => {
    // Handle photoUrl - it could be a string, array, or null/undefined
    let hasPhoto = false;
    let photoUrl = null;
    
    if (userData?.photoUrl) {
      if (Array.isArray(userData.photoUrl)) {
        // If it's an array, check if it has any valid photo URLs
        const validPhotos = userData.photoUrl.filter(url => 
          typeof url === 'string' && url.trim() !== ''
        );
        hasPhoto = validPhotos.length > 0;
        photoUrl = validPhotos[0]; // Use the first valid photo
      } else if (typeof userData.photoUrl === 'string' && userData.photoUrl.trim() !== '') {
        hasPhoto = true;
        photoUrl = userData.photoUrl;
      }
    }
    
    const firstName = userData?.firstName || '';
    const lastName = userData?.lastName || '';
    const initials = getInitials(firstName, lastName);
    
    return {
      hasPhoto,
      photoUrl,
      initials,
      fullName: `${firstName} ${lastName}`.trim() || 'User'
    };
  };

  // Auto-scroll to bottom function (for manual use)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setUnreadCount(0);
    setShowScrollButton(false);
  };

  // Auto-scroll without clearing unread count (for automatic scrolling)
  const scrollToBottomSilent = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  };

  // Check if user is near bottom of messages
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollButton(!isNearBottom);
      
      // Clear popup only when user manually scrolls to the very bottom
      const isAtVeryBottom = scrollHeight - scrollTop - clientHeight <= 0;
      if (isAtVeryBottom && unreadCount > 0) {
        setUnreadCount(0);
      }
    }
  };

  // Simple function to check if user is at bottom
  const isUserAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 50;
  };

  // Initial load: fetch existing chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user || !targetUserId) {
        // Keep loader visible until required data is available
        return;
      }
      try {
        setIsLoading(true);
        const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, { withCredentials: true });
        const apiMessages = res?.data?.chat?.messages || [];
        const mapped = apiMessages?.map((m) => {
          const senderId = m?.sender?._id || m?.sender || '';
          const firstName = m?.sender?.firstName || (senderId === user?._id ? user?.firstName : targetUser?.firstName) || 'User';
          const text = m?.content ?? m?.text ?? m?.message ?? '';
          const ts = m?.createdAt ? new Date(m.createdAt) : new Date();
          return { firstName, newMessage: text, userId: senderId, timestamp: ts };
        });
        setMessages(mapped);
        // Scroll after messages render
        setTimeout(() => scrollToBottomSilent(), 100);
      } catch (_err) {
        // Keep UI usable on failure
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatHistory();
  }, [user, targetUserId]);


  useEffect(() => {
    if (!user) return;

    const newSocket = createSocketConnection();
    setSocket(newSocket);

    newSocket.emit("joinChat", { userId: user._id, targetUserId });

    newSocket.on("messageReceived", ({ firstName, newMessage, userId }) => {
      // If userId is undefined, use targetUserId as the sender
      const senderId = userId || targetUserId;
      const isFromCurrentUser = senderId === user._id;
      
      setMessages(prev => [...prev, { 
        firstName, 
        newMessage, 
        userId: senderId,
        timestamp: new Date()
      }]);

      // Handle new messages from other users
      if (!isFromCurrentUser) {
        // Check if user is at bottom RIGHT NOW
        if (isUserAtBottom()) {
          // User is at bottom - auto scroll, no popup
          setTimeout(() => scrollToBottomSilent(), 100);
        } else {
          // User is not at bottom - show popup
          setUnreadCount(prev => prev + 1);
          setShowScrollButton(true);
        }
      }
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
    setTimeout(() => scrollToBottomSilent(), 100);
  };

  return (
    <div className="pt-16 pb-16 h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col bg-base-100 shadow-lg">

        {/* Chat Header */}
        <div className="bg-base-100 border-b border-base-300 px-4 py-2 flex items-center gap-3 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-primary text-primary-content font-semibold text-sm">
              {(() => {
                const targetUserInfo = getUserDisplayInfo(targetUser);
                return targetUserInfo.hasPhoto ? (
                  <img
                    alt={targetUserInfo.fullName}
                    src={targetUserInfo.photoUrl}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null;
              })()}
              <div className={`w-full h-full flex items-center justify-center ${targetUser && getUserDisplayInfo(targetUser).hasPhoto ? 'hidden' : 'flex'}`}>
                {targetUser ? getUserDisplayInfo(targetUser).initials : 'U'}
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-base-content text-base">
                {targetUser ? getUserDisplayInfo(targetUser).fullName : "Chat"}
              </h2>
            </div>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto bg-base-200 p-3 min-h-0 relative"
          onScroll={handleScroll}
        >
          {/* Loader */}
          {isLoading && (
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center gap-3 text-base-content/70">
                <span className="loading loading-spinner loading-md"></span>
                <span className="text-sm">Loading messages…</span>
              </div>
            </div>
          )}

          {/* Empty state (only after loading completes) */}
          {!isLoading && messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-base-content/70">
                <div className="mb-2 mx-auto w-10 h-10 rounded-full bg-base-100 flex items-center justify-center shadow">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"/>
                  </svg>
                </div>
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Start the conversation by sending a message.</p>
              </div>
            </div>
          )}

          {/* Messages */}
          {!isLoading && messages.length > 0 && (
            <div className="space-y-2">
              {messages.map((msg, idx) => {
                const isCurrentUser = msg.userId === user._id;
                const userData = isCurrentUser ? user : targetUser;
                const userInfo = getUserDisplayInfo(userData);
                
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
                    <div className="w-8 rounded-full overflow-hidden flex items-center justify-center bg-primary text-primary-content font-semibold text-sm">
                      {userInfo.hasPhoto ? (
                        <img
                          alt={userInfo.fullName}
                          src={userInfo.photoUrl}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${userInfo.hasPhoto ? 'hidden' : 'flex'}`}>
                        {userInfo.initials}
                      </div>
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
          )}

          {/* Unread Messages Notification */}
          {unreadCount > 0 && (
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-primary text-primary-content px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                <span className="text-sm font-medium">
                  {unreadCount} new message{unreadCount > 1 ? 's' : ''}
                </span>
                <button
                  onClick={scrollToBottom}
                  className="bg-primary-content text-primary px-2 py-1 rounded-full text-xs hover:bg-opacity-80 transition-colors"
                >
                  ↓
                </button>
              </div>
            </div>
          )}
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
