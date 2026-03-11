import Intern from '../models/intern.model.js';
import Project from '../models/project.model.js';
import Team from '../models/team.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// create team
const createTeam= asyncHandler(async(req,res)=>{

      const { projectId, teamName, team, teamLeaderId } = req.body

      const project = await Project.findById(projectId)

      const teamLeader = await Intern.findByIdAndUpdate(teamLeaderId, {
          $set : {
            role : "teamLeader"
          },
      },{new : true}).select("-refreshToken")



      const teamLead = await Intern.findById(teamLeader._id)


      const allMembers = await Intern.find({_id : {$in : team}})

      console.log("allMembers",allMembers);

        await Team.create({
            project : project.name,
            teamName,
            team : allMembers,
            teamLeader : teamLead,
        })

  return res.status(200).json(new ApiResponse(200, {}, "new project create successfully"))
})

// get team
const getTeams = asyncHandler(async(req,res)=>{

  const team = await Team
  .find()
  .populate("teamLeader", "name email role domain")
  .populate("team", "name email role domain")
  .lean()

  return res.status(200).json(new ApiResponse(200, team, "fetch team"))
})

// add new member
const addNewMember = asyncHandler(async(req,res)=>{

        const { teamId } = req.params

         const { newMemberId } = req.body

        const team = await Team.findById(teamId);
          if (!team) {
            return res.status(404).json({ error: "Team not found" });
          }


          const intern = await Intern.findOne({ _id: newMemberId }).select("_id");
          if (!intern) {
            return res.status(404).json({ error: "Intern not found" });
          }


          const updatedTeam = await Team.findByIdAndUpdate(
            team._id,
            { $addToSet: { team: intern._id } },
            { new: true }
          );

          console.log("Updated team:", updatedTeam.team);


    return res.status(200).json(new ApiResponse(200, {}, "team update successfully"))
})

const removeTeamMember = asyncHandler(async(req,res)=>{

    const { teamId } = req.params
    const { internId } = req.body

    const team = await Team.findById(teamId)
    const Intern = await Intern.findById(internId).select("_id")

    await Team.findByIdAndUpdate(team._id, {
        $pull : {
          team : Intern._id
        }
    }, {save : true})

    return res.status(200).json(new ApiResponse(200, {}, "remove intern from team successfully"))
})

//set new Team leader from team
const setNewTeamLeader = asyncHandler(async(req,res)=>{

        const { teamId } = req.params

         const { NewTeamLeaderId } = req.body

        const team = await Team.findById(teamId);
          if (!team) {
            return res.status(404).json({ error: "Team not found" });
          }


          const NewTeamLeader = await Intern.findOne({ _id: NewTeamLeaderId }).select("_id");
          if (!NewTeamLeader) {
            return res.status(404).json({ error: "teamLeader not found" });
          }


          const updatedTeam = await Team.findByIdAndUpdate(
            team._id,
            {
               $set: { teamLeader: NewTeamLeader._id },
               $pull : { team : NewTeamLeader._id }
          } ,
            { new: true }
          );



          console.log("Updated team:", updatedTeam.team);


    return res.status(200).json(new ApiResponse(200, {}, "add new team leader from team update successfully"))
})

// remove team leader and add to team
const removeTeamLeaderAndAddToTeam = asyncHandler(async(req,res)=>{

       const { teamId } = req.params

       const { teamLeaderId } = req.body

    const team = await Team.findById(teamId);
          if (!team) {
            throw new ApiError(400,"Team not found")
          }


          const teamLeader = await Intern.findOne({ _id: teamLeaderId }).select("_id");
          if (!teamLeader) {
              throw new ApiError(400,"teamLeader not found")
          }


           await Team.findByIdAndUpdate(
            team._id,
            {
              $push : { team : teamLeader._id },
              $set: { teamLeader:  null }
          } ,
            { new: true }
          );
  return res.status(200).json(new ApiResponse(200, {}, "remove team Leader from team and add to team successfully"))
})

export {
  createTeam,
  getTeams,
  addNewMember,
  setNewTeamLeader,
  removeTeamMember,
  removeTeamLeaderAndAddToTeam
};
