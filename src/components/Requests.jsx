import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestsSlice";
import { Check, X } from "lucide-react";
import NoRequests from "./NoRequests";
import { addConnection } from "../utils/connectionSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

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
      } catch (error) {
        console.error("Error reviewing request:", error);
      }
    };
  };

  return (
    <div className="pt-24 pb-28 px-4 flex justify-center">
      {/* Parent container - More compact */}
      <div className="w-full max-w-5xl bg-base-300 rounded-2xl shadow-lg border border-base-200 p-4 sm:p-6">
        <h1 className="text-lg sm:text-xl font-bold text-center mb-4">Pending Requests</h1>

        {/* Cards stacked vertically - No scroll, compact spacing */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {sortedRequests.map((request) => (
            <div
              key={request._id}
              className="w-full bg-base-200 rounded-xl shadow-md border border-base-300 flex flex-col sm:flex-row overflow-hidden"
            >
              {/* Profile photo - More compact */}
              <div className="w-full sm:w-1/4 h-32 sm:h-36 flex items-center justify-center bg-base-300">
                    {request.fromUserId.photoUrl ? (
                        <img
                        src={request.fromUserId.photoUrl}
                        alt={`${request.fromUserId.firstName} ${request.fromUserId.lastName}`}
                        className="w-full h-full object-cover rounded-lg"
                        style={{ objectPosition: 'center' }}
                        />
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
    </div>
  );
};

export default Requests;
