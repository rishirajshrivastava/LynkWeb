import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestsSlice";
import { Check, X, CheckCircle, XCircle, Eye } from "lucide-react";
import NoRequests from "./NoRequests";
import { addConnection } from "../utils/connectionSlice";
import RequestProfileView from "./RequestProfileView";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [photoIndices, setPhotoIndices] = useState({});
  const [currentRequestIndex, setCurrentRequestIndex] = useState(0);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/requests/recieved`, {
        withCredentials: true,
      });
      dispatch(addRequests(response.data.data));
    } catch (error) {
      console.log("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

    if (requests.length === 0) {
    return <NoRequests />;
  }

  // Sort requests by creation date (most recent first)
  const sortedRequests = Array.isArray(requests) ? [...requests].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.updatedAt || 0);
    const dateB = new Date(b.createdAt || b.updatedAt || 0);
    return dateB - dateA;
  }) : [];

  const handleRequestReview = (request, status) => {
    return async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/request/review/${status}/${request._id}`,
            {},
            { withCredentials: true }
        );
        
        // Get the current index of the request being processed
        const currentIndex = sortedRequests.findIndex(r => r._id === request._id);
        
        // Remove the request from the requests list
        dispatch(removeRequest(request._id));
        
        // If accepted, add the new connection to the connections list
        if (status === "accepted") {
          // Create new connection from the request data since API response doesn't contain user info
          const newConnection = {
            _id: request.fromUserId._id,
            firstName: request.fromUserId.firstName,
            lastName: request.fromUserId.lastName,
            age: request.fromUserId.age,
            gender: request.fromUserId.gender,
            photoUrl: request.fromUserId.photoUrl,
            about: request.fromUserId.about,
            skills: request.fromUserId.skills,
            createdAt: new Date().toISOString(),
            _isNew: true
          };
          dispatch(addConnection(newConnection));
        }

        // Auto-scroll to the next request after a short delay
        setTimeout(() => {
          const updatedRequests = sortedRequests.filter(r => r._id !== request._id);
          const nextIndex = currentIndex;
          if (nextIndex < updatedRequests.length) {
            const nextRequestElement = document.querySelector(`[data-request-id="${updatedRequests[nextIndex]._id}"]`);
            if (nextRequestElement) {
              nextRequestElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
            }
          }
        }, 100);
      } catch (error) {
        console.error("Error reviewing request:", error);
      }
    };
  };

  const handleViewProfile = (request) => {
    const requestIndex = sortedRequests.findIndex(r => r._id === request._id);
    setCurrentRequestIndex(requestIndex);
    setViewingProfile(request);
  };

  const handleBackToRequests = () => {
    setViewingProfile(null);
    
    // Scroll to the next request after a short delay to ensure DOM is updated
    setTimeout(() => {
      const nextIndex = currentRequestIndex;
      if (nextIndex < sortedRequests.length) {
        const nextRequestElement = document.querySelector(`[data-request-id="${sortedRequests[nextIndex]._id}"]`);
        if (nextRequestElement) {
          nextRequestElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
    }, 100);
  };

  const handlePreviousPhoto = (requestId) => {
    setPhotoIndices(prev => {
      const currentIndex = prev[requestId] || 0;
      const request = requests.find(r => r._id === requestId);
      if (!request || !request.fromUserId.photoUrl) return prev;
      
      const newIndex = currentIndex === 0 ? request.fromUserId.photoUrl.length - 1 : currentIndex - 1;
      return { ...prev, [requestId]: newIndex };
    });
  };

  const handleNextPhoto = (requestId) => {
    setPhotoIndices(prev => {
      const currentIndex = prev[requestId] || 0;
      const request = requests.find(r => r._id === requestId);
      if (!request || !request.fromUserId.photoUrl) return prev;
      
      const newIndex = currentIndex === request.fromUserId.photoUrl.length - 1 ? 0 : currentIndex + 1;
      return { ...prev, [requestId]: newIndex };
    });
  };

  // Bulk action functions
  const handleBulkAction = (action) => {
    if (!sortedRequests || sortedRequests.length === 0) return;
    
    setPendingAction(action);
    setShowConfirmDialog(true);
  };

  const confirmBulkAction = async () => {
    if (!pendingAction || !sortedRequests || sortedRequests.length === 0) return;
    
    setIsProcessing(true);
    setBulkAction(pendingAction);
    setShowConfirmDialog(false);
    
    try {
      const promises = sortedRequests.map(async (request) => {
        try {
          // For accept/reject all
          await axios.post(
            `${BASE_URL}/request/review/${pendingAction === "acceptAll" ? "accepted" : "rejected"}/${request._id}`,
            {},
            { withCredentials: true }
          );
          
          // Remove the request from the requests list
          dispatch(removeRequest(request._id));
          
          // If accepted, add the new connection to the connections list
          if (pendingAction === "acceptAll") {
            const newConnection = {
              _id: request.fromUserId._id,
              firstName: request.fromUserId.firstName,
              lastName: request.fromUserId.lastName,
              age: request.fromUserId.age,
              gender: request.fromUserId.gender,
              photoUrl: request.fromUserId.photoUrl,
              about: request.fromUserId.about,
              skills: request.fromUserId.skills,
              createdAt: new Date().toISOString(),
              _isNew: true
            };
            dispatch(addConnection(newConnection));
          }
        } catch (error) {
          console.error(`Error processing ${pendingAction} for request ${request._id}:`, error);
        }
      });
      
      await Promise.all(promises);
      
      // Dispatch custom event to notify Navbar about notification updates
      window.dispatchEvent(new CustomEvent('notificationUpdated'));
      
    } catch (error) {
      console.error(`Error in bulk ${pendingAction}:`, error);
    } finally {
      setIsProcessing(false);
      setBulkAction(null);
      setPendingAction(null);
    }
  };

  // If viewing a profile, show the profile view
  if (viewingProfile) {
    return (
      <RequestProfileView 
        request={viewingProfile}
        onBack={handleBackToRequests}
        onAccept={handleRequestReview(viewingProfile, "accepted")}
        onReject={handleRequestReview(viewingProfile, "rejected")}
      />
    );
  }

  return (
    <div className="pt-24 pb-28 px-4 flex justify-center">
      {/* Parent container - More compact */}
      <div className="w-full max-w-5xl bg-base-300 rounded-2xl shadow-lg border border-base-200">
        {/* Sticky Header with title and bulk actions */}
        <div className="sticky top-16 z-10 bg-base-300 rounded-2xl shadow-lg border border-base-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-lg sm:text-xl font-bold text-base-content">Pending Requests</h1>
            <p className="text-sm text-base-content/70 mt-1">
              {sortedRequests.length} request{sortedRequests.length !== 1 ? 's' : ''} pending review
            </p>
          </div>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-base-100 rounded-xl shadow-2xl p-6 text-center max-w-sm mx-4">
              <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
              <h3 className="text-lg font-semibold text-base-content mb-2">
                {bulkAction === "markAllRead" && "Marking all as read..."}
                {bulkAction === "acceptAll" && "Accepting all requests..."}
                {bulkAction === "rejectAll" && "Rejecting all requests..."}
              </h3>
              <p className="text-sm text-base-content/70">
                Please wait while we process your request...
              </p>
            </div>
          </div>
        )}

        {/* Cards stacked vertically - No scroll, compact spacing */}
        <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6">
          {sortedRequests.map((request) => (
            <div
              key={request._id}
              data-request-id={request._id}
              className="w-full bg-base-200 rounded-xl shadow-md border border-base-300 flex flex-col sm:flex-row overflow-hidden"
            >
              {/* Profile photos - More compact with navigation */}
              <div className="w-full sm:w-1/4 h-32 sm:h-36 flex items-center justify-center bg-base-300 relative">
                {request.fromUserId.photoUrl && request.fromUserId.photoUrl.length > 0 ? (
                  <div className="relative w-full h-full">
                    <img
                      src={request.fromUserId.photoUrl[photoIndices[request._id] || 0]}
                      alt={`${request.fromUserId.firstName} ${request.fromUserId.lastName}`}
                      className="w-full h-full object-cover rounded-lg"
                      style={{ objectPosition: 'center' }}
                    />
                    
                    {/* Photo Navigation Controls */}
                    {request.fromUserId.photoUrl.length > 1 && (
                      <>
                        <button
                          onClick={() => handlePreviousPhoto(request._id)}
                          className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors z-10"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleNextPhoto(request._id)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors z-10"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Photo Counter */}
                        <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                          {(photoIndices[request._id] || 0) + 1}/{request.fromUserId.photoUrl.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-base-content/50">
                    No photo
                  </span>
                )}
              </div>

              {/* Details + Buttons - More compact */}
              <div className="w-full sm:w-3/4 p-3 sm:p-4 flex flex-col justify-between">
                                 <div>
                   <h2 className="text-sm sm:text-base font-semibold text-base-content">
                     {request.fromUserId.firstName} {request.fromUserId.lastName}
                     {request.fromUserId.age && (
                       <span className="ml-2 text-xs font-medium text-base-content/70">
                         {request.fromUserId.age}
                       </span>
                     )}
                   </h2>
                   {request.fromUserId.gender && (
                     <p className="text-xs text-base-content/70 mt-0.5 mb-3">
                       {request.fromUserId.gender}
                     </p>
                   )}

                   {request.fromUserId.about && (
                     <div className="mb-4">
                       <h3 className="text-xs font-medium text-success mb-1">
                         About
                       </h3>
                       <p className="text-xs text-base-content/80 break-words whitespace-pre-wrap min-h-0 leading-relaxed">
                         {request.fromUserId.about}
                       </p>
                     </div>
                   )}

                   {request.fromUserId.skills &&
                     request.fromUserId.skills.length > 0 && (
                       <div className="mt-4">
                         <h3 className="text-xs font-medium text-info mb-2">
                           Skills
                         </h3>
                         <div className="flex flex-wrap gap-1.5">
                           {request.fromUserId.skills.map((skill, idx) => (
                             <span
                               key={idx}
                               className="px-2 py-1 bg-base-300 text-base-content/80 text-xs rounded-md"
                             >
                               {skill}
                             </span>
                           ))}
                         </div>
                       </div>
                     )}
                 </div>

                                 {/* Action Buttons - More compact */}
                 <div className="mt-3 flex gap-2 justify-end">
                   <button
                     onClick={() => handleViewProfile(request)}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/80 text-white text-xs font-medium shadow-sm hover:bg-blue-500 hover:ring-2 hover:ring-blue-400 transition-all duration-200"
                   >
                     <Eye size={14} /> View Profile
                   </button>
                   <button
                     onClick={handleRequestReview(request, "accepted")}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600/80 text-white text-xs font-medium shadow-sm hover:bg-green-500 hover:ring-2 hover:ring-green-400 transition-all duration-200"
                   >
                     <Check size={14} /> Accept
                   </button>
                   <button
                     onClick={handleRequestReview(request, "rejected")}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/80 text-white text-xs font-medium shadow-sm hover:bg-red-500 hover:ring-2 hover:ring-red-400 transition-all duration-200"
                   >
                     <X size={14} /> Reject
                   </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className={`p-4 text-center ${
              pendingAction === "acceptAll" ? "bg-success/10" :
              "bg-error/10"
            }`}>
              <div className="text-3xl mb-2">
                {pendingAction === "acceptAll" && "✅"}
                {pendingAction === "rejectAll" && "❌"}
              </div>
              <h3 className="text-lg font-bold text-base-content">
                {pendingAction === "acceptAll" && "Accept All Requests"}
                {pendingAction === "rejectAll" && "Reject All Requests"}
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <p className="text-base-content/80 text-sm mb-4">
                {pendingAction === "acceptAll" && `Are you sure you want to accept all ${sortedRequests.length} pending requests? This action cannot be undone.`}
                {pendingAction === "rejectAll" && `Are you sure you want to reject all ${sortedRequests.length} pending requests? This action cannot be undone.`}
              </p>
              
              <div className="bg-base-200/50 rounded-lg p-3 border border-base-300/30 mb-6">
                <p className="text-xs text-base-content/70">
                  {pendingAction === "acceptAll" && "All accepted requests will be added to your connections."}
                  {pendingAction === "rejectAll" && "All rejected requests will be removed from your pending list."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="btn btn-outline btn-sm flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkAction}
                  className={`btn btn-sm flex-1 ${
                    pendingAction === "acceptAll" ? "bg-green-500/80 hover:bg-green-500 text-white border-green-500" :
                    "bg-red-500/80 hover:bg-red-500 text-white border-red-500"
                  }`}
                >
                  {pendingAction === "acceptAll" && "Accept All"}
                  {pendingAction === "rejectAll" && "Reject All"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
