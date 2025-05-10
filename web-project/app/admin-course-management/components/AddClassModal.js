// import React from "react";

// const AddClassModal = ({ modalRef, formRef, instructors, onClose, onSubmit }) => {
//   return (
//     <div 
//       id="add-class-modal" 
//       className="modal"
//       ref={modalRef}
//       onClick={(e) => {
//         if (e.target === modalRef.current) onClose();
//       }}
//     >
//       <div className="modal-content">
//         <div className="modal-header">
//           <h3>Add New Class</h3>
//           <span 
//             className="close-modal"
//             onClick={onClose}
//           >
//             &times;
//           </span>
//         </div>
//         <form 
//           id="add-class-form" 
//           ref={formRef}
//           onSubmit={onSubmit}
//         >
//           <div className="form-group">
//             <label htmlFor="class-crn">
//               CRN:<span className="required">*</span>
//             </label>
//             <input type="text" id="class-crn" required />
//           </div>
//           <div className="form-group">
//             <label htmlFor="instructor">
//               Instructor:<span className="required">*</span>
//             </label>
//             <select id="instructor" required>
//               <option value="">Select an instructor</option>
//               {instructors.map(instructor => (
//                 <option key={instructor.id} value={instructor.id}>
//                   {instructor.firstName} {instructor.lastName}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="class-limit">
//               Class Limit:<span className="required">*</span>
//             </label>
//             <input type="number" id="class-limit" min="5" max="50" required />
//           </div>
//           <div className="form-group">
//             <label htmlFor="schedule-days">
//               Schedule Days:<span className="required">*</span>
//             </label>
//             <div className="checkbox-group">
//               <label>
//                 <input
//                   type="checkbox"
//                   name="days"
//                   value="mon"
//                   className="day-checkbox"
//                 />
//                 Monday
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   name="days"
//                   value="tue"
//                   className="day-checkbox"
//                 />
//                 Tuesday
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   name="days"
//                   value="wed"
//                   className="day-checkbox"
//                 />
//                 Wednesday
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   name="days"
//                   value="thu"
//                   className="day-checkbox"
//                 />
//                 Thursday
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   name="days"
//                   value="sun"
//                   className="day-checkbox"
//                 />
//                 Sunday
//               </label>
//             </div>
//           </div>
//           <div className="form-group">
//             <label htmlFor="start-time">
//               Start Time:<span className="required">*</span>
//             </label>
//             <input type="time" id="start-time" required />
//           </div>
//           <div className="form-group">
//             <label htmlFor="end-time">
//               End Time:<span className="required">*</span>
//             </label>
//             <input type="time" id="end-time" required />
//           </div>
//           <div className="form-actions">
//             <button 
//               type="button" 
//               className="cancel-form-btn"
//               onClick={onClose}
//             >
//               Cancel
//             </button>
//             <button type="submit" className="submit-form-btn">
//               Create Class
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddClassModal;

// "use client";

// import { useState } from 'react';

// export default function AddClassModal({ isOpen, onClose, onSubmit, courseId, users, formatSchedule }) {
//   const [formData, setFormData] = useState({
//     crn: '',
//     instructor: '',
//     class_limit: '',
//     days: {
//       sun: false,
//       mon: false,
//       tue: false,
//       wed: false, 
//       thu: false
//     },
//     start_time: '',
//     end_time: ''
//   });

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id.replace('class-', '')]: value
//     }));
//   };

//   const handleCheckboxChange = (e) => {
//     const { value, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       days: {
//         ...prev.days,
//         [value]: checked
//       }
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Validate at least one day is selected
//     const selectedDays = Object.entries(formData.days)
//       .filter(([_, isSelected]) => isSelected)
//       .map(([day]) => day);
      
//     if (selectedDays.length === 0) {
//       alert("Please select at least one day");
//       return;
//     }
    
//     // Format data for submission
//     const submissionData = {
//       course_id: courseId,
//       instructor: parseInt(formData.instructor),
//       crn: formData.crn,
//       class_limit: Number(formData.class_limit),
//       schedule: formatSchedule(
//         selectedDays,
//         formData.start_time,
//         formData.end_time
//       ),
//       students: []
//     };
    
//     onSubmit(submissionData);
//     resetForm();
//   };

