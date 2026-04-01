// import React from 'react';
// import { FiLink, FiCheckCircle, FiUsers, FiMail, FiShare2, FiUserCheck, FiShield, FiUser } from 'react-icons/fi';

// const InvitesTab = ({ setShowInviteModal, setShowInviteLinkModal }) => {
//   const roles = [
//     {
//       name: 'MEMBER',
//       icon: FiUser,
//       color: 'green',
//       description: 'Basic workspace access with view and comment permissions',
//       permissions: ['View projects', 'Comment on tasks', 'Access shared resources']
//     },
//     {
//       name: 'MANAGER',
//       icon: FiUserCheck,
//       color: 'blue',
//       description: 'Oversee projects and team activities with management capabilities',
//       permissions: ['Create projects', 'Assign tasks', 'Review work', 'Manage team members']
//     },
//     {
//       name: 'ADMIN',
//       icon: FiShield,
//       color: 'purple',
//       description: 'Full control over workspace settings and all members',
//       permissions: ['Full workspace access', 'Manage all users', 'Configure settings', 'Billing access']
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-semibold text-gray-800">Access & Invites</h2>
//         <p className="text-gray-500 text-sm">Invite members to your workspace or generate shareable invite links</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Generate Invite Link Card */}
//         <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-start justify-between mb-4">
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//               <FiLink className="w-6 h-6 text-purple-600" />
//             </div>
//             <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Shareable</span>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Generate Invite Link</h3>
//           <p className="text-gray-500 text-sm mb-4">
//             Generate a unique link that can be shared with anyone. Perfect for inviting multiple users.
//           </p>
//           <ul className="space-y-2 text-sm text-gray-600 mb-4">
//             <li className="flex items-center gap-2">
//               <FiCheckCircle className="text-green-500" size={14} />
//               <span>Share with anyone via any channel</span>
//             </li>
//             <li className="flex items-center gap-2">
//               <FiCheckCircle className="text-green-500" size={14} />
//               <span>Link expires after 24 hours</span>
//             </li>
//             <li className="flex items-center gap-2">
//               <FiCheckCircle className="text-green-500" size={14} />
//               <span>Optional email binding for security</span>
//             </li>
//           </ul>
//           <button
//             onClick={() => setShowInviteModal(true)}
//             className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
//           >
//             <FiShare2 size={16} />
//             Generate Invite Link
//           </button>
//         </div>

//         {/* Email Invitation Card with Role Options */}
//         <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-start justify-between mb-4">
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//               <FiMail className="w-6 h-6 text-blue-600" />
//             </div>
//             <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Email</span>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Invitation</h3>
//           <p className="text-gray-500 text-sm mb-4">
//             Send an email invitation to specific users. They'll receive an email with instructions to join.
//           </p>

//           {/* Role Selection Options */}
//           <div className="space-y-3 mb-4">
//             <p className="text-sm font-medium text-gray-700">Select Role:</p>
//             {roles.map((role) => {
//               const Icon = role.icon;
//               const colorClasses = {
//                 green: 'border-green-200 hover:border-green-300 focus:ring-green-500',
//                 blue: 'border-blue-200 hover:border-blue-300 focus:ring-blue-500',
//                 purple: 'border-purple-200 hover:border-purple-300 focus:ring-purple-500'
//               };

//               return (
//                 <button
//                   key={role.name}
//                   onClick={() => setShowInviteLinkModal(true, role.name)}
//                   className={`w-full p-3 border rounded-lg transition-all hover:shadow-md group`}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-10 h-10 bg-${role.color}-100 rounded-lg flex items-center justify-center`}>
//                         <Icon className={`w-5 h-5 text-${role.color}-600`} />
//                       </div>
//                       <div className="text-left">
//                         <div className="flex items-center gap-2">
//                           <span className={`font-semibold text-gray-800`}>{role.name}</span>
//                           <span className={`px-2 py-0.5 bg-${role.color}-100 text-${role.color}-700 text-xs font-medium rounded-full`}>
//                             {role.name}
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1">{role.description}</p>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {role.permissions.map((permission, idx) => (
//                             <span key={idx} className="text-xs text-gray-500">• {permission}</span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <FiMail className="text-gray-400 group-hover:text-blue-500 transition-colors" size={16} />
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           <button
//             onClick={() => setShowInviteLinkModal(true)}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//           >
//             <FiMail size={16} />
//             Send Email Invitation
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvitesTab;

import React from 'react'

const InvitesTab = () => {
  return (
    <div>InvitesTab</div>
  )
}

export default InvitesTab
