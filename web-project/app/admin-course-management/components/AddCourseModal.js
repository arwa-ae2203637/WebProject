import React from "react";

const AddCourseModal = ({ modalRef, categories, onClose, onSubmit }) => {
  return (
    <div 
      id="add-course-modal" 
      className="modal" 
      ref={modalRef}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Course</h3>
          <span 
            className="close-modal"
            onClick={onClose}
          >
            &times;
          </span>
        </div>
        <form id="add-course-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="course-id">
              Course Number:<span className="required">*</span>
            </label>
            <input type="text" id="course-id" required />
          </div>
          <div className="form-group">
            <label htmlFor="course-name">
              Course Name:<span className="required">*</span>
            </label>
            <input type="text" id="course-name" required />
          </div>
          <div className="form-group">
            <label htmlFor="credit-hours">
              Credit Hours:<span className="required">*</span>
            </label>
            <input type="number" id="credit-hours" min="1" max="6" required />
          </div>
          <div className="form-group">
            <label htmlFor="course-category">
              Category:<span className="required">*</span>
            </label>
            <select id="course-category" required>
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
            <select id="course-campus" required>
              <option value="">Select a campus</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="prerequisites">
              Prerequisites (comma separated):
            </label>
            <input
              type="text"
              id="prerequisites"
              placeholder="e.g. CS101, CS102"
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-form-btn"
              onClick={onClose}
            >
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
};

export default AddCourseModal;