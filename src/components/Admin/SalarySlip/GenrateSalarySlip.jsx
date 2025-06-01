// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import HeaderSection from "../../HeaderSection";
// import { assignSalary, getEmployees, getLeaders } from "../../../http";
// import axios from "axios";

// const GenrateSalarySlip = () => {
//   const [selectedEmployee, setSelectedEmployee] = useState('');
//   const [employees, setEmployees] = useState([]);
//   const [month, setMonth] = useState('');
//   const [year, setYear] = useState('');
//   const [fileUrl, setFileUrl] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchAllEmployees = async () => {
//       try {
//         const emps = await getEmployees();
//         const leaders = await getLeaders();
//         setEmployees([...emps.data, ...leaders.data]);
//       } catch (err) {
//         toast.error("Failed to fetch employees");
//       }
//     };
//     fetchAllEmployees();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedEmployee || !month || !year) {
//       return toast.error("All fields are required");
//     }

//     setLoading(true);
//     setFileUrl('');

//     try {
//       const res = await axios.post("http://localhost:5500/api/admin/genrate-salary-slip", {
//         employeeID: selectedEmployee,
//         month,
//         year,
//       },{
//         withCredentials: true, // this sends cookies like accessToken
//       });

//       if (res.data.success) {
//         setFileUrl(res.data.file);
//         toast.success("Salary slip generated!");
//       } else {
//         toast.error("Error generating salary slip");
//       }
//     } catch (error) {
//       toast.error("Server error while generating salary slip");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div className="main-content">
//       <section className="section">
//         <HeaderSection title="Generate Salary Slip" />
//         <div className="card">
//           <div className="card-body pr-5 pl-5 m-1">
//             <form className="row" onSubmit={handleSubmit}>

//               <div className="form-group col-md-4">
//                 <label>Employees</label>
//                 <select
//   className="form-control select2"
//   value={selectedEmployee}
//   onChange={(e) => setSelectedEmployee(e.target.value)}
//   required
// >
//   <option value="">Select Employee</option>
//   {employees.map((emp) => (
//     <option key={emp.id} value={emp.id}>
//       {emp.name}
//     </option>
//   ))}
// </select>

//               </div>

//               <div className="form-group col-md-4">
//                 <label>Month & Year</label>
//                 <input
//                   type="month"
//                   className="form-control"
//                   onChange={(e) => {
//                     const [y, m] = e.target.value.split("-");
//                     setMonth(m);
//                     setYear(y);
//                   }}
//                   required
//                 />
//               </div>

//               <div className="form-group col-md-12 text-center">
//                 <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
//                   {loading ? "Generating..." : "Generate Slip"}
//                 </button>
//               </div>
//             </form>

//             {fileUrl && (
//               <div className="mt-4 text-center">
//                 <h5>Download Salary Slip:</h5>
//                 <a className="btn btn-success" href={fileUrl} target="_blank" rel="noopener noreferrer">
//                   Download PDF
//                 </a>
//               </div>
//             )}

//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default GenrateSalarySlip;
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HeaderSection from "../../HeaderSection";
import api, { assignSalary, getEmployees, getLeaders } from "../../../http";
import axios from "axios";