//   const resetForm = () => {
//     setFormData({
//       crn: '',
//       instructor: '',
//       class_limit: '',
//       days: {
//         sun: false,
//         mon: false,
//         tue: false,
//         wed: false,
//         thu: false
//       },
//       start_time: '',
//       end_time: ''
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal show">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h3>Add New Class</h3>
//           <span className="close-modal" onClick={onClose}>&times;</span>
//         </div>
//         <form id="add-class-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="class-crn">
//               CRN:<span className="required">*</span>
//             </label>
//             <input
//               type="text"
//               id="class-crn"
//               value={formData.crn}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="instructor">
//               Instructor:<span className="required">*</span>
//             </label>
//             <select
//               id="instructor"
//               value={formData.instructor}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select an instructor</option>
//               {users.map((instructor) => (
//                 <option key={instructor.id} value={instructor.id}>
//                   {`${instructor.firstName} ${instructor.lastName}`}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="class-limit">
//               Class Limit:<span className="required">*</span>
//             </label>
//             <input
//               type="number"
//               id="class-limit"
//               min="5"
//               max="50"
//               value={formData.class_limit}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="schedule-days">
//               Schedule Days:<span className="required">*</span>
//             </label>
//             <div className="checkbox-group">
//               <label>
//                 <input
//                   type="checkbox"
//                   name="days"
//                   value="mon"
//                   className="day-checkbox"
//                   checked={formData.days.mon}
//                   onChange={handleCheckboxChange}
//                 />
//                 Monday
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   name="days"
//                   value="tue"
//                   className="day-checkbox"
//                   checked={formData.days.tue}
//                   onChange={handleCheckboxChange}
//                 />
//                 Tuesday
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   name="days"
//                   value="wed"
//                   className="day-checkbox"
//                   checked={formData.days.wed}
//                   onChange={handleCheckboxChange}
//                 />
//                 Wednesday
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   name="days"
//                   value="thu"
//                   className="day-checkbox"
//                   checked={formData.days.thu}
//                   onChange={handleCheckboxChange}
//                 />
//                 Thursday
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   name="days"
//                   value="sun"
//                   className="day-checkbox"
//                   checked={formData.days.sun}
//                   onChange={handleCheckboxChange}
//                 />
//                 Sunday
//               </label>
//             </div>
//           </div>
//           <div className="form-group">
//             <label htmlFor="start-time">
//               Start Time:<span className="required">*</span>
//             </label>
//             <input
//               type="time"
//               id="start-time"
//               value={formData.start_time}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="end-time">
//               End Time:<span className="required">*</span>
//             </label>
//             <input
//               type="time"
//               id="end-time"
//               value={formData.end_time}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-actions">
//             <button type="button" className="cancel-form-btn" onClick={() => {
//               resetForm();
//               onClose();
//             }}>
//               Cancel
//             </button>
//             <button type="submit" className="submit-form-btn">
//               Create Class
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from 'react';

export default function AddClassModal({ isOpen, onClose, onSubmit, courseId, users, formatSchedule }) {
  const [formData, setFormData] = useState({
    crn: '',
    instructor_id: '',
    class_limit: '',
    days: {
      sun: false,
      mon: false,
      tue: false,
      wed: false, 
      thu: false
    },
    start_time: '',
    end_time: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('class-', '')]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [value]: checked
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate at least one day is selected
    const selectedDays = Object.entries(formData.days)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => day);
      
    if (selectedDays.length === 0) {
      alert("Please select at least one day");
      return;
    }
    
    // Format data for submission
    const submissionData = {
      course_id: courseId,
      instructor_id: parseInt(formData.instructor_id),
      crn: formData.crn,
      class_limit: Number(formData.class_limit),
      schedule: formatSchedule(
        selectedDays,
        formData.start_time,
        formData.end_time
      ),
      status: "pending"
    };
    
    onSubmit(submissionData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      crn: '',
      instructor_id: '',
      class_limit: '',
      days: {
        sun: false,
        mon: false,
        tue: false,
        wed: false,
        thu: false
      },
      start_time: '',
      end_time: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Class</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        <form id="add-class-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="class-crn">
              CRN:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="class-crn"
              value={formData.crn || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="class-instructor_id">
              Instructor:<span className="required">*</span>
            </label>
            <select
              id="class-instructor_id"
              value={formData.instructor_id || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select an instructor</option>
              {users.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {`${instructor.firstName} ${instructor.lastName}`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="class-class_limit">
              Class Limit:<span className="required">*</span>
            </label>
            <input
              type="number"
              id="class-class_limit"
              min="5"
              max="50"
              value={formData.class_limit || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="schedule-days">
              Schedule Days:<span className="required">*</span>
            </label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="days"
                  value="mon"
                  className="day-checkbox"
                  checked={formData.days.mon}
                  onChange={handleCheckboxChange}
                />
                Monday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="days"
                  value="tue"
                  className="day-checkbox"
                  checked={formData.days.tue}
                  onChange={handleCheckboxChange}
                />
                Tuesday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="days"
                  value="wed"
                  className="day-checkbox"
                  checked={formData.days.wed}
                  onChange={handleCheckboxChange}
                />
                Wednesday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="days"
                  value="thu"
                  className="day-checkbox"
                  checked={formData.days.thu}
                  onChange={handleCheckboxChange}
                />
                Thursday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="days"
                  value="sun"
                  className="day-checkbox"
                  checked={formData.days.sun}
                  onChange={handleCheckboxChange}
                />
                Sunday
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="class-start_time">
              Start Time:<span className="required">*</span>
            </label>
            <input
              type="time"
              id="class-start_time"
              value={formData.start_time || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="class-end_time">
              End Time:<span className="required">*</span>
            </label>
            <input
              type="time"
              id="class-end_time"
              value={formData.end_time || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-form-btn" onClick={() => {
              resetForm();
              onClose();
            }}>
              Cancel
            </button>
            <button type="submit" className="submit-form-btn">
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}