import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
const app = express();

app.use(cors({
  origin : process.env.CORS,
  credentials : true
}))

app.use(
  express.urlencoded({extended : true, limit : "10mb"})
)

app.use(express.static("public"))
app.use(express.json({limit: "16kb"}))
app.use(cookieParser())


// ======================================================
// import routes
// ======================================================
import authRouter from './routes/auth.route.js'
import projectRouter from './routes/project.route.js'
import taskRouter from './routes/task.route.js'
import userRouter from './routes/user.route.js'
import workspaceRouter from './routes/workspace.route.js'
import inviteRouter from './routes/inviteToken.route.js'
import teamRouter from './routes/team.route.js'
import reportRouter from './routes/report.route.js'

// ======================================================
// handle routes
// ======================================================
app.use("/api/v1/tms/auth", authRouter)
app.use("/api/v1/tms/project", projectRouter)
app.use("/api/v1/tms/task", taskRouter)
app.use("/api/v1/tms/user", userRouter)
app.use("/api/v1/tms/workspace", workspaceRouter)
app.use("/api/v1/tms/invite", inviteRouter)
app.use("/api/v1/tms/team", teamRouter)
app.use("/api/v1/tms/report", reportRouter)

// ======================================================
// global error handler
// ======================================================
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Dont pollute logs with expected auth checking errors
  if (statusCode !== 401) {
    console.error(err);
  }

  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || []
  });
});

// server health


export default app;