const GenrateSalarySlip = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employees, setEmployees] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState(null);

  const [grossSalary, setGrossSalary] = useState("");
  const [earnedSalary, setEarnedSalary] = useState("");
  const [leaveDeduction, setLeaveDeduction] = useState("");
  const [pf, setPf] = useState("");
  const [esi, setEsi] = useState("");
  const [companyPf, setCompanyPf] = useState("");
  const [companyEsi, setCompanyEsi] = useState("");
  const [totalDeduction, setTotalDeduction] = useState("");
  const [netPay, setNetPay] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const emps = await getEmployees();
        const leaders = await getLeaders();
        setEmployees([...emps.data, ...leaders.data]);
      } catch (err) {
        toast.error("Failed to fetch employees");
      }
    };
    fetchAllEmployees();
  }, []);

  const fetchAttendance = async (empId, fullMonth) => {
    try {
      const res = await api.post("/task/attendance-report", {
        employeeId: empId,
        month: fullMonth
      },);
       console.log(res);
       
      setAttendance(res);
    } catch (err) {
      toast.error("Failed to fetch attendance");
      setAttendance(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/admin/genrate-salary-slip", {
        employeeID: selectedEmployee,
        month,
        year,
        grossSalary,
        presentDays: attendance?.presentDays || 0,
        halfDays: attendance?.halfDays || 0,
        absentDays: attendance?.absentDays || 0,
        earnedSalary,
        leaveDeduction,
        pf,
        esi,
        companyPf,
        companyEsi,
        totalDeduction,
        netPay,
      },);

      console.log("fdgdds",res);
      const fileUrl=res.file;
       // You can either open the file in a new tab or display a success message
    if (fileUrl) {
      // Open the file URL in a new tab (instead of redirecting)
      window.open(fileUrl, '_blank');
    }
      
      setFileUrl(res.data.file);

      alert("Salary slip generated successfully");
    } catch (error) {
      console.error("Error generating salary slip:", error);
      
    }
  };

  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title="Generate Salary Slip" />
        <div className="card">
          <div className="card-body pr-5 pl-5 m-1">
            <form className="row" onSubmit={handleSubmit}>

              <div className="form-group col-md-4">
                <label>Employees</label>
                <select
                  className="form-control select2"
                  value={selectedEmployee}
                  onChange={(e) => {
                    const empId = e.target.value;
                    setSelectedEmployee(empId);
                    if (month && year) {
                      fetchAttendance(empId, `${year}-${month}`);
                    }
                  }}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group col-md-4">
                <label>Month & Year</label>
                <input
                  type="month"
                  className="form-control"
                  onChange={(e) => {
                    const [y, m] = e.target.value.split("-");
                    setMonth(m);
                    setYear(y);
                    if (selectedEmployee) {
                      fetchAttendance(selectedEmployee, `${y}-${m}`);
                    }
                  }}
                  required
                />
              </div>

              {attendance && (
                <>
                <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label>Present Days</label>
                  <input type="number" className="form-control" value={attendance?.presentDays || 0} readOnly />
                </div>
              </div>
      
              <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label>Half Days</label>
                  <input type="number" className="form-control" value={attendance?.halfDays || 0} readOnly />
                </div>
              </div>
      
              <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label>Absent Days</label>
                  <input type="number" className="form-control" value={attendance?.absentDays || 0} readOnly />
                </div>
              </div>
              <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label> Gross Salary</label>
                  <input type="number" className="form-control" value={attendance?.grossSalary || 0} readOnly />
                </div>
              </div>
      
             
      
              <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label>Earned Salary</label>
                  <input type="number" className="form-control" value={earnedSalary} onChange={(e) => setEarnedSalary(e.target.value)} required />
                </div>
              </div>
      
              <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label>Leave Deduction</label>
                  <input type="number" className="form-control" value={leaveDeduction} onChange={(e) => setLeaveDeduction(e.target.value)} required />
                </div>
              </div>
      
              <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label>PF</label>
                  <input type="number" className="form-control" value={pf} onChange={(e) => setPf(e.target.value)} required />
                </div>
              </div>
      
              <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label>ESI</label>
                  <input type="number" className="form-control" value={esi} onChange={(e) => setEsi(e.target.value)} required />
                </div>
              </div>
      
              <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label>Company PF</label>
                  <input type="number" className="form-control" value={companyPf} onChange={(e) => setCompanyPf(e.target.value)} required />
                </div>
              </div>
      
              <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label>Company ESI</label>
                  <input type="number" className="form-control" value={companyEsi} onChange={(e) => setCompanyEsi(e.target.value)} required />
                </div>
              </div>
      
              <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label>Total Deduction</label>
                  <input type="number" className="form-control" value={totalDeduction} onChange={(e) => setTotalDeduction(e.target.value)} required />
                </div>
              </div>
      
              <div className="form-group col-md-4 mb-3">
                <div className="card p-3">
                  <label>Net Pay</label>
                  <input type="number" className="form-control" value={netPay} onChange={(e) => setNetPay(e.target.value)} required />
                </div>
              </div>
              </>
      
              )}

              <div className="form-group col-md-12 text-center mt-4">
                <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
                  {loading ? "Generating..." : "Generate Slip"}
                </button>
              </div>
            </form>

            {fileUrl && (
              <div className="mt-4 text-center">
                <h5>Download Salary Slip:</h5>
                <a className="btn btn-success" href={`http://localhost:5500/${fileUrl}`} target="_blank" rel="noopener noreferrer">
                  Download PDF
                </a>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default GenrateSalarySlip;
