import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

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
    return (
      <div className="pt-24 flex justify-center items-center h-[75vh]">
        <h1 className="text-2xl font-bold text-center">No Connections Found</h1>
      </div>
    );
  }

  return (
    <div className="pt-24 flex justify-center">
      {/* Parent container */}
      <div className="w-[80%] h-[75vh] bg-base-300 rounded-2xl shadow-xl border border-base-200 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-center mb-6">My Connections</h1>

        {/* Responsive grid of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {connections.map((connection) => (
            <div
              key={connection._id}
              className="bg-base-200 rounded-xl shadow-md overflow-hidden border border-white border-base-300 flex flex-col"
            >
              {/* Profile photo */}
              <div className="w-full h-48 bg-base-300 flex items-center justify-center">
                {connection.photoUrl ? (
                  <img
                    src={connection.photoUrl}
                    alt={`${connection.firstName} ${connection.lastName}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-base-content/50">
                    No photo available
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-base-content">
                  {connection.firstName} {connection.lastName}
                  {connection.age && (
                    <span className="ml-2 text-sm font-medium text-base-content/70">
                      {connection.age}
                    </span>
                  )}
                </h2>
                {connection.gender && (
                  <p className="text-sm text-base-content/70 mt-1">
                    {connection.gender}
                  </p>
                )}

                {connection.about && (
                  <p className="mt-2 text-sm text-base-content/80 line-clamp-3">
                    {connection.about}
                  </p>
                )}

                {connection.skills && connection.skills.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-xs font-semibold text-base-content">
                      Skills
                    </h3>
                    <div className="flex flex-wrap mt-1 gap-2">
                      {connection.skills.map((skill, idx) => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
