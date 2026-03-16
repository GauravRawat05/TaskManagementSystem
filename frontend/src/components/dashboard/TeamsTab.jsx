import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiPlus, FiX, FiLoader, FiShield, FiEdit2 } from 'react-icons/fi';
import { api } from '../../lib/api';

const CreateTeamModal = ({ onClose, onCreated, showToast }) => {
  const [form, setForm] = useState({ projectId: '', teamName: '', teamLeaderId: '', team: [] });
  const [projects, setProjects] = useState([]);
  const [freeInterns, setFreeInterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load prerequisites concurrently
    Promise.all([
      api.get('/api/v1/tms/project/get/project'),
      api.get('/api/v1/tms/intern/available/interns')
    ]).then(([projRes, intRes]) => {
      setProjects(projRes.data?.data || []);
      setFreeInterns(intRes.data?.data || []);
    }).catch(err => {
      setError('Failed to load projects or available interns.');
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.projectId || !form.teamName || !form.teamLeaderId) {
      return setError('Project, Team Name, and Team Leader are required.');
    }
    setLoading(true);
    try {
      await api.post('/api/v1/tms/team/add/team', form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (id) => {
    setForm(p => ({
      ...p,
      team: p.team.includes(id) ? p.team.filter(i => i !== id) : [...p.team, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-7 max-h-[90vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Create New Team</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><FiX size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto pr-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 text-[13px] mb-1.5">Select Project</label>
              <select value={form.projectId} onChange={(e) => setForm(p => ({...p, projectId: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option value="">-- Choose Project --</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 text-[13px] mb-1.5">Team Name</label>
              <input value={form.teamName} onChange={(e) => setForm(p => ({...p, teamName: e.target.value}))} placeholder="e.g. Alpha Front-End" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
            </div>
          </div>

          <div>
             <label className="block text-slate-600 text-[13px] mb-1.5">Assign Team Leader</label>
             <select value={form.teamLeaderId} onChange={(e) => setForm(p => ({...p, teamLeaderId: e.target.value, team: p.team.filter(id => id !== e.target.value)}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option value="">-- Choose Leader --</option>
                {freeInterns.map(int => <option key={int._id} value={int._id}>{int.name} ({int.domain})</option>)}
              </select>
          </div>

          <div>
             <label className="block text-slate-600 text-[13px] mb-2">Select Members</label>
             <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-1">
               {freeInterns.length === 0 ? <p className="text-slate-400 text-xs p-2">No available interns.</p> :
                  freeInterns.filter(i => i._id !== form.teamLeaderId).map(int => (
                    <label key={int._id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                       <input type="checkbox" checked={form.team.includes(int._id)} onChange={() => toggleMember(int._id)} className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"/>
                       <div>
                         <span className="text-slate-700 text-sm block">{int.name}</span>
                         <span className="text-slate-400 text-xs">{int.domain}</span>
                       </div>
                    </label>
                  ))
               }
             </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <div className="flex gap-3 pt-4 border-t border-slate-200 mt-6 pb-2 shrink-0">
             <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button>
             <button type="submit" disabled={loading} className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors">
               {loading ? <FiLoader className="animate-spin" /> : 'Create Team'}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const EditTeamModal = ({ team, onClose, onUpdated, showToast }) => {
  const [form, setForm] = useState({
    teamName: team.teamName || '',
    teamLeaderId: team.teamLeader?._id || team.teamLeader || '',
    team: team.team ? team.team.map(t => t._id || t) : []
  });
  const [poolInterns, setPoolInterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pass the excludeTeamId so we can safely edit our own team without them being marked "unavailable" server-side
    api.get(`/api/v1/tms/intern/available/interns?excludeTeamId=${team._id}`)
      .then(res => setPoolInterns(res.data?.data || []))
      .catch(() => setError('Failed to load eligible interns array.'));
  }, [team._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.teamName || !form.teamLeaderId) {
      return setError('Team Name and Team Leader are required.');
    }
    setLoading(true);
    try {
      await api.patch(`/api/v1/tms/team/update/${team._id}`, form);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update team.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (id) => {
    setForm(p => ({
      ...p,
      team: p.team.includes(id) ? p.team.filter(i => i !== id) : [...p.team, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-7 max-h-[90vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Edit Team: {team.teamName}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><FiX size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto pr-2 space-y-4">
          <div>
            <label className="block text-slate-600 text-[13px] mb-1.5">Team Name</label>
            <input value={form.teamName} onChange={(e) => setForm(p => ({...p, teamName: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
          </div>

          <div>
             <label className="block text-slate-600 text-[13px] mb-1.5">Re-assign Team Leader</label>
             <select value={form.teamLeaderId} onChange={(e) => setForm(p => ({...p, teamLeaderId: e.target.value, team: p.team.filter(id => id !== e.target.value)}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option value="">-- Choose Leader --</option>
                {poolInterns.map(int => <option key={int._id} value={int._id}>{int.name} ({int.domain})</option>)}
              </select>
          </div>

          <div>
             <label className="block text-slate-600 text-[13px] mb-2">Manage Members</label>
             <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-1">
               {poolInterns.length === 0 ? <p className="text-slate-400 text-xs p-2">Loading...</p> :
                  poolInterns.filter(i => i._id !== form.teamLeaderId).map(int => (
                    <label key={int._id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                       <input type="checkbox" checked={form.team.includes(int._id)} onChange={() => toggleMember(int._id)} className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"/>
                       <div>
                         <span className="text-slate-700 text-sm block">{int.name}</span>
                         <span className="text-slate-400 text-xs">{int.domain}</span>
                       </div>
                    </label>
                  ))
               }
             </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <div className="flex gap-3 pt-4 border-t border-slate-200 mt-6 pb-2 shrink-0">
             <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button>
             <button type="submit" disabled={loading} className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors">
               {loading ? <FiLoader className="animate-spin" /> : 'Save Changes'}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ViewMembersModal = ({ team, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-7 max-h-[80vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">{team.teamName} - Members</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><FiX size={18} /></button>
        </div>
        <div className="overflow-y-auto pr-2 space-y-3">
          {team.team?.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">No members assigned.</p>
          ) : (
            team.team?.map(m => (
              <div key={m._id} className="flex justify-between items-center text-sm bg-slate-50 border border-slate-200 p-3 rounded-xl">
                 <div>
                   <span className="text-slate-800 block font-medium">{m.name}</span>
                   <span className="text-slate-500 text-xs">{m.email}</span>
                 </div>
                 <span className="text-slate-600 text-xs px-2 py-1 bg-white rounded border border-slate-200">{m.domain}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const TeamsTab = ({ showToast }) => {
  const [teams, setTeams] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [viewingMembersTeam, setViewingMembersTeam] = useState(null);

  const fetchTeams = async () => {
    try {
      const res = await api.get('/api/v1/tms/team/fetch/team');
      setTeams(res.data?.data || []);
    } catch {
      showToast('Could not load teams.', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchTeams(); }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-bold text-slate-800">Teams</h2><p className="text-slate-500 text-[13px]">{fetching ? 'Loading...' : `${teams.length} teams`}</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200"><FiPlus size={16} />Create Team</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
         {fetching ? (
            <div className="h-40 bg-white border border-slate-200 rounded-2xl animate-pulse col-span-full" />
         ) : teams.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-slate-200 rounded-2xl bg-white">
               <FiUsers size={32} className="mx-auto text-slate-300 mb-3" />
               <p className="text-slate-800 font-semibold">No teams yet</p>
               <p className="text-slate-500 text-sm mt-1">Create teams to map leaders and interns</p>
            </div>
         ) : teams.map(team => (
            <div key={team._id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100 transition-all relative group">
               <div className="flex justify-between items-start mb-3">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2"><FiUsers className="text-blue-500"/> {team.teamName}</h3>
                 <button onClick={() => setEditingTeam(team)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700">
                   <FiEdit2 size={14} />
                 </button>
               </div>

               {team.teamLeader && (
                 <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-center justify-between border border-blue-100">
                   <div>
                     <p className="text-xs text-blue-600 font-semibold mb-0.5 flex items-center gap-1"><FiShield size={10}/> Team Leader</p>
                     <p className="text-slate-800 text-sm font-medium">{team.teamLeader.name}</p>
                   </div>
                   <span className="text-[10px] bg-white px-2 py-1 rounded border border-blue-200 text-blue-600">{team.teamLeader.domain}</span>
                 </div>
               )}

               <div className="mt-4 cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors" onClick={() => setViewingMembersTeam(team)}>
                 <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Members ({team.team?.length || 0})</p>
                 <div className="space-y-1">
                   {team.team?.slice(0, 3).map(m => (
                     <div key={m._id} className="flex justify-between items-center text-sm">
                       <span className="text-slate-700">{m.name}</span>
                       <span className="text-slate-400 text-xs">{m.domain}</span>
                     </div>
                   ))}
                   {team.team?.length > 3 && <p className="text-xs text-blue-600 font-semibold mt-2 group-hover:underline">+ {team.team.length - 3} more (View All)</p>}
                   {team.team?.length > 0 && team.team?.length <= 3 && <p className="text-xs text-blue-600 font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">View Details</p>}
                 </div>
               </div>
            </div>
         ))}
      </div>

      {showModal && <CreateTeamModal onClose={() => setShowModal(false)} onCreated={() => { showToast('Team initialized!'); fetchTeams(); }} showToast={showToast} />}
      {editingTeam && <EditTeamModal team={editingTeam} onClose={() => setEditingTeam(null)} onUpdated={() => { showToast('Team updated successfully!'); fetchTeams(); }} showToast={showToast} />}
      {viewingMembersTeam && <ViewMembersModal team={viewingMembersTeam} onClose={() => setViewingMembersTeam(null)} />}
    </div>
  );
};
