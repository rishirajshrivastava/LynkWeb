import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import NoConnections from "./NoConnections";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnections(response.data.data));
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return <NoConnections />;
  }

  return (
    <div className="pt-16 pb-20 px-4 flex justify-center">
      {/* Parent container */}
      <div className="w-full max-w-6xl bg-base-300 rounded-2xl shadow-xl border border-base-200 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">My Connections</h1>

        {/* Responsive grid of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {connections.map((connection) => (
            <div
              key={connection._id}
              className="bg-base-200 rounded-xl shadow-md overflow-hidden border border-white border-base-300 flex flex-col h-full"
            >
              {/* Profile photo */}
              <div className="w-full h-40 sm:h-48 bg-base-300 flex items-center justify-center">
                {connection.photoUrl ? (
                  <img
                    src={connection.photoUrl}
                    alt={`${connection.firstName} ${connection.lastName}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-primary/20 flex items-center justify-center ${connection.photoUrl ? 'hidden' : 'flex'}`}>
                  <span className="text-primary font-semibold text-2xl">
                    {connection.firstName ? connection.firstName.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 flex-1 flex flex-col">
                <h2 
                  className="text-base sm:text-lg font-semibold text-base-content break-words leading-tight"
                  title={`${connection.firstName} ${connection.lastName}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate flex-1">
                      {connection.firstName} {connection.lastName}
                    </span>
                    {connection.age && (
                      <span className="text-xs sm:text-sm font-medium text-base-content/70 flex-shrink-0">
                        {connection.age}
                      </span>
                    )}
                  </div>
                </h2>
                {connection.gender && (
                  <p className="text-xs sm:text-sm text-base-content/70 mt-1">
                    {connection.gender}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
