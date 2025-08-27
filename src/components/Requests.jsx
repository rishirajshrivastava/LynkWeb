import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestsSlice";
import { Check, X } from "lucide-react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const handleRequestReview = (fromUserId, status) => async () => {
    const response = await axios.post(
      `${BASE_URL}/request/review/${status}/${fromUserId}`,
        {},
        { withCredentials: true }
    );
    dispatch(removeRequest(fromUserId));
  };

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
    return (
      <div className="pt-24 flex justify-center items-center h-[75vh]">
        <h1 className="text-2xl font-bold text-center">No Pending Requests</h1>
      </div>
    );
  }

  return (
    <div className="pt-24 flex justify-center">
      {/* Parent container */}
      <div className="w-[80%] h-[70vh] bg-base-300 rounded-2xl shadow-xl border border-base-200 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Pending Requests</h1>

        {/* Cards stacked vertically */}
        <div className="flex flex-col gap-6">
          {requests.map((request) => (
            <div
              key={request.fromUserId._id}
              className="w-full bg-base-200 rounded-xl shadow-md border border-white border-base-300 flex flex-row overflow-hidden"
            >
              {/* Profile photo */}
              <div className="w-1/3 h-48 flex items-center justify-center">
                    {request.fromUserId.photoUrl ? (
                        <img
                        src={request.fromUserId.photoUrl}
                        alt={`${request.fromUserId.firstName} ${request.fromUserId.lastName}`}
                        className="max-h-full max-w-full object-contain rounded-lg"
                        />
                    ) : (
                        <span className="text-sm text-base-content/50">
                        No photo available
                        </span>
                    )}
                </div>

              {/* Details + Buttons */}
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-base-content">
                    {request.fromUserId.firstName} {request.fromUserId.lastName}
                    {request.fromUserId.age && (
                      <span className="ml-2 text-sm font-medium text-base-content/70">
                        {request.fromUserId.age}
                      </span>
                    )}
                  </h2>
                  {request.fromUserId.gender && (
                    <p className="text-sm text-base-content/70 mt-1">
                      {request.fromUserId.gender}
                    </p>
                  )}

                  {request.fromUserId.about && (
                    <p className="mt-2 text-sm text-base-content/80 line-clamp-3">
                      {request.fromUserId.about}
                    </p>
                  )}

                  {request.fromUserId.skills &&
                    request.fromUserId.skills.length > 0 && (
                      <div className="mt-3">
                        <h3 className="text-xs font-semibold text-base-content">
                          Skills
                        </h3>
                        <div className="flex flex-wrap mt-1 gap-2">
                          {request.fromUserId.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3 justify-end">
                  <button
                    onClick={handleRequestReview(
                      request._id,
                      "accepted"
                    )}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/80 text-white text-sm font-medium shadow-sm hover:bg-green-500 hover:ring-2 hover:ring-green-400 transition-all duration-200"
                  >
                    <Check size={16} /> Accept
                  </button>
                  <button
                    onClick={handleRequestReview(
                      request._id,
                      "rejected"
                    )}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/80 text-white text-sm font-medium shadow-sm hover:bg-red-500 hover:ring-2 hover:ring-red-400 transition-all duration-200"
                  >
                    <X size={16} /> Reject
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
