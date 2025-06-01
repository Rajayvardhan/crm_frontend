import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../http";

export default function ViewLead() {
  const { id } = useParams();
  const [leads, setLeads] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [form, setForm] = useState({
    result: "",
    duration: "",
    interest: "",
    reminder: "",
    value: "",
    assigned_leader: "",
  });

  useEffect(() => {
    fetchLeads();
    fetchLeaders();
  }, [id]);

  const fetchLeads = async () => {
    try {
      const res = await api.get(
        `http://localhost:5500/api/task/getlead/${id}`
      );
      setLeads(res);
      console.log(res);
      
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchLeaders = async () => {
    try {
      const data = await api.get(
        `http://localhost:5500/api/task/get-salesLeader`
      );

      setLeaders(data);
    } catch (err) {
      console.error("Leader fetch error:", err);
    }
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openUpdateModal = (lead) => {
    setSelectedLead(lead);
    setForm({
      ...form,
      result: lead.result || "",
      interest: lead.interest || "",
      duration: "",
      reminder: "",
    });
    setShowUpdateModal(true);
  };

  const openDealModal = (lead) => {
    setSelectedLead(lead);
    setForm({ ...form, value: "", assigned_leader: "", reminder: "" });
    setShowDealModal(true);
  };

  const submitUpdate = async () => {
    try {
      const res = await api.put(`http://localhost:5500/api/task/updatelead`, {
        leadID: selectedLead._id,
        result: form.result,
        duration: form.duration,
        interest: form.interest,
        reminder: form.reminder,
      });
      toast.success("Lead updated");
      setShowUpdateModal(false);
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error("Error updating lead");
    }
  };

  const submitDeal = async () => {
    try {
      const res = await api.post(
        `http://localhost:5500/api/task/createDeals`,
        {
          leadID: selectedLead._id,
          value: form.value,
          assigned_leader: form.assigned_leader,
          reminder: form.reminder,
        }
      );
      toast.success("Deal created");
      setShowDealModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Error creating deal");
    }
  };

  const getInterestBadge = (interest) => {
    const map = {
        Hot: "badge bg-danger",               // 🔴 Red
        Cold: "badge bg-primary",             // 🔵 Blue
        Warm: "badge bg-warning text-dark",   // 🟡 Yellow
        Medium: "badge bg-success",           // 🟢 Green
        Low: "badge bg-secondary",    
    };
    return (
      <span className={map[interest] || "badge bg-secondary"}>{interest}</span>
    );
  };


  return (
    <>
      <div className="main-content mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="text-primary mb-0">
                    <i className="bi bi-list-check me-2"></i>My Tasks
                  </h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="bg-light">
                        <tr>
                          <th>Task Title</th>
                          <th>Lead Name</th>
                          <th>Contact No.</th>
                          <th>State</th>
                          <th>Interest</th>
                          <th>Remark</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads?.map((lead, i) => (
                          <tr key={i}>
                            <td>{lead.taskID?.title || "N/A"}</td>
                            <td>{lead.name}</td>
                            <td>{lead.Contact_No}</td>
                            <td>{lead.State}</td>
                            <td>{getInterestBadge(lead.interest)}</td>
                            <td>{lead.result}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => openUpdateModal(lead)}
                              >
                                Update Lead
                              </button>
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => openDealModal(lead)}
                              >
                                Assign Deal
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔧 Update Modal */}
      {showUpdateModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Lead</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUpdateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  name="result"
                  placeholder="Result"
                  className="form-control mb-2"
                  value={form.result}
                  onChange={handleInput}
                />
                <input
                  name="duration"
                  placeholder="Duration"
                  className="form-control mb-2"
                  value={form.duration}
                  onChange={handleInput}
                />
                <select
                  name="interest"
                  className="form-control mb-2"
                  value={form.interest}
                  onChange={handleInput}
                >
                  <option value="">Select Interest</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Hot">Hot</option>
                  <option value="Cold">Cold</option>
                  <option value="Warm">Warm</option>
                </select>
                <input
                  name="reminder"
                  placeholder="Reminder Date"
                  type="date"
                  className="form-control mb-2"
                  value={form.reminder}
                  onChange={handleInput}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={submitUpdate}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 Deal Modal */}
      {showDealModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Deal from Lead</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDealModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  name="value"
                  placeholder="Deal Value"
                  className="form-control mb-2"
                  value={form.value}
                  onChange={handleInput}
                />
                <select
                  name="assigned_leader"
                  className="form-control mb-2"
                  value={form.assigned_leader}
                  onChange={handleInput}
                >
                  <option value="">Select Leader</option>
                  {leaders?.data?.data?.map((leader) => (
                    <option key={leader._id} value={leader._id}>
                      {leader.name}
                    </option>
                  ))}
                </select>

                <input
                  name="reminder"
                  placeholder="Reminder Date"
                  type="date"
                  className="form-control mb-2"
                  value={form.reminder}
                  onChange={handleInput}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={submitDeal}>
                  Create Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}