import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLevelWiseTeam } from "../../api/user.api";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import { dateFormatter } from "../../utils/AdditionalFn";

const UserTeam = () => {
  const [activeLevel, setActiveLevel] = useState(null);
  const defaultLevels = [1, 2];

  const { data, isLoading, error } = useQuery({
    queryKey: ["team"],
    queryFn: getLevelWiseTeam,
  });

  const response = data?.data || [];

  const formattedData = defaultLevels.map((level) => {
    const found = response.find((item) => item.level === level);
    return (
      found || {
        level,
        count: 0,
        users: [],
      }
    );
  });

  const formatINR = (value) =>
    `₹${(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-gray-50">
        Loading team...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-gray-50">
        Something went wrong!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* ---------------- TEAM STRUCTURE ---------------- */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            My Team Structure
          </h2>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {formattedData?.map((team) => (
              <div
                key={team.level}
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
              >
                {/* Top Row */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                      {team.level}
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">
                        Level {team.level}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {team.count} members
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setActiveLevel(activeLevel === team.level ? null : team.level)
                    }
                    className="flex items-center gap-1 text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full text-gray-600 hover:bg-gray-100 transition"
                  >
                    {activeLevel === team.level ? "Hide" : "View"}
                    {activeLevel === team.level ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                </div>

                {/* Users List */}
                {activeLevel === team.level && (
                  <div className="mt-3 space-y-2 max-h-[220px] overflow-y-auto">
                    {team.users?.length > 0 ? (
                      team.users.map((user) => (
                        <div
                          key={user?._id}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white border border-gray-100 hover:border-gray-200 transition rounded-lg p-4 text-sm gap-3"
                        >
                          {/* LEFT */}
                          <div className="space-y-1 min-w-0">
                            <p className="text-gray-900 font-medium text-sm uppercase truncate">
                              {user?.username || "Unknown User"}
                            </p>
                            <p className="text-gray-500 text-xs break-words">
                              Team: {user?.referedUsers?.length || 0} | Invesments:{" "}
                              {formatINR(user?.totalInvestment)}
                            </p>
                          </div>

                          {/* RIGHT */}
                          <div className="flex flex-row sm:flex-col justify-between sm:items-end gap-2 text-xs">
                            <span
                              className={`px-2 py-1 rounded-full whitespace-nowrap ${
                                user?.isVerified
                                  ? "bg-green-50 text-green-600"
                                  : "bg-red-50 text-red-500"
                              }`}
                            >
                              {user?.isVerified ? "Active" : "Inactive"}
                            </span>

                            <div className="text-gray-400 break-all text-xs ">
                              {dateFormatter(user?.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center text-xs py-2">
                        No users found
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTeam;