import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from './Calendar';  // Assuming this is your calendar component
import api from '../../http';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: null,
  });

  // Fetch events for the selected date
  const fetchEventsByDate = (date) => {
    api.get(`http://localhost:5500/api/task/events/${date}`)  // Ensure your backend supports this endpoint
      .then(response => {
        setEvents(response.data);  // Assuming response contains the events data
      })
      .catch(error => {
        console.error('Error fetching events for selected date:', error);
      });
  };

  // Handle date selection from the calendar
  const handleDateSelect = (date) => {
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    setSelectedDate(dateString);  // Set the selected date as a string (YYYY-MM-DD format)
    fetchEventsByDate(dateString);  // Fetch events for the selected date from the backend
  };

  // Handle input change for new event
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  // Handle image change for new event
  const handleImageChange = (e) => {
    setNewEvent({
      ...newEvent,
      image: e.target.files[0],
    });
  };

  // Submit new event to API
  const handleEventSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newEvent.title);
    formData.append('type', newEvent.type);
    formData.append('date', newEvent.date);
    formData.append('time', newEvent.time);
    formData.append('location', newEvent.location);
    formData.append('description', newEvent.description);
    formData.append('image', newEvent.image);

    api.post('http://localhost:5500/api/task/events', formData) // Replace with your API endpoint
      .then(response => {
        console.log(response.data);
        
        setEvents([...events, response.data]); // Add new event to state
        setNewEvent({ title: '', type: '', date: '', time: '', location: '', description: '', image: null }); // Reset form
      })
      .catch(error => {
        console.error('Error adding event:', error);
      });
  };

  return (
    <>
      <div className="main-content">
        <div className="container mb-4">
          <div className="row">
            <div className="col-md-4">
              <div className="searchbox">
                <i className="bi bi-search"></i>
                <input type="search" placeholder="Search" />
              </div>
              {/* Pass the date selection handler to the Calendar */}
              <Calendar onDateSelect={handleDateSelect} />
              <div className="weeklyEvents">
                <h2>Weekly Essentials</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Consequuntur, doloremque. Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Consequuntur, doloremque.
                </p>
              </div>
            </div>
            <div className="col-md-8">
              <div className="sideevnts">
                <div className="d-flex justify-content-between align-items-center">
                  <h1>{selectedDate ? selectedDate : 'Select a date'}</h1>
                  <div className="fvrtevent">
                    <span className="badge bg-label-primary rounded-5 me-3">
                      <i className="bi bi-star-fill me-2"></i>Favorite
                    </span>
                    <span
                      className="badge bg-label-warning rounded-5 cursor-pointer"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bi bi-calendar2-event me-2"></i>Add Event
                    </span>
                  </div>
                </div>
                <div className="card rounded-4">
                  <div className="card-body">
                    {/* Render filtered events for the selected date */}
                    {events?.length > 0 ? (
                      events.map((event, index) => (
                        <div key={index} className="row align-items-stretch">
                          <div className="col-md-6 d-flex">
                            <img
                              src={ `http://localhost:5500${event.image}`}
                              alt=""
                              className="img-fluid rounded-4 w-100 h-100 object-fit-cover"
                            />
                          </div>
                          <div className="col-md-6 d-flex flex-column justify-content-between gap-4 py-3">
                            <div className="toptitle">
                              <span className="badge bg-label-info rounded-5">
                                <i className="bi bi-calendar2-event-fill me-2"></i>{' '}
                                {event.type}
                              </span>
                            </div>
                            <div className="eventsTitle">
                              <h2>{event.title}</h2>
                              <p className="description">{event.description}</p>
                            </div>
                            <div className="eventsdate">
                              <div>
                                <span className="fw-semibold">
                                  <i className="bi bi-calendar2-event"></i>
                                </span>{' '}
                                <span>{event.date}</span>
                                <span className="fw-semibold ms-3">
                                  <i className="bi bi-clock"></i>
                                </span>{' '}
                                <span>{event.time}</span>
                              </div>
                              <span className="fw-semibold">
                                <i className="bi bi-geo"></i>
                              </span>{' '}
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No events found for this date.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for adding new events */}
      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">New Event</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEventSubmit}>
                {/* Form inputs for event creation */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="eventTitle" className="form-label">Event Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventTitle"
                      name="title"
                      value={newEvent.title}
                      onChange={handleInputChange}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="eventType" className="form-label">Event Type</label>
                    <select
                      className="form-select"
                      id="eventType"
                      name="type"
                      value={newEvent.type}
                      onChange={handleInputChange}
                    >
                      <option>Workshop</option>
                      <option>Seminar</option>
                      <option>Webinar</option>
                      <option>Meeting</option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="eventDate" className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="eventDate"
                      name="date"
                      value={newEvent.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="eventTime" className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      id="eventTime"
                      name="time"
                      value={newEvent.time}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3 col-md-6">
                    <label htmlFor="eventLocation" className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventLocation"
                      name="location"
                      value={newEvent.location}
                      onChange={handleInputChange}
                      placeholder="Enter event location"
                    />
                  </div>

                  <div className="mb-3 col-md-6">
                    <label htmlFor="eventImage" className="form-label">Event Image</label>
                    <input
                      className="form-control"
                      type="file"
                      id="eventImage"
                      name="image"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="eventDescription" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="eventDescription"
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe the event"
                  ></textarea>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn px-4 bg-label-danger rounded-sm" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn bg-label-success rounded-sm">Save changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
