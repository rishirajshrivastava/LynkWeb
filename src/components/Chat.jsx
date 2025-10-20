import React, { useEffect, useState, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { MoreVertical, UserX, Flag, AlertTriangle } from 'lucide-react'

const Chat = () => {
  const { TargetUserId: targetUserId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(store => store?.user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // ✅ store all chat messages
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
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

  // Handle menu actions
  const handleMenuAction = (action) => {
    setPendingAction(action);
    setShowConfirmDialog(true);
    setShowMenu(false);
    if (action === 'report') {
      setReportReason("");
      setReportDetails("");
      setActionError(null);
    }
  };

  const confirmAction = async () => {
    if (!pendingAction || !targetUserId) return;

    setIsProcessing(true);
    setActionError(null);

    try {
      if (pendingAction === 'block') {
        // API call to block user
        const response = await axios.post(`${BASE_URL}/request/block/${targetUserId}`, {}, { withCredentials: true });
        
        if (response.data.message === "User blocked successfully") {
          // Show success message and redirect to connections
          console.log('User blocked successfully');
          setShowConfirmDialog(false);
          setPendingAction(null);
          navigate('/connections');
        }
      } else if (pendingAction === 'report') {
        // Validate input on client side
        const normalized = (reportReason || '').toLowerCase();
        const isOther = normalized === 'other';
        const isValid = (!!reportReason && (!isOther || (isOther && reportDetails.trim().length > 0)));
        if (!isValid) {
          setActionError('Please select a reason or provide details for reporting.');
          return;
        }
        const payload = { reason: reportReason, details: reportDetails };
        const response = await axios.post(`${BASE_URL}/user/report/${targetUserId}`, payload, { withCredentials: true });
        if (response?.data?.message === 'User reported successfully') {
          console.log('User reported successfully', { reason: reportReason, details: reportDetails });
          setShowConfirmDialog(false);
          setPendingAction(null);
          navigate('/connections');
        } else {
          setActionError(response?.data?.message || 'Unable to report user. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error performing action:', error);
      
      // Set error state for UI display (use API message when available)
      const apiMsg = error?.response?.data?.message || error?.message;
      if (pendingAction === 'block') {
        setActionError('Something went wrong. Please try again later.');
      } else if (pendingAction === 'report') {
        setActionError('Something went wrong. Please try again later.');
      } else {
        setActionError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.chat-menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

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
        <div className="bg-base-100 border-b border-base-300 px-4 py-3 flex items-center gap-3 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3 flex-1">
            {/* User Photo */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-primary text-primary-content font-semibold text-sm shadow-md">
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
            
            {/* User Info */}
            <div className="flex-1">
              <h2 className="font-semibold text-base-content text-base">
                {targetUser ? getUserDisplayInfo(targetUser).fullName : "Chat"}
              </h2>
            </div>
          </div>

          {/* Menu Button */}
          <div className="chat-menu-container relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-base-200 transition-colors duration-200"
              aria-label="More options"
            >
              <MoreVertical size={20} className="text-base-content/70" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-base-100 rounded-xl shadow-xl border border-base-300 py-2 z-50">
                <button
                  onClick={() => handleMenuAction('block')}
                  className="w-full px-4 py-3 text-left hover:bg-base-200 transition-colors duration-200 flex items-center gap-3 text-red-600"
                >
                  <UserX size={16} />
                  <span className="text-sm font-medium">Block</span>
                </button>
                <button
                  onClick={() => handleMenuAction('report')}
                  className="w-full px-4 py-3 text-left hover:bg-base-200 transition-colors duration-200 flex items-center gap-3 text-orange-600"
                >
                  <Flag size={16} />
                  <span className="text-sm font-medium">Report User</span>
                </button>
              </div>
            )}
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

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 pointer-events-auto p-2 sm:p-4">
          <div className="bg-base-200 text-base-content rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm p-3 sm:p-5 text-center animate-fade-in">
            <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">
              {pendingAction === 'block' ? 'Confirm Block' : 'Confirm Report'}
            </h2>
            <p className="text-xs sm:text-sm opacity-80 mb-3 sm:mb-4">
              {pendingAction === 'block' 
                ? 'Are you sure you want to block this user? This action cannot be undone.'
                : 'Please select a reason for reporting. This helps us take appropriate action.'
              }
            </p>

            {/* Report Reason Inputs */}
            {pendingAction === 'report' && (
              <div className="space-y-2 mb-3 text-left">
                <label className="block text-xs font-medium opacity-80">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-sm"
                >
                  <option value="" disabled>Select a reason</option>
                  <option value="Trying to be someone else">Trying to be someone else / impersonation</option>
                  <option value="Fake or misleading profile">Fake or misleading profile</option>
                  <option value="Harassment or abusive behavior">Harassment or abusive behavior</option>
                  <option value="Inappropriate content">Inappropriate content</option>
                  <option value="Spam or promotional activity">Spam or promotional activity</option>
                  <option value="Other">Other</option>
                </select>

                {reportReason === 'Other' && (
                  <div>
                    <label className="block text-xs font-medium opacity-80 mb-1">Please describe</label>
                    <textarea
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      rows={3}
                      placeholder="Tell us briefly why you are reporting this user..."
                      className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-sm resize-none"
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Error Message */}
            {actionError && (
              <div className="mb-3 p-2 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-xs text-error">{actionError}</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
              <button
                onClick={confirmAction}
                disabled={isProcessing || (pendingAction === 'report' && !((reportReason && reportReason !== '') && (reportReason !== 'Other' || (reportReason === 'Other' && reportDetails.trim().length > 0))))}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-white font-medium shadow-sm transition-all text-xs sm:text-sm flex items-center justify-center gap-2 ${
                  pendingAction === 'block' 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500'
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Processing...
                  </>
                ) : (
                  pendingAction === 'block' ? 'Yes, Block' : 'Yes, Report'
                )}
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setActionError(null);
                }}
                disabled={isProcessing}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-700 transition-all text-xs sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat;
