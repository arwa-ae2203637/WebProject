// "use client";

// import { useState } from 'react';

// export default function AddCourseModal({ isOpen, onClose, onSubmit, categories }) {
//   const [formData, setFormData] = useState({});

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id.replace('course-', '')]: value
//     }));
//   };

//   // const handleChange = (e) => {
//   //   const { id, value } = e.target;
//   //   const key = id.replace("course-", ""); // normalize keys like "course-id" -> "id"
//   //   setFormData((prev) => ({ ...prev, [key]: value }));
//   // };
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Parse prerequisites into array
//     let prerequisites = [];
//     if (formData.prerequisites) {
//       prerequisites = formData.prerequisites.split(',').map(prerequisite => prerequisite.trim());
//     }
//     console.log(formData.category);
//     // Format data for submission
//     const submissionData = {
//       id: formData.id,
//       name: formData.name,
//       credit_hours: formData.credit_hours,
//       category: formData.category.charAt(0).toUpperCase() + formData.category.slice(1),
//       prerequisites: prerequisites,
//       campus: formData.campus.charAt(0).toUpperCase() + formData.campus.slice(1),
//       status: "Pending"
//     };
    
//     onSubmit(submissionData);
//     resetForm();
//   };

//   const resetForm = () => {
//     setFormData({
//       id: '',
//       name: '',
//       credit_hours: '',
//       category: '',
//       campus: '',
//       prerequisites: ''
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal show">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h3>Add New Course</h3>
//           <span className="close-modal" onClick={onClose}>&times;</span>
//         </div>
//         <form id="add-course-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="course-id">
//               Course Number:<span className="required">*</span>
//             </label>
//             <input
//               type="text"
//               id="course-id"
//               value={formData.id}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="course-name">
//               Course Name:<span className="required">*</span>
//             </label>
//             <input
//               type="text"
//               id="course-name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="credit-hours">
//               Credit Hours:<span className="required">*</span>
//             </label>
//             <input
//               type="number"
//               id="credit-hours"
//               min="1"
//               max="6"
//               value={formData.credit_hours}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="course-category">
//               Category:<span className="required">*</span>
//             </label>
//             <select
//               id="course-category"
//               value={formData.category}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select a category</option>
//               {categories.map((category, index) => (
//                 <option key={index} value={category.toLowerCase()}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="course-campus">
//               Campus:<span className="required">*</span>
//             </label>
//             <select
//               id="course-campus"
//               value={formData.campus}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select a campus</option>
//               <option value="female">Female</option>
//               <option value="male">Male</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="prerequisites">Prerequisites (comma separated):</label>
//             <input
//               type="text"
//               id="prerequisites"
//               placeholder="e.g. CS101, CS102"
//               value={formData.prerequisites}
//               onChange={handleChange}
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
//               Create Course
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from 'react';

export default function AddCourseModal({ isOpen, onClose, onSubmit, categories }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    credit_hours: '',
    category: '',
    campus: '',
    prerequisites: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('course-', '')]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse prerequisites into array
    let prerequisites = [];
    if (formData.prerequisites) {
      prerequisites = formData.prerequisites.split(',').map(prerequisite => prerequisite.trim());
    }
    
    // Format data for submission
    const submissionData = {
      id: formData.id,
      name: formData.name,
      credit_hours: formData.credit_hours,
      category: formData.category.charAt(0).toUpperCase() + formData.category.slice(1),
      prerequisites: prerequisites,
      campus: formData.campus.charAt(0).toUpperCase() + formData.campus.slice(1),
      status: "Pending"
    };
    
    onSubmit(submissionData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      credit_hours: '',
      category: '',
      campus: '',
      prerequisites: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Course</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        <form id="add-course-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="course-id">
              Course Number:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="course-id"
              value={formData.id || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="course-name">
              Course Name:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="course-name"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="course-credit_hours">
              Credit Hours:<span className="required">*</span>
            </label>
            <input
              type="number"
              id="course-credit_hours"
              min="1"
              max="6"
              value={formData.credit_hours || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="course-category">
              Category:<span className="required">*</span>
            </label>
            <select
              id="course-category"
              value={formData.category || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="course-campus">
              Campus:<span className="required">*</span>
            </label>
            <select
              id="course-campus"
              value={formData.campus || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select a campus</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="course-prerequisites">Prerequisites (comma separated):</label>
            <input
              type="text"
              id="course-prerequisites"
              placeholder="e.g. CS101, CS102"
              value={formData.prerequisites || ''}
              onChange={handleChange}
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
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}







// import React from "react";

// const AddCourseModal = ({ modalRef, categories, onClose, onSubmit }) => {
//   return (
//     <div 
//       id="add-course-modal" 
//       className="modal" 
//       ref={modalRef}
//       onClick={(e) => {
//         if (e.target === modalRef.current) onClose();
//       }}
//     >
//       <div className="modal-content">
//         <div className="modal-header">
//           <h3>Add New Course</h3>
//           <span 
//             className="close-modal"
//             onClick={onClose}
//           >
//             &times;
//           </span>
//         </div>
//         <form id="add-course-form" onSubmit={onSubmit}>
//           <div className="form-group">
//             <label htmlFor="course-id">
//               Course Number:<span className="required">*</span>
//             </label>
//             <input type="text" id="course-id" required />
//           </div>
//           <div className="form-group">
//             <label htmlFor="course-name">
//               Course Name:<span className="required">*</span>
//             </label>
//             <input type="text" id="course-name" required />
//           </div>
//           <div className="form-group">
//             <label htmlFor="credit-hours">
//               Credit Hours:<span className="required">*</span>
//             </label>
//             <input type="number" id="credit-hours" min="1" max="6" required />
//           </div>
//           <div className="form-group">
//             <label htmlFor="course-category">
//               Category:<span className="required">*</span>
//             </label>
//             <select id="course-category" required>
//               <option value="">Select a category</option>
//               {categories.map((category, index) => (
//                 <option key={index} value={category.toLowerCase()}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="course-campus">
//               Campus:<span className="required">*</span>
//             </label>
//             <select id="course-campus" required>
//               <option value="">Select a campus</option>
//               <option value="female">Female</option>
//               <option value="male">Male</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="prerequisites">
//               Prerequisites (comma separated):
//             </label>
//             <input
//               type="text"
//               id="prerequisites"
//               placeholder="e.g. CS101, CS102"
//             />
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
//               Create Course
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCourseModal;