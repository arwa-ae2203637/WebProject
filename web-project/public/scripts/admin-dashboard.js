import * as dh from './data-handling.js';

document.addEventListener('DOMContentLoaded', async () => {
    const dayMap = {
        'S': 'Sunday' ,
        'M': 'Monday',
        'T': 'Tuesday',
        'W': 'Wednesday',
        'TH': 'Thursday'
    };
    const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const users = await dh.fetchUsers();
    const loggedUser = dh.getLoggedUser(users);
    dh.updateUserProfile(loggedUser);
    const container = document.querySelector('.container');
    
    if (!container) {
        console.error('Container element not found');
        return;
    }
    container.innerHTML = '<div class="loading">Loading schedule...</div>';

    try {
        const classes = await dh.fetchClasses();
        
        // Safely handle classes array
        let currentWeekSchedule = [];
        if (Array.isArray(classes) && classes.length > 0) {
            currentWeekSchedule = classes
                .filter(cls => cls && cls.status === "active")
                .map(cls => {
                    let instructor = users.find(user => user.id === cls.instructor);
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
                        instructor: "Dr. "+instructor.lastName || 'Unknown Instructor',
                        schedule: scheduleArray
                    };
                });
        } else {
            console.error('No classes found or empty array returned');
        }

        // Clear loading state and create schedule grid
        container.innerHTML = `
            <h1>Weekly Course Schedule</h1>
            <div class="schedule-grid">
                ${days.map(day => `
                    <div class="day-column" id="${day}">
                        <h2>${day.charAt(0) + day.slice(1)}</h2>
                        <div class="classes-container"></div>
                    </div>
                `).join('')}
            </div>
        `;

        if (currentWeekSchedule.length === 0) {
            container.innerHTML += `
                <div class="no-classes-message">
                    <p>No classes are currently in progress.</p>
                </div>
            `;
            return;
        }

        // Populate schedule
        currentWeekSchedule.forEach(cls => {
            if (!cls.schedule || !Array.isArray(cls.schedule)) {
                console.warn('Class has no valid schedule:', cls);
                return;
            }
            
            cls.schedule.forEach(s => {
                if (!s || !s.day) {
                    console.warn('Invalid schedule entry:', s);
                    return;
                }
                
                const mappedDay = dayMap[s.day.toUpperCase()];
                if (!mappedDay) {
                    console.warn(`No mapping found for day: ${s.day}`);
                    return;
                }
                const dayColumn = document.getElementById(mappedDay);

                if (dayColumn) {
                    const classesContainer = dayColumn.querySelector('.classes-container');
                    const classCard = document.createElement('div');
                    classCard.className = 'class-card';
                    classCard.innerHTML = `
                        <h3>${cls.courseName}</h3>
                        <p>CRN: ${cls.crn}</p>
                        <p>Instructor: ${cls.instructor}</p>
                        <div class="time-slot">
                            <p>${s.startTime || 'TBD'} - ${s.endTime || 'TBD'}</p>
                        </div>
                    `;
                    classesContainer.appendChild(classCard);
                } else {
                    console.warn(`Day column not found for day: ${s.day}`);
                }
            });
        });
    } catch (error) {
        console.error('Error in schedule.js:', error);
        container.innerHTML = `
            <div class="error">
                Error: ${error.message}
                <br>
                Please check the console for more details.
            </div>
        `;
    }
});

// Helper function to format time from 24-hour to 12-hour format
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