import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../../http';

const MeetingModal = ({ isOpen, setIsModalOpen,onClose, selectedDealId,selectedEmployee }) => {
    const [title, setTitle] = useState('');
    const [venue, setVenue] = useState('Client location');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('2025-04-30');
    const [startTime, setStartTime] = useState('17:00');
    const [endDate, setEndDate] = useState('2025-04-30');
    const [endTime, setEndTime] = useState('17:30');
   

    const handleClose = () => onClose();
    
  const localUser = JSON.parse(localStorage.getItem("user"));
  const employeeID=   localUser?.id;

    const handleSave = async () => {
        const meetingData = {
            title,
            venue,
            location,
            startDate,
            startTime,
            endDate,
            endTime,
            dealId: selectedDealId,
            employeeID // Associate the meeting with the selected deal

        };

        try {
            // API call to save the meeting
            await api.post('http://localhost:5500/api/task/meetings/create', meetingData);
            setIsModalOpen(false); // Close the modal
            toast.success('Meeting created successfully!');
        } catch (error) {
            console.error('Error saving meeting:', error);
            toast.error('Failed to create meeting');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" role="dialog" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Meeting Information</h5>
                        <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Venue</label>
                            <select
                                className="form-select"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                            >
                                <option>Client location</option>
                                <option>Office</option>
                                <option>Online</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Start Date & Time</label>
                            <div className="d-flex gap-2">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <input
                                    type="time"
                                    className="form-control"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">End Date & Time</label>
                            <div className="d-flex gap-2">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                <input
                                    type="time"
                                    className="form-control"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingModal;
