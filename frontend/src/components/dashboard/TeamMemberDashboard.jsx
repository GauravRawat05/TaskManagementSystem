import React from 'react';
import { useParams } from 'react-router-dom';

const TeamMemberDashboard = () => {
  const { workspaceId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Team Member Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Welcome to your focused workspace. From here, you'll be able to view tasks assigned to you, update their status, and log your daily work.
        </p>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <p className="text-blue-800 font-medium">Coming soon in Wave 2! (Workspace: {workspaceId})</p>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDashboard;
