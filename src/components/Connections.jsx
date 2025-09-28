import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import NoConnections from "./NoConnections";

const Connections = () => {
  const navigate = useNavigate();
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");


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

     // Filter connections based on search
   const filteredConnections = useMemo(() => {
     // Ensure connections is an array
     if (!connections || !Array.isArray(connections)) {
       return [];
     }
     
     if (!searchQuery.trim()) {
       // Reverse the array to show most recent connections first (API returns newest first, so reverse to show newest at top)
       return [...connections].reverse();
     }
     
     const query = searchQuery.toLowerCase().trim();
     
     const filtered = connections.filter(connection => {
       // Search across all fields with improved logic
       const firstName = connection.firstName?.toLowerCase() || '';
       const lastName = connection.lastName?.toLowerCase() || '';
       const age = connection.age?.toString() || '';
       const gender = connection.gender?.toLowerCase() || '';
       
       // Check if query matches any field
       const matchesFirstName = firstName.includes(query);
       const matchesLastName = lastName.includes(query);
       const matchesAge = age.includes(query);
       const matchesFullName = `${firstName} ${lastName}`.includes(query);
       
               // For gender, use simple includes but avoid "male" matching "female" for exact matches
        const matchesGender = gender.includes(query);
       
       return matchesFirstName || matchesLastName || matchesAge || matchesGender || matchesFullName;
     });

     // Reverse filtered results to show most recent first
     return filtered.reverse();
   }, [connections, searchQuery]);

  if (!connections) return null;

  if (connections.length === 0) {
    return <NoConnections />;
  }

  return (
         <div className="pt-24 pb-20 px-4 flex justify-center">
      {/* Parent container */}
      <div className="w-full max-w-6xl bg-base-300 rounded-2xl shadow-xl border border-base-200 p-4 sm:p-6">
                 {/* Professional Header with Search */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
           <h1 className="text-xl sm:text-2xl font-bold text-base-content">My Connections</h1>
           
           {/* Search Interface - Fixed Size */}
           <div className="flex items-center gap-3">
             <div className="relative">
               <input
                 type="text"
                 placeholder="Search connections..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="input input-bordered input-sm bg-base-100 text-base-content border-base-300 focus:border-primary pl-9 pr-12 w-48 sm:w-64 lg:w-80"
               />
               <svg
                 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24"
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   strokeWidth="2"
                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                 />
               </svg>
             </div>
             
             {/* Clear Search Button - Always Visible but Transparent when empty */}
             <button
               onClick={() => setSearchQuery("")}
               className={`btn btn-ghost btn-sm transition-all duration-200 ${
                 searchQuery 
                   ? 'text-base-content/70 hover:text-base-content hover:bg-base-200 opacity-100' 
                   : 'text-transparent hover:text-transparent opacity-0 pointer-events-none'
               }`}
               title="Clear search"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
           </div>
         </div>

         {/* Search Results Info - Dynamic Height to Prevent External Scrollbar */}
         {searchQuery && (
           <div className="mb-4 flex items-center justify-center">
             <div className="text-sm text-base-content/70 text-center">
               Found {filteredConnections.length} connection{filteredConnections.length !== 1 ? 's' : ''} 
               {filteredConnections.length !== connections.length && (
                 <span> out of {connections.length} total</span>
               )}
             </div>
           </div>
         )}

        {/* Responsive grid of cards */}
        {filteredConnections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredConnections.map((connection) => (
                             <div
                 key={connection._id}
                 className={`rounded-xl shadow-md overflow-hidden border flex flex-col h-full transition-all duration-200 ${
                   searchQuery ? 'bg-primary/5 border-primary/50 shadow-lg shadow-primary/10' : 'bg-base-200 border-white border-base-300'
                 }`}
               >
                                 {/* Profile photo */}
                 <div className="w-full h-40 sm:h-48 bg-base-300 flex items-center justify-center relative">
                   
                  {connection.photoUrl ? (
                    <img
                      src={connection.photoUrl}
                      alt={`${connection.firstName} ${connection.lastName}`}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center' }}
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
                                                     {searchQuery ? (
                             <>
                               {connection.firstName && (
                                 <span>
                                   {connection.firstName.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, index) => 
                                     part.toLowerCase() === searchQuery.toLowerCase() ? (
                                       <span key={index} className="text-primary font-bold underline decoration-2 decoration-primary/60 underline-offset-2">
                                         {part}
                                       </span>
                                     ) : (
                                       part
                                     )
                                   )}
                                 </span>
                               )}
                               {' '}
                               {connection.lastName && (
                                 <span>
                                   {connection.lastName.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, index) => 
                                     part.toLowerCase() === searchQuery.toLowerCase() ? (
                                       <span key={index} className="text-primary font-bold underline decoration-2 decoration-primary/60 underline-offset-2">
                                         {part}
                                       </span>
                                     ) : (
                                       part
                                     )
                                   )}
                                 </span>
                               )}
                             </>
                           ) : (
                             `${connection.firstName} ${connection.lastName}`
                           )}
                        </span>
                        {connection.age && (
                          <span className="text-xs sm:text-sm font-medium text-base-content/70 flex-shrink-0">
                                                       {searchQuery && connection.age.toString().includes(searchQuery) ? (
                             connection.age.toString().split(new RegExp(`(${searchQuery})`, 'gi')).map((part, index) => 
                               part.toLowerCase() === searchQuery.toLowerCase() ? (
                                 <span key={index} className="text-primary font-bold underline decoration-2 decoration-primary/60 underline-offset-2">
                                   {part}
                                 </span>
                               ) : (
                                 part
                               )
                             )
                           ) : (
                             connection.age
                           )}
                          </span>
                        )}
                     </div>
                   </h2>
                                       {connection.gender && (
                      <p className="text-xs sm:text-sm text-base-content/70 mt-1">
                                                 {searchQuery && connection.gender.toLowerCase().includes(searchQuery.toLowerCase()) ? (
                           connection.gender.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, index) => 
                             part.toLowerCase() === searchQuery.toLowerCase() ? (
                               <span key={index} className="text-primary font-bold underline decoration-2 decoration-primary/60 underline-offset-2">
                                 {part}
                               </span>
                             ) : (
                               part
                             )
                           )
                         ) : (
                           connection.gender
                         )}
                      </p>
                    )}

                   {/* Compact Chat Button */}
                   <div className="mt-3 pt-2 border-t border-base-300/20">
                     <button
                       onClick={() => {
                         navigate(`/chat/${connection._id}`, {
                           state: {
                             photoUrl: connection.photoUrl,
                             firstName: connection.firstName,
                             lastName: connection.lastName
                           }
                         });
                       }}
                       className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-all duration-200 hover:shadow-sm"
                     >
                       <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                       </svg>
                       <span className="text-xs">Message</span>
                     </button>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          /* No search results */
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-base-content mb-2">No connections found</h3>
            <p className="text-base-content/70 mb-4">
              No connections match your search for "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="btn btn-primary btn-sm"
            >
              Clear Search
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Connections;
