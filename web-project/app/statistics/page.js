"use client";
import "../layout.css";
import { useEffect, useState } from "react";
import * as dh from "../data-handling";

const statsEndpoints = [
  {
    key: "userTypeCounts",
    label: "Number of users per user type",
    url: "/api/stats/userTypeCounts",
  },
  {
    key: "studentsPerCourse",
    label: "Number of students per course",
    url: "/api/stats/studentsPerCourse",
  },
  {
    key: "studentsPerCourseCategory",
    label: "Number of students per course category",
    url: "/api/stats/studentsPerCourseCategory",
  },
  {
    key: "topCourses",
    label: "Top 3 most enrolled courses",
    url: "/api/stats/topCourses",
  },
  {
    key: "coursesWithHighestFailureRate",
    label: "Courses with the highest failure rate",
    url: "/api/stats/coursesWithHighestFailureRate",
  },
  {
    key: "averageGradePerCourse",
    label: "Average grade per course",
    url: "/api/stats/averageGradePerCourse",
  },
  {
    key: "studentsPerInstructor",
    label: "Number of students per instructor",
    url: "/api/stats/studentsPerInstructor",
  },
  {
    key: "studentsFailingMoreThanTwoCourses",
    label: "Number of students failing more than 2 courses",
    url: "/api/stats/studentsFailingMoreThanTwoCourses",
  },
  {
    key: "coursesPerCategory",
    label: "Number of courses per category",
    url: "/api/stats/coursesPerCategory",
  },
  {
    key: "studentWithHighestAverageGrade",
    label: "Student with the highest average grade",
    url: "/api/stats/highestAverageGrade",
  },
];

export default function StatisticsPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [chartStyle, setChartStyle] = useState({});

  useEffect(() => {
    async function fetchAllStats() {
      const results = {};
      for (const stat of statsEndpoints) {
        try {
          const res = await fetch(stat.url);
          results[stat.key] = await res.json();
        } catch (e) {
          results[stat.key] = { error: e.message };
        }
      }
      const currentUser = await dh.getLoggedUser(users);
      setLoggedUser(currentUser);
      setStats(results);
      setLoading(false);
    }
    fetchAllStats();
  }, []);

  useEffect(() => {
    if (!loading && loggedUser) {
      dh.updateUserProfile(loggedUser);
    }
  }, [loading, loggedUser]);

  // const updateProgressChart = (enrollments) => {
  //   const totalCourses = enrollments.length;
  //   if (totalCourses === 0) return;

  //   const completedCount = enrollments.filter(c => c.status === "completed").length;
  //   const currentCount = enrollments.filter(c => c.status === "current").length;

  //   const completedDeg = (completedCount / totalCourses) * 360;
  //   const currentDeg = (currentCount / totalCourses) * 360;

  //   setChartStyle({
  //     backgroundImage: `conic-gradient(
  //       #3D051B ${completedDeg}deg,
  //       #6a3041 ${completedDeg}deg ${completedDeg + currentDeg}deg,
  //       #d1a9b1 ${completedDeg + currentDeg}deg
  //     )`
  //   });

  //   const progress = Math.round((completedCount / totalCourses) * 100);
  //   setProgressPercent(progress);
  // };

  if (loading) return <div>Loading statistics...</div>;
  console.log(statsEndpoints[7].key,"STATS: ",stats[statsEndpoints[7].key])
  return (
    <>
      <div className="header">
        <div>
          <h2 className="title">System Statistics</h2>
        </div>
        <div className="user-profile">
          <div className="avatar">US</div>
          <span className="user-name">User Name</span>
          <span className="dropdown-icon">▼</span>
        </div>
      </div>
      <div className="side">
        <div>
          <div className="title">
            <img src="/assets/media/qu-logo.png" alt="logo" />
            <h2>Qatar University Portal</h2>
          </div>
          <div className="space-box"></div>
          <nav>
            <div className="options">
              <img src="/assets/icons/dashboard-icon.svg" />
              <a href="/admin-dashboard" className="active">
                Dashboard
              </a>
            </div>
            <div className="options">
              <img src="/assets/icons/registration-icon.png" />
              <a href="/admin-course-management"> Course Management</a>
            </div>
            <div className="options">
              <img src="/assets/icons/statistics.svg" />
              <a href="/statistics"> System Statistics</a>
            </div>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="options">
            <img src="/assets/icons/circle-help.svg" />
            <a href="/">Help</a>
          </div>
          <div className="options">
            <img src="/assets/icons/phone.svg" />
            <a href="/">Contact us</a>
          </div>
          <div className="options">
            <img src="/assets/icons/log-out.svg" />
            <a href="/login">Log out</a>
          </div>
        </div>
      </div>
      <main>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
          <section key={statsEndpoints[0].key} style={{marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 8, background: "#fff"}}>
            <h2>{statsEndpoints[0].label}</h2>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap column" }}>
              {(stats[statsEndpoints[0].key] || []).map((entry, index) => (
                <div key={index} style={{ background: "#f0f0f0", padding: 12, borderRadius: 8, minWidth: 120, textAlign: "center"}}>
                  <strong>
                    {entry.userType.charAt(0).toUpperCase() + entry.userType.slice(1)}
                  </strong>
                  <div>{entry._count._all} user(s)</div>
                </div>
              ))}
            </div>
          </section>
          <section key={statsEndpoints[1].key} style={{marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
            <h2>{statsEndpoints[1].label}</h2>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16,}}>
              {(stats[statsEndpoints[1].key] || []).map((entry, index) => (
                <div key={index} style={{background: "#f0f0f0", padding: 12, borderRadius: 8, textAlign: "center"}}>
                  <strong>{entry.course_id}</strong>
                  <div>{entry._count._all} student(s)</div>
                </div>
              ))}
            </div>
          </section>
          <section key={statsEndpoints[2].key} style={{marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
            <h2>{statsEndpoints[2].label}</h2>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16,}}>
              {(stats[statsEndpoints[2].key] || []).map((entry, index) => (
                <div key={index} style={{background: "#f0f0f0", padding: 12, borderRadius: 8, textAlign: "center"}}>
                  <strong>{entry.category}</strong>
                  <div>{entry.count} student(s)</div>
                </div>
              ))}
            </div>
          </section>
          <section key={statsEndpoints[3].key} style={{marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
            <h2>{statsEndpoints[3].label}</h2>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16,}}>
              {(stats[statsEndpoints[3].key] || []).map((entry, index) => (
                <div key={index} style={{background: "#f0f0f0", padding: 12, borderRadius: 8, textAlign: "center"}}>
                  <strong>{entry.course_id}</strong>
                  <div>{entry._count.id} student(s)</div>
                </div>
              ))}
            </div>
          </section>
          <section key={statsEndpoints[4].key} style={{marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
            <h2>{statsEndpoints[4].label}</h2>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16,}}>
              {(stats[statsEndpoints[4].key] || []).map((entry, index) => (
                <div key={index} style={{background: "#f0f0f0", padding: 12, borderRadius: 8, textAlign: "center"}}>
                  <strong>{entry.course_id}</strong>
                  <div>{entry._count.id} student(s)</div>
                </div>
              ))}
            </div>
          </section>
          <section key={statsEndpoints[5].key} style={{marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
            <h2>{statsEndpoints[5].label}</h2>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16,}}>
            {(stats[statsEndpoints[5].key] || []).map((entry, index) => {
              if (entry.averageGrade === null) return null;
              return (
                <div key={index} style={{ background: "#f0f0f0", padding: 12, borderRadius: 8, textAlign: "center" }}>
                  <strong>{entry.course_id}</strong>
                  <div>{entry.averageGrade}</div>
                </div>
              );
            })}
            </div>
          </section>
          <section key={statsEndpoints[6].key} style={{marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
            <h2>{statsEndpoints[6].label}</h2>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16,}}>
              {(stats[statsEndpoints[6].key] || []).map((entry, index) => (
                <div key={index} style={{background: "#f0f0f0", padding: 12, borderRadius: 8, textAlign: "center"}}>
                  <strong>{entry.instructorName}</strong>
                  <div>{entry.studentCount} student(s)</div>
                </div>
              ))}
            </div>
          </section>
          <section key={statsEndpoints[7].key} style={{marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
            <h2>{statsEndpoints[7].label}</h2>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16,}}>
              {(stats[statsEndpoints[7].key] || []).map((entry, index) => (
                <div key={index} style={{background: "#f0f0f0", padding: 12, borderRadius: 8, textAlign: "center"}}>
                  <strong>{entry.name}</strong>
                  <div>{entry.failCount} courses</div>
                </div>
              ))}
            </div>
          </section>
          <section key={statsEndpoints[8].key} style={{marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
            <h2>{statsEndpoints[8].label}</h2>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16,}}>
              {(stats[statsEndpoints[8].key] || []).map((entry, index) => (
                <div key={index} style={{background: "#f0f0f0", padding: 12, borderRadius: 8, textAlign: "center"}}>
                  <strong>{entry.category}</strong>
                  <div>{entry._count._all} courses</div>
                </div>
              ))}
            </div>
          </section>
          <section key={statsEndpoints[9].key} style={{marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
            <h2>{statsEndpoints[9].label}</h2>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16,}}>
              
                <div key={statsEndpoints[9].key+"2"} style={{background: "#f0f0f0", padding: 12, borderRadius: 8, textAlign: "center"}}>
                  <strong>{stats[statsEndpoints[9].key].name}</strong>
                </div>
              
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
