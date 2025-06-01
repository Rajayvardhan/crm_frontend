import React, { useEffect, useState } from "react";
import axios from "axios";
import api, { getMembers_Leader } from "../../http";
import { toast } from "react-toastify";
import Deals from "../../components/Deals/Deals";

export default function LeaderLead() {
  const [deals, setDeals] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showDeals, setShowDeals] = useState(true); // 👈 for conditional rendering

  const users = JSON.parse(localStorage.getItem("user"));
  const leaderId = users?.id;


  console.log("form leaderboard",selectedEmployee);
  

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get(
          `http://localhost:5500/api/task/getDeals/${leaderId}`
        );
        if (res.success) {
          setDeals(res.data);
        }
      } catch (err) {
        console.error("❌ Error fetching deals:", err);
      }
    };

    const fetchMembers = async () => {
      try {
        const res = await getMembers_Leader();
        setMembers(res.data);
      } catch (error) {
        console.error("❌ Error fetching members:", error);
      }
    };

    fetchDeals();
    fetchMembers();
  }, [leaderId]);

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "http://localhost:5500/api/task/assignDeals",
        {
          dealID: selectedDeal,
          assigned_employee: selectedEmployee,
          deadline,
        }
      );

      if (res.success) {
        toast.success("✅ Deal assigned successfully!");
        const updatedDeals = await api.get(
          `http://localhost:5500/api/task/getDeals/${leaderId}`
        );
        setDeals(updatedDeals.data);
        setSelectedEmployee("");
        setDeadline("");
        setSelectedDeal(null);
      } else {
        toast.error("❌ Assignment failed");
      }
    } catch (err) {
      toast.error("❌ Error assigning deal:", err);
    }
  };

  const handleSearch = () => {
    setShowDeals(prev => !prev); // toggles true ↔ false
  };

  return (
    <div className="main-content mt-3 dealsComponent">
      <div className="container">
        {/* Employee Selector */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4>Leader Leads</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-9">
                    <label htmlFor="selectemployee" className="form-label">
                      Select Employee
                    </label>
                    <select
                      className="form-select"
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                      <option>Choose Employee</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <div className="mt-4">
                      <button
                        className="btn bg-primary rounded-sm px-3 py-2 text-white border-0"
                        onClick={handleSearch}
                      >
                        <i className="bi bi-search me-2"></i>       {showDeals ? 'Employee Deals' : 'My Deals'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showDeals ? (
          <>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h4>Latest Leads</h4>
                  </div>
                  <div className="card-body mt-3">
                    <div className="row gy-4">
                      {deals.map((deal, index) => (
                        <div className="col-md-6 col-xl-3" key={index}>
                          <div className="card position-relative shadow-sm rounded-4">
                            <button
                              className="btn btn-sm position-absolute top-0 end-0 m-2"
                              data-bs-toggle="modal"
                              data-bs-target="#cardModal"
                              onClick={() => setSelectedDeal(deal._id)}
                            >
                              <i className="bi bi-pencil-square fs-6"></i>
                            </button>
                            <div
                              className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                              style={{
                                top: "-20px",
                                left: "20px",
                                width: "40px",
                                height: "40px",
                                backgroundColor: "#4a90e2",
                                boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px",
                              }}
                            >
                              <i className="fas fa-briefcase text-white"></i>
                            </div>
                            <div className="card-body pt-4 mt-3">
                              <h5 className="card-title fw-semibold">
                                Deal #{deal._id.slice(-4)}
                              </h5>
                              <div className="text-muted small mb-1">
                                <i className="fas fa-rupee-sign me-1 text-secondary" />
                                Value: ₹{deal.value}
                              </div>
                              <div className="text-muted small mb-1">
                                <i className="fas fa-user me-1 text-secondary" />
                                Name: {deal.lead?.name}
                              </div>
                              <div className="text-muted small mb-1">
                                <i className="fas fa-user me-1 text-secondary" />
                                District: {deal.lead?.District}
                              </div>
                              <div className="text-muted small mb-1">
                                <i className="fas fa-user me-1 text-secondary" />
                                Interest: {deal.lead?.interest}
                              </div>
                              <div className="d-flex mt-2 pt-3 px-2 justify-content-between align-items-center text-muted small fw-semibold">
                                <span>Status</span>
                                <span>Assigned</span>
                              </div>
                              <div className="d-flex align-items-center mt-2 pt-3 px-3 border-top">
                                <span className="badge bg-secondary text-uppercase">
                                  {deal?.status}
                                </span>
                                <span className="ms-auto fw-semibold text-muted">
                                  {deal.assigned_employee
                                    ? deal.assigned_employee.name || "User"
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal */}
                <div
                  className="modal fade"
                  id="cardModal"
                  tabIndex="-1"
                  aria-labelledby="cardModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="cardModalLabel">
                          Assign Task
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={handleAssignSubmit}>
                          <div className="mb-3">
                            <label className="form-label">
                              Select Employee
                            </label>
                            <select
                              className="form-select"
                              value={selectedEmployee}
                              onChange={(e) =>
                                setSelectedEmployee(e.target.value)
                              }
                            >
                              <option value="">Choose Employee</option>
                              {members?.map((member) => (
                                <option value={member.id} key={member.id}>
                                  {member.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Deadline</label>
                            <input
                              type="date"
                              className="form-control"
                              value={deadline}
                              onChange={(e) => setDeadline(e.target.value)}
                            />
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary rounded-sm px-5 mt-3 py-2"
                          >
                            Save
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="main-contents">
          <Deals  selectedEmployee={selectedEmployee} />
            
          </div>
        )}
      </div>
    </div>
  );
}