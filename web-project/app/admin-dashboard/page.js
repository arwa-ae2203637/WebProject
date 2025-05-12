"use client";
import * as dh from '../data-handling.js';
import "../layout.css";
import "./admin-dashboard.css";
import { useEffect, useRef, useState } from 'react';
function formatTime(time) {
    if (!time) return 'TBD';
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return time;
    }
  }
export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeekSchedule, setCurrentWeekSchedule] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);

    const dayMap = {
        'S': 'Sunday',
        'M': 'Monday',
        'T': 'Tuesday',
        'W': 'Wednesday',
        'TH': 'Thursday'
    };
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

    useEffect(() => {
        async function loadData() {
          try {
            const users = await dh.fetchUsers();
            const currentUser = dh.getLoggedUser(users);
            setLoggedUser(currentUser);
            dh.updateUserProfile(currentUser);
            const classes = await dh.fetchClasses();

            if (Array.isArray(classes) && classes.length > 0) {
              const schedule = classes
                .filter(cls => cls && cls.status === "active")
                .map(cls => {
                  let instructor = users.find(user => user.id === cls.instructor.id);
                  const scheduleArray = [];
                  if (cls.schedule) {
                    const [daysPart, timePart] = cls.schedule.split(' ');
                    const days = daysPart.split('/');
                    const [startTime, endTime] = timePart.split('-');
                    
                    days.forEach(day => {
                      scheduleArray.push({
                        day: day,
                        startTime: formatTime(startTime),
                        endTime: formatTime(endTime),
                      });
                    });
                  }
                  
                  return {
                    crn: cls.crn || 'N/A',
                    courseName: cls.course_id || 'Unknown Course',
                    instructor: "Dr. " + (instructor?.lastName || 'Unknown Instructor'),
                    schedule: scheduleArray
                  };
                });
                
              setCurrentWeekSchedule(schedule);
            } else {
              console.error('No classes found or empty array returned');
              setCurrentWeekSchedule([]);
            }
          } catch (err) {
            console.error('Error loading data:', err);
            setError(err.message || 'An error occurred while loading schedule data');
          } finally {
            setIsLoading(false);
          }
        }
        
        loadData();
      }, []);


  return (
    <>
        <div className="header">
          <div>
            <h2 className="title">QU Student Management</h2>
            <p>Course Management</p>
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
        <div className="container">
          <h1>Weekly Course Schedule</h1>
          <div className="schedule-grid">
          {days.map((day) => 
                <div className="day-column" id={day} key={day}>
                <h2>{day}</h2>
                <div className="classes-container">
                  {currentWeekSchedule
                    .filter(cls => cls.schedule && Array.isArray(cls.schedule))
                    .flatMap(cls => 
                      cls.schedule
                        .filter(s => s && s.day === day.charAt(0))
                        .map((s, index) => (
                          <div className="class-card" key={`${cls.crn}-${s.day}-${index}`}>
                            <h3>{cls.courseName}</h3>
                            <p>CRN: {cls.crn}</p>
                            <p>Instructor: {cls.instructor}</p>
                            <div className="time-slot">
                              <p>{s.startTime || 'TBD'} - {s.endTime || 'TBD'}</p>
                            </div>
                          </div>
                        ))
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}


// "use client";
// import "./admin-dashboard.css"; // Then import the more specific styles

// export default function Page() {
//   return (
//     <div className="admin-dashboard-page">
//       <div className="header">
//         <div className="header-content">
//           <div>
//             <h2>QU Student Management</h2>
//             <p>Course Management</p>
//           </div>
//         </div>
//         <div className="user-profile">
//           <div className="avatar">US</div>
//           <span className="user-name">User Name</span>
//           <span className="dropdown-icon">▼</span>
//         </div>
//       </div>
      
//       <div className="side">
//         <div className="title">
//           <img src="/assets/media/qu-logo.png" alt="logo" />
//           <h2>Qatar University Portal</h2>
//         </div>
//         <div className="space-box"></div>
//         <nav>
//           <div className="options">
//             <img src="/assets/icons/dashboard-icon.svg" alt="dashboard icon" />
//             <a href="/admin-dashboard.html" className="active">
//               Dashboard
//             </a>
//           </div>
//           <div className="options">
//             <img src="/assets/icons/registration-icon.png" alt="registration icon" />
//             <a href="/admin-course-management.html"> Course Management</a>
//           </div>
//         </nav>
//         <div className="sidebar-footer">
//           <div className="options">
//             <img src="/assets/icons/circle-help.svg" alt="help icon" />
//             <a href="#">Help</a>
//           </div>
//           <div className="options">
//             <img src="/assets/icons/phone.svg" alt="contact icon" />
//             <a href="#">Contact us</a>
//           </div>
//           <div className="options">
//             <img src="/assets/icons/log-out.svg" alt="logout icon" />
//             <a href="/login.html">Log out</a>
//           </div>
//         </div>
//       </div>
      
//       <main>
//         <div className="container">
//           <h1>Weekly Course Schedule</h1>
//           <div className="schedule-grid">
//             <div className="day-column" id="monday">
//               <h2>Monday</h2>
//               <div className="classes-container"></div>
//             </div>
//             <div className="day-column" id="tuesday">
//               <h2>Tuesday</h2>
//               <div className="classes-container"></div>
//             </div>
//             <div className="day-column" id="wednesday">
//               <h2>Wednesday</h2>
//               <div className="classes-container"></div>
//             </div>
//             <div className="day-column" id="thursday">
//               <h2>Thursday</h2>
//               <div className="classes-container"></div>
//             </div>
//             <div className="day-column" id="friday">
//               <h2>Friday</h2>
//               <div className="classes-container"></div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



// export default function Page() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentWeekSchedule, setCurrentWeekSchedule] = useState([]);
//   const [loggedUser, setLoggedUser] = useState(null);

//   const dayMap = {
//     'S': 'Sunday',
//     'M': 'Monday',
//     'T': 'Tuesday',
//     'W': 'Wednesday',
//     'TH': 'Thursday'
//   };
  
//   const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

//   useEffect(() => {
//     async function loadData() {
//       try {
//         const users = await dh.fetchUsers();
//         const currentUser = dh.getLoggedUser(users);
//         setLoggedUser(currentUser);
        
//         // Update user profile in UI (you might want to handle this differently in React)
//         dh.updateUserProfile(currentUser);
        
//         const classes = await dh.fetchClasses();
        
//         // Safely handle classes array
//         if (Array.isArray(classes) && classes.length > 0) {
//           const schedule = classes
//             .filter(cls => cls && cls.status === "active")
//             .map(cls => {
//               let instructor = users.find(user => user.id === cls.instructor);
//               const scheduleArray = [];
              
//               if (cls.schedule) {
//                 const [daysPart, timePart] = cls.schedule.split(' ');
//                 const days = daysPart.split('/');
//                 const [startTime, endTime] = timePart.split('-');
                
//                 days.forEach(day => {
//                   scheduleArray.push({
//                     day: day,
//                     startTime: formatTime(startTime),
//                     endTime: formatTime(endTime),
//                   });
//                 });
//               }
              
//               return {
//                 crn: cls.crn || 'N/A',
//                 courseName: cls.course_id || 'Unknown Course',
//                 instructor: "Dr. " + (instructor?.lastName || 'Unknown Instructor'),
//                 schedule: scheduleArray
//               };
//             });
            
//           setCurrentWeekSchedule(schedule);
//         } else {
//           console.error('No classes found or empty array returned');
//           setCurrentWeekSchedule([]);
//         }
//       } catch (err) {
//         console.error('Error loading data:', err);
//         setError(err.message || 'An error occurred while loading schedule data');
//       } finally {
//         setIsLoading(false);
//       }
//     }
    
//     loadData();
//   }, []);

//   const renderClassCards = (day) => {
//     return currentWeekSchedule
//       .filter(cls => cls.schedule && Array.isArray(cls.schedule))
//       .flatMap(cls => 
//         cls.schedule
//           .filter(s => s && s.day && dayMap[s.day.toUpperCase()] === day)
//           .map((s, index) => (
//             <div className="class-card" key={`${cls.crn}-${day}-${index}`}>
//               <h3>{cls.courseName}</h3>
//               <p>CRN: {cls.crn}</p>
//               <p>Instructor: {cls.instructor}</p>
//               <div className="time-slot">
//                 <p>{s.startTime || 'TBD'} - {s.endTime || 'TBD'}</p>
//               </div>
//             </div>
//           ))
//       );
//   };

//   if (isLoading) {
//     return (
//       <div className="container">
//         <div className="loading">Loading schedule...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container">
//         <div className="error">
//           Error: {error}
//           <br />
//           Please check the console for more details.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <h1>Weekly Course Schedule</h1>
//       <div className="schedule-grid">
//         {days.map(day => (
//           <div className="day-column" id={day} key={day}>
//             <h2>{day}</h2>
//             <div className="classes-container">
//               {renderClassCards(day)}
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {currentWeekSchedule.length === 0 && (
//         <div className="no-classes-message">
//           <p>No classes are currently in progress.</p>
//         </div>
//       )}
//     </div>
//   );
// }