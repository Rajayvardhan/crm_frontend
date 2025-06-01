import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HeaderSection from "../../components/HeaderSection";
import { getEmployees, getLeaders, sendLetter } from "../../http";
import "react-datepicker/dist/react-datepicker.css";

// ========= TEMPLATE FUNCTIONS =========

const templates = {
  offer: ({ name, address, position, salary, ctc, startDate, manager }) => `
    <div style="font-family: Arial, sans-serif; padding: 30px; color: #000;">
      <p>Date: ${startDate}</p>
      <p> ${name},<br/>${address}</p>
      <p>Dear ${name},</p>
      <p>Congratulations!</p>
      <p>We are pleased to confirm that you have been selected to work for SEVENUNIQUE TECH SOLUTIONS PRIVATE LIMITED. We are delighted to make you the following job offer.</p>
      <p>The position we are offering you is that of <b>${position}</b> at a monthly salary of ₹${salary}/- with an annual CTC of ₹${ctc}. This position reports to Manager ${manager}. Your working hours will be from 9:40 to 6:30, Monday to Saturday.</p>
      <p>Benefits include:</p>
      <ul>
        <li>Casual Leave of 12 days per annum.</li>
        <li>Employer State Insurance Corporation (ESIC) Coverage.</li>
      </ul>
      <p>Please report to ${manager} on ${startDate} at 9:40 for documentation and orientation.</p>
      <p>Please sign and return this letter by 27 February 2025 to confirm acceptance.</p>
      <p>Sincerely,<br/>Bhavika Manghnani<br/>HR MANAGER<br/>SEVENUNIQUE TECH SOLUTIONS PVT LTD</p>
    </div>
  `,
  warning: ({ name, reason, date }) => `
    <div style="font-family: Arial, sans-serif; padding: 30px; color: #000;">
      <p>Date: ${date}</p>
      <p>To,<br/>${name}</p>
      <p>Subject: Warning Letter</p>
      <p>This letter is to inform you that your conduct/performance has not met the company’s expectations. Reason: <b>${reason}</b>.</p>
      <p>Please treat this as a formal warning. Continued issues may result in further disciplinary action.</p>
      <p>Regards,<br/>HR Department</p>
    </div>
  `,
  promotion: ({ name, newPosition, effectiveDate }) => `
    <div style="font-family: Arial, sans-serif; padding: 30px; color: #000;">
      <p>Dear ${name},</p>
      <p>We are pleased to inform you that you have been promoted to the position of <b>${newPosition}</b> effective from ${effectiveDate}.</p>
      <p>This promotion is a recognition of your performance and contribution to the organization.</p>
      <p>Regards,<br/>HR Department</p>
    </div>
  `,
  termination: ({ name, terminationDate }) => `
    <div style="font-family: Arial, sans-serif; padding: 30px; color: #000;">
      <p>Dear ${name},</p>
      <p>We regret to inform you that your employment with our company will be terminated effective from <b>${terminationDate}</b>.</p>
      <p>Please contact HR for exit formalities.</p>
      <p>Regards,<br/>HR Department</p>
    </div>
  `,
  notice: ({ name, noticeDate, reason }) => `
    <div style="font-family: Arial, sans-serif; padding: 30px; color: #000;">
      <p>Date: ${noticeDate}</p>
      <p>Dear ${name},</p>
      <p>This letter is to inform you that a notice has been issued regarding: <b>${reason}</b>.</p>
      <p>Please consider this as official notice from management.</p>
      <p>Regards,<br/>HR Department</p>
    </div>
  `,
};

// ========= MAIN COMPONENT ==========

const AssignLetter = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [letterType, setLetterType] = useState("offer");
  const [formData, setFormData] = useState({});
  const [downloadUrl, setDownloadUrl] = useState("");


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const emps = await getEmployees();
        const leaders = await getLeaders();
        setEmployees([...emps.data, ...leaders.data]);
      } catch (error) {
        toast.error("Error fetching employees");
      }
    };
    fetchEmployees();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getRequiredFields = () => {
    switch (letterType) {
      case "offer":
        return ["name", "address", "position", "salary", "ctc", "startDate", "manager"];
      case "warning":
        return ["name", "reason", "date"];
      case "promotion":
        return ["name", "newPosition", "effectiveDate"];
      case "termination":
        return ["name", "terminationDate"];
      case "notice":
        return ["name", "noticeDate", "reason"];
      default:
        return [];
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = getRequiredFields();
    for (const field of requiredFields) {
      if (!formData[field]) {
        return toast.error(`Please fill ${field} field`);
      }
    }

    const letterHTML = templates[letterType](formData);

    try {
      const res = await sendLetter({
        employeeID: selectedEmployee,
        letterHTML,
        letterType,
      });

      if (res.success) {
        toast.success("Letter sent successfully!");
        setFormData({});
        setSelectedEmployee("");

        setDownloadUrl(res.filePath)
      }
      
      
    } catch (err) {
      toast.error("Failed to send letter.");
    }
  };

  const renderFields = () => {
    const fields = getRequiredFields();
    return fields.map((field) => (
      <div key={field} className="form-group col-md-4">
        <label>{field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</label>
        <input
          className="form-control"
          type={field.toLowerCase().includes("date") ? "date" : "text"}
          value={formData[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          required
        />
      </div>
    ));
  };

  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title="Send Letter" />
        <div className="">
          <div className="card-body p-0">
            <form className="row" onSubmit={onSubmit}>
              {/* Employee Selection */}
              <div className="form-group col-md-4">
                <label>Select Employee</label>
                <select
                  className="form-control"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Choose Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Letter Type Selection */}
              <div className="form-group col-md-4">
                <label>Select Letter Type</label>
                <select
                  className="form-control"
                  value={letterType}
                  onChange={(e) => setLetterType(e.target.value)}
                >
                  <option value="offer">Offer</option>
                  <option value="promotion">Promotion</option>
                  <option value="warning">Warning</option>
                  <option value="termination">Termination</option>
                  <option value="notice">Notice</option>
                </select>
              </div>

              {/* Dynamic Fields */}
              {renderFields()}

              {/* Submit */}
              <div className="form-group col-md-4">
                <button className="btn btn-primary btn-lg px-3 py-2 rounded-sm" type="submit">
                  Send Letter
                </button>
                {downloadUrl && (
  <div className="mt-4">
    <a
      href={downloadUrl}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-success"
    >
      📥 Download Letter
    </a>
  </div>
)}

              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssignLetter;
