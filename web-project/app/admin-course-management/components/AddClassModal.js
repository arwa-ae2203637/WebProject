import React from "react";

const AddClassModal = ({ modalRef, formRef, instructors, onClose, onSubmit }) => {
  return (
    <div 
      id="add-class-modal" 
      className="modal"
      ref={modalRef}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Class</h3>
          <span 
            className="close-modal"
            onClick={onClose}
          >
            &times;
          </span>
        </div>
        <form 
          id="add-class-form" 
          ref={formRef}
          onSubmit={onSubmit}
        >
          <div className="form-group">
            <label htmlFor="class-crn">
              CRN:<span className="required">*</span>
            </label>
            <input type="text" id="class-crn" required />
          </div>
          <div className="form-group">
            <label htmlFor="instructor">
              Instructor:<span className="required">*</span>
            </label>
            <select id="instructor" required>
              <option value="">Select an instructor</option>
              {instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.firstName} {instructor.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="class-limit">
              Class Limit:<span className="required">*</span>
            </label>
            <input type="number" id="class-limit" min="5" max="50" required />
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
                />
                Monday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="days"
                  value="tue"
                  className="day-checkbox"
                />
                Tuesday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="days"
                  value="wed"
                  className="day-checkbox"
                />
                Wednesday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="days"
                  value="thu"
                  className="day-checkbox"
                />
                Thursday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="days"
                  value="sun"
                  className="day-checkbox"
                />
                Sunday
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="start-time">
              Start Time:<span className="required">*</span>
            </label>
            <input type="time" id="start-time" required />
          </div>
          <div className="form-group">
            <label htmlFor="end-time">
              End Time:<span className="required">*</span>
            </label>
            <input type="time" id="end-time" required />
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
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassModal;