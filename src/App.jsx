import React, { useState } from "react";

function App() {
  const DEMO_USERS = [
    { username: "akhilesh", password: "akhilesh123", role: "student", name: "Akhilesh", mentorId: "" },
    { username: "lakshmi", password: "lakshmi123", role: "student", name: "Lakshmi", mentorId: "" },
    { username: "hindusri", password: "hindusri123", role: "student", name: "Hindu Sri", mentorId: "" },
    { username: "mentor1", password: "mentor1pass", role: "mentor", name: "Dr. Ramesh Kumar", id: "KL-MENTOR-4501" },
    { username: "mentor2", password: "mentor2pass", role: "mentor", name: "Prof. Meena R.", id: "KL-MENTOR-8257" }
  ];

  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: "", password: "", role: "student" });
  const [pressedRole, setPressedRole] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [pendingMentorAssign, setPendingMentorAssign] = useState(null);
  const [mentorIdInput, setMentorIdInput] = useState("");
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignmentForm, setAssignmentForm] = useState({ title: "", details: "", deadline: "" });
  const [form, setForm] = useState({
    name: "",
    description: "",
    tags: "",
    status: "planning",
    milestoneCount: 1,
    milestonesCompleted: 0,
    due: "",
    files: 0,
    student: ""
  });
  const [sidebarView, setSidebarView] = useState("dashboard");
  const [mentorFeedback, setMentorFeedback] = useState({});

  // Styled inputs for login/mentor assignment and all other fields
  const whiteInputStyle = {
    display: "block", width: "97%", padding: "8px", margin: "4px 0 14px 0",
    fontSize: "15px", borderRadius: "6px", border: "1px solid #b0c4de", color: "#fff", background: "#242629"
  };
  const inputStyle = {
    display: "block", width: "97%", padding: "8px", margin: "4px 0 14px 0",
    fontSize: "15px", borderRadius: "6px", border: "1px solid #b0c4de", color: "#111", background: "#fff"
  };
  const sidebarBtnStyle = {
    padding: "12px 2px", marginBottom: 4, fontSize: 15, cursor: "pointer",
    borderRadius: 6, background: "rgba(255,255,255,0.04)", color: "#fff", fontWeight: 600
  };

  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      input::placeholder, textarea::placeholder {
        color: #fff !important;
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // ---- HANDLERS ----

  const handleLogin = (e) => {
    e.preventDefault();
    setErrMsg("");
    const found = DEMO_USERS.find(
      u => u.username === loginData.username && u.password === loginData.password && u.role === loginData.role
    );
    if (found) {
      if (found.role === "student" && !found.mentorId) {
        setPendingMentorAssign(found);
        return;
      }
      setUser(found);
      setSidebarView("dashboard");
    } else {
      setErrMsg("Invalid username, password, or role. You must be a registered user!");
    }
  };

  const handleMentorIdAssign = (e) => {
    e.preventDefault();
    const mentor = DEMO_USERS.find(u => u.role === "mentor" && u.id === mentorIdInput.trim());
    if (!mentor) {
      setErrMsg("Mentor code not found. Please enter 'KL-MENTOR-4501' or 'KL-MENTOR-8257'.");
      return;
    }
    pendingMentorAssign.mentorId = mentor.id;
    setUser({ ...pendingMentorAssign, mentorId: mentor.id });
    setPendingMentorAssign(null);
    setErrMsg("");
  };

  const handleAddReview = (idx) => {
    const review = mentorFeedback[idx]?.trim();
    if (!review) return;
    const copy = [...projects];
    copy[idx].reviews = [...(copy[idx].reviews||[]), { mentor: user.name, text: review, date: Date.now() }];
    setProjects(copy);
    setMentorFeedback({ ...mentorFeedback, [idx]: "" });
  };

  const handleFormChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); };
  const handleFormSubmit = e => {
    e.preventDefault();
    const newProj = {
      ...form,
      milestoneCount: parseInt(form.milestoneCount),
      milestonesCompleted: parseInt(form.milestonesCompleted),
      progress: Math.round((parseInt(form.milestonesCompleted) / parseInt(form.milestoneCount)) * 100),
      tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean),
      student: form.student || (user.role==="student" ? user.name : "Sample Student"),
      reviews: []
    };
    setProjects([...projects, newProj]);
    setForm({ name: "", description: "", tags: "", status: "planning", milestoneCount: 1, milestonesCompleted: 0, due: "", files: 0, student: "" });
    setSidebarView("dashboard");
  };

  const handleAssFormChange = e => { setAssignmentForm({ ...assignmentForm, [e.target.name]: e.target.value }); };
  const handleAssFormSubmit = e => {
    e.preventDefault();
    setAssignments([...assignments, assignmentForm]);
    setAssignmentForm({ title: "", details: "", deadline: "" });
    setSidebarView("dashboard");
  };

  const isStudent = user && user.role === "student";
  const isMentor = user && user.role === "mentor";
  const studentProjects = projects.filter(p => p.student === (user && user.name));
  const thisMentorsProjects = isMentor
    ? projects.filter((p) => {
        const student = DEMO_USERS.find(
          (u) => u.role === "student" && u.name === p.student && u.mentorId === user.id
        );
        return student;
      })
    : [];
  const thisMentorsStudents = isMentor
    ? DEMO_USERS.filter(u => u.role === "student" && u.mentorId === user.id)
    : [];

  // ---- UI LOGIC ----

  if (pendingMentorAssign) {
    return (
      <div style={{
        minHeight: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center",
        background: "url('https://upload.wikimedia.org/wikipedia/en/thumb/7/78/KL_University_logo.svg/1200px-KL_University_logo.svg.png') center center / contain no-repeat, #f8fbfd",
        color: "#111"
      }}>
        <form onSubmit={handleMentorIdAssign} style={{
          background: "rgba(255,255,255,0.97)", padding: 36, borderRadius: 13, minWidth: 320, color: "#111"
        }}>
          <h2 style={{marginTop:0,marginBottom:25, textAlign:"center", color:"#111"}}>Connect to Your Mentor</h2>
          <div style={{marginBottom:16}}>
            Welcome, <b>{pendingMentorAssign.name}</b>!<br/>
            Enter your <b>Mentor Code</b> to connect:
          </div>
          <input
            type="text"
            placeholder="Mentor Code (e.g. KL-MENTOR-4501)"
            value={mentorIdInput}
            required
            onChange={e => setMentorIdInput(e.target.value)}
            style={whiteInputStyle}
          />
          {errMsg && <div style={{color:"red",marginBottom:10}}>{errMsg}</div>}
          <button style={buttonStyle}>Connect & Continue</button>
        </form>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: "100vh", width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "url('https://upload.wikimedia.org/wikipedia/en/thumb/7/78/KL_University_logo.svg/1200px-KL_University_logo.svg.png') center center / contain no-repeat, #f8fbfd",
        color: "#111"
      }}>
        <form onSubmit={handleLogin} style={{
          background: "rgba(255,255,255,0.97)", padding: 40, borderRadius: 13,
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)", minWidth: 320, zIndex: 2, color: "#111"
        }}>
          <h2 style={{marginTop:0,marginBottom:15,textAlign:"center",color:"#111"}}>Portfolio Tracker Login</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 18 }}>
            {["student", "mentor"].map(role => (
              <button
                type="button"
                key={role}
                style={{
                  padding: "11px 28px",
                  background: loginData.role === role ? "#395fd1" : "#ecf0fc",
                  color: loginData.role === role ? "#fff" : "#111",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 18,
                  cursor: "pointer",
                  boxShadow: loginData.role === role ? "0 2px 12px #b5cafe" : "none",
                  transform:
                    pressedRole === role
                      ? "scale(1.10)"
                      : loginData.role === role
                      ? "scale(1.05)"
                      : "scale(1)",
                  transition: "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s"
                }}
                onMouseDown={() => setPressedRole(role)}
                onMouseUp={() => setPressedRole(null)}
                onMouseLeave={() => setPressedRole(null)}
                onClick={() => setLoginData({ ...loginData, role })}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            required
            onChange={e => setLoginData({...loginData, username:e.target.value})}
            style={whiteInputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            required
            onChange={e => setLoginData({...loginData, password:e.target.value})}
            style={whiteInputStyle}
          />
          {errMsg && <div style={{color:"red",marginBottom:10}}>{errMsg}</div>}
          <button style={buttonStyle}>Login</button>
          <div style={{fontSize:13,marginTop:18,color:"#111",textAlign:"center"}}>
            Students:<br />
            <b>akhilesh / akhilesh123</b><br />
            <b>lakshmi / lakshmi123</b><br />
            <b>hindusri / hindusri123</b><br/>
            Mentors:<br />
            <b>mentor1 / mentor1pass</b> (KL-MENTOR-4501)<br />
            <b>mentor2 / mentor2pass</b> (KL-MENTOR-8257)
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", width: "100vw", height: "100vh", minHeight: "100vh",
      fontFamily: "Segoe UI, Arial, sans-serif", background: "#FAFAFB", color: "#111"
    }}>
      {/* SIDEBAR */}
      <div style={{
        width: 260, background: "#242629", color: "#fff", padding: 20, height: "100vh", fontWeight: 600
      }}>
        <h2 style={{ marginTop: 0, color: "#fff" }}>Portfolio Tracker</h2>
        <div style={{ margin: "30px 0 20px 0", display: "flex", alignItems: "center" }}>
          <div style={{
            background: "#666", borderRadius: "50%", width: 44, height: 44, display: "flex",
            alignItems: "center", justifyContent: "center", marginRight: 12, fontSize: 25, color: "#fff"
          }}>{user.name[0]}</div>
          <div>
            <strong style={{ color: "#fff" }}>{user.name}</strong><br />
            <span style={{ fontSize: 13, color: "#EEE" }}>
              {user.role.charAt(0).toUpperCase()+user.role.slice(1)}
            </span>
            {isMentor && (
              <div style={{fontSize:12, color: "#ffe086", marginTop:7}}>
                Mentor Code:<br /><b>{user.id}</b>
              </div>
            )}
          </div>
        </div>
        <nav>
          <div style={sidebarBtnStyle} onClick={()=>setSidebarView("dashboard")}>
            {isMentor ? "Review Projects" : "Dashboard"}
          </div>
          {isMentor && (
            <>
              <div style={sidebarBtnStyle} onClick={()=>setSidebarView("addAssignment")}>Add Assignment</div>
              <div style={sidebarBtnStyle} onClick={()=>setSidebarView("addProject")}>Add Project</div>
            </>
          )}
          {!isMentor && (
            <>
              <div style={sidebarBtnStyle} onClick={()=>setSidebarView("projects")}>My Projects</div>
              <div style={sidebarBtnStyle} onClick={()=>setSidebarView("portfolio")}>Portfolio</div>
              <div style={sidebarBtnStyle} onClick={()=>setSidebarView("addProject")}>+ New Project</div>
            </>
          )}
        </nav>
        <div style={{ position: "absolute", bottom: 25, left: 30, color: "#fff", fontSize: 14, cursor: "pointer" }}
          onClick={()=>{setUser(null);setLoginData({username:"",password:"",role:"student"});}}
        >
          Sign Out
        </div>
      </div>
      {/* MAIN CONTENT */}
      <div style={{
        flex: 1, height: "100vh", overflowY: "auto", padding: "34px 42px", background: "#FAFAFB", color: "#111"
      }}>
        <div style={{ fontSize: 14, color: "#111", marginBottom: 18 }}>
          <strong style={{ background: "#EFF3FF", padding: "3px 12px", borderRadius: 7, marginRight: 12, color: "#111" }}>
            {user.role.charAt(0).toUpperCase()+user.role.slice(1)} View</strong>
          Demo Mode
        </div>
        {sidebarView==="dashboard" && (
          <ReviewProjectsTab
            isMentor={isMentor}
            projects={isMentor ? thisMentorsProjects : studentProjects}
            mentorFeedback={mentorFeedback}
            setMentorFeedback={setMentorFeedback}
            onAddReview={handleAddReview}
            mentorStudents={thisMentorsStudents}
          />
        )}
        {sidebarView==="addAssignment" && isMentor && (
          <AddAssignmentTab
            assignments={assignments}
            assignmentForm={assignmentForm}
            onChange={handleAssFormChange}
            onSubmit={handleAssFormSubmit}
            inputStyle={inputStyle}
          />
        )}
        {sidebarView==="addProject" && (
          <AddProjectTab
            isMentor={isMentor}
            form={form}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            inputStyle={inputStyle}
          />
        )}
        {!isMentor && (
          <>
            {sidebarView==="projects" && <MyProjectsTab studentProjects={studentProjects}/>}
            {sidebarView==="portfolio" && <PortfolioTab studentProjects={studentProjects} user={user}/>}
          </>
        )}
      </div>
    </div>
  );
}

// ---- COMPONENTS ----

function ReviewProjectsTab({ isMentor, projects, mentorFeedback, setMentorFeedback, onAddReview, mentorStudents }) {
  return (
    <div style={{color: "#111"}}>
      <h2 style={{ marginBottom: 10, color: "#111" }}>
        {isMentor ? "Review Student Projects" : "Recent Projects"}
      </h2>
      {isMentor && mentorStudents && (
        <div style={{marginBottom:22}}>
          <h4 style={{ color:"#111", marginBottom:5 }}>Your Students:</h4>
          {mentorStudents.length === 0 && (
            <div style={{ color: "#111", fontWeight: 500, fontSize: 16 }}>No students assigned to you.</div>
          )}
          {mentorStudents.map(s =>
            <div key={s.username} style={{fontWeight:500, fontSize:15, marginBottom:3, color:"#111"}}>{s.name}</div>
          )}
        </div>
      )}
      {projects.length === 0 && (
        <div style={{ color: "#111", fontWeight: 500, fontSize: 16 }}>
          No {isMentor ? "student projects" : "projects"} found.
        </div>
      )}
      {projects.map((p, idx) =>
        <ProjCard
          key={idx}
          project={p}
          isMentor={isMentor}
          feedback={mentorFeedback[idx]||""}
          onFeedbackChange={txt => setMentorFeedback({...mentorFeedback,[idx]:txt})}
          onAddReview={()=>onAddReview(idx)}
        />
      )}
    </div>
  );
}
function AddAssignmentTab({ assignments, assignmentForm, onChange, onSubmit, inputStyle }) {
  return (
    <div style={{color: "#111"}}>
      <h2 style={{marginBottom:12, color:"#111"}}>Add Assignment</h2>
      <form onSubmit={onSubmit} style={{ background:"#fff", borderRadius:10, padding:"26px 32px", maxWidth:520, color:"#111" }}>
        <label style={labelStyle}>Title
          <input name="title" value={assignmentForm.title} onChange={onChange} required style={inputStyle} placeholder="Assignment Title"/>
        </label>
        <label style={labelStyle}>Details
          <textarea name="details" value={assignmentForm.details} onChange={onChange} required style={{...inputStyle,height:60}} placeholder="Explain the assignment"/>
        </label>
        <label style={labelStyle}>Deadline
          <input type="date" name="deadline" value={assignmentForm.deadline} onChange={onChange} style={inputStyle}/>
        </label>
        <button style={buttonStyle}>Add Assignment</button>
      </form>
      <h3 style={{marginTop:32, color:"#111"}}>Current Assignments</h3>
      {assignments.length===0 && <div style={{ color: "#111" }}>No assignments posted yet.</div>}
      {assignments.map((a,i)=>
        <div key={i} style={{
          background:"#f7fbff", border:"1px solid #ececec", borderRadius:7, padding:"13px 19px", marginBottom:13, color: "#111"
        }}>
          <div style={{fontWeight:600, fontSize:15, color:"#111"}}>{a.title}</div>
          <div style={{fontSize:14, color:"#111"}}>{a.details}</div>
          <div style={{fontSize:13, color:"#111", marginTop:6}}>Deadline: {a.deadline||'-'}</div>
        </div>
      )}
    </div>
  );
}
function AddProjectTab({ isMentor, form, onChange, onSubmit, inputStyle }) {
  return (
    <div style={{color: "#111"}}>
      <h2 style={{ marginBottom: 10, color:"#111" }}>{isMentor ? "Add Student Project" : "Add New Project"}</h2>
      <form onSubmit={onSubmit} style={{ background:"#fff", borderRadius:10, padding:"26px 32px", maxWidth:520, color:"#111" }}>
        {isMentor &&
        <label style={labelStyle}>Student Name
          <input name="student" value={form.student} onChange={onChange} required style={inputStyle} placeholder="Assign to Student"/>
        </label>}
        <label style={labelStyle}>Project Name
          <input name="name" value={form.name} onChange={onChange} required style={inputStyle} placeholder="Project Title"/>
        </label>
        <label style={labelStyle}>Description
          <textarea name="description" value={form.description} onChange={onChange} required style={{...inputStyle,height:60}} placeholder="About the project"/>
        </label>
        <label style={labelStyle}>Tags (comma separated)
          <input name="tags" value={form.tags} onChange={onChange} style={inputStyle} placeholder="AI, Education, Web"/>
        </label>
        <label style={labelStyle}>Status
          <select name="status" value={form.status} onChange={onChange} style={inputStyle}>
            <option value="planning">Planning</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label style={labelStyle}>Milestones Completed
          <input type="number" min={0} name="milestonesCompleted" value={form.milestonesCompleted} onChange={onChange} style={inputStyle}/>
        </label>
        <label style={labelStyle}>Total Milestones
          <input type="number" min={1} name="milestoneCount" value={form.milestoneCount} onChange={onChange} style={inputStyle} required/>
        </label>
        <label style={labelStyle}>Due Date
          <input type="date" name="due" value={form.due} onChange={onChange} style={inputStyle} required/>
        </label>
        <button style={buttonStyle}>Add Project</button>
      </form>
    </div>
  );
}
function MyProjectsTab({ studentProjects }) {
  return (
    <div style={{color:"#111"}}>
      <h2 style={{ marginBottom: 10, color:"#111" }}>My Projects</h2>
      {studentProjects.length === 0 && (<div style={{ color: "#111" }}>No projects found.</div>)}
      {studentProjects.map((p, idx) =>
        <ProjCard key={idx} project={p} isMentor={false}/>
      )}
    </div>
  );
}
function PortfolioTab({ studentProjects, user }) {
  return (
    <div style={{color:"#111"}}>
      <h2 style={{ color:"#111" }}>Your Portfolio</h2>
      <div style={{marginBottom:20, fontSize:15, color:"#111"}}>
        Name: <b>{user.name}</b>
        <br />
        Number of Projects: <b>{studentProjects.length}</b>
      </div>
      <div>
        {studentProjects.length === 0 && <div style={{ color: "#111" }}>You haven&apos;t added any projects yet.</div>}
        {studentProjects.map((p, idx) => (
          <div key={idx} style={{
            background:"#fff", border:"1px solid #eee", borderRadius:8, padding:"18px 24px", marginBottom:18, color: "#111"
          }}>
            <div style={{fontWeight:600, color:"#111"}}>{p.name}</div>
            <div style={{fontSize:14, color:"#111", marginBottom:12}}>{p.description}</div>
            <div style={{ color: "#111" }}>Status: <b>{p.status}</b></div>
            <div style={{ color: "#111" }}>Due: {p.due || '-'}</div>
            <div style={{ color: "#111" }}>Milestones: {p.milestonesCompleted}/{p.milestoneCount}</div>
            <div>
              Tags: {p.tags && p.tags.map((tag,i)=>
                <span key={i} style={{
                  background:"#f2f2f8", color:"#111", fontSize:12, borderRadius:6, marginRight:9, padding:"2px 7px"
                }}>{tag}</span>
              )}
            </div>
            {p.reviews && p.reviews.length > 0 && (
              <div style={{marginTop:14, background:"#f6fafd", border:"1px solid #dde", borderRadius:8, padding:"11px 15px", color:"#111"}}>
                <b>Mentor Feedback</b>
                {p.reviews.map((rev, ridx) => (
                  <div key={ridx} style={{marginTop:5, fontSize:13, color:"#111"}}>
                    {rev.mentor}: {rev.text} <span style={{color:"#888", fontSize:11}}>({new Date(rev.date).toLocaleDateString()})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const labelStyle = { display:"block", fontWeight:500, marginTop:17, marginBottom:7, color: "#111" };
const buttonStyle = { display:"block", margin:"21px auto", padding:"10px 28px", background:'#0066cc', color:'white', border:'none', borderRadius:5, fontSize:17, cursor:'pointer' };

function ProjCard({ project, isMentor, feedback, onFeedbackChange, onAddReview }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #eee", borderRadius: 11, padding: "18px 24px", marginBottom: 20, color: "#111"
    }}>
      <div style={{ marginBottom: 5 }}>
        <strong style={{ fontSize: 17, color:"#111" }}>{project.name}</strong>
        <span style={{
          fontSize: 13, background: "#ebf1fe", color: "#4570da", padding: "3px 10px", borderRadius: 9, marginLeft: 14
        }}>{project.status}</span>
      </div>
      <div style={{ fontSize: 14, marginBottom: 14, color:"#111" }}>{project.description}</div>
      <div style={{ marginBottom: 9 }}>
        <div style={{
          background: "#e3e3ea", borderRadius: 8, overflow: "hidden", height: 10, width: "100%"
        }}>
          <div style={{
            height: "100%", width: `${project.progress}%`, background: "#395fd1"
          }} />
        </div>
        <span style={{ fontSize: 13, color:"#111" }}>
          {project.milestonesCompleted}/{project.milestoneCount} milestones · {project.progress}%
        </span>
      </div>
      <div style={{ color: "#111", fontSize: 13 }}>
        Due <b>{project.due ? new Date(project.due).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"}</b>
      </div>
      <div style={{marginTop:8}}>
        {project.tags && project.tags.map((t,i)=>
          <span key={i} style={{
            fontSize:11, color:"#111", background: "#f2f2f8", marginRight:7, padding:"2px 9px", borderRadius:7
          }}>{t}</span>
        )}
      </div>
      {project.student && (
        <div style={{fontSize:12,color:"#111",marginTop:6}}>Student: {project.student}</div>
      )}
      {project.reviews && project.reviews.length > 0 && (
        <div style={{ marginTop: 16, padding: '10px 13px', background: "#f6fafd", border: "1px solid #dde", borderRadius: 8, color: "#111" }}>
          <div style={{ fontWeight: 500, marginBottom: 6, color: "#111" }}>Mentor Feedback</div>
          {project.reviews.map((r, idx) => (
            <div key={idx} style={{ marginBottom: 8, color:"#111" }}>
              <b>{r.mentor}</b>: <span>{r.text}</span>
              <span style={{color:"#888",fontSize:11,marginLeft:6}}>{new Date(r.date).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
            </div>
          ))}
        </div>
      )}
      {isMentor && (
        <div style={{ marginTop: 18 }}>
          <textarea
            placeholder="Add feedback or review..."
            value={feedback}
            onChange={e=>onFeedbackChange(e.target.value)}
            style={{ ...inputStyle, width:"96%", marginBottom:7, height:54, fontSize:14, color:"#111" }}
          />
          <button style={{...buttonStyle, fontSize:14, padding:"8px 18px"}} onClick={onAddReview} type="button">Add Feedback</button>
        </div>
      )}
    </div>
  );
}

export default App;
