import { useEffect, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import api, { getCounts } from "../../http";
import { setCount } from "../../store/main-slice";
import CountsCard from "./CountsCard";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
const Admin = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const res = await getCounts();
      if (res.success) dispatch(setCount(res.data));
    })();
  }, []);

  const { counts } = useSelector((state) => state.mainSlice);
  const { admin, employee, leader, team } = counts;
  const [state, setState] = React.useState({
    series: [
      {
        name: "Present",
        data: [25, 28, 22, 30, 27, 26, 29],
      },
      {
        name: "Absent",
        data: [5, 2, 8, 0, 3, 4, 1],
      },
    ],
    options: {
      chart: {
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      title: {
        text: "Weekly Attendance Report",
        align: "left",
      },
      yaxis: {
        title: {
          text: "Number of Employees",
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} employees`,
        },
      },
    },
  });

  const developerTasks = [
    {
      time: "09:00 am",
      color: "primary",
      description: (
        <>
          <p style={{ fontSize: "12px", fontWeight: "600" }} className="mb-0">
            Commit pushed
          </p>
        </>
      ),
    },
    {
      time: "10:30 am",
      color: "success",
      description: (
        <>
          <p style={{ fontSize: "12px", fontWeight: "600" }} className="mb-0">
            Deployed to staging
          </p>
        </>
      ),
    },
    {
      time: "12:15 pm",
      color: "warning",
      description: (
        <>
          <p style={{ fontSize: "12px", fontWeight: "600" }} className="mb-0">
            Bug fixed
          </p>
        </>
      ),
    },
    {
      time: "02:00 pm",
      color: "info",
      description: (
        <>
          <p style={{ fontSize: "12px", fontWeight: "600" }} className="mb-0">
            Code reviewed
          </p>
        </>
      ),
    },
    {
      time: "03:45 pm",
      color: "danger",
      description: (
        <>
          <p style={{ fontSize: "12px", fontWeight: "600" }} className="mb-0">
            Rollback performed
          </p>
        </>
      ),
    },
  ];
  // 1. Declare employees FIRST

  const [birthdaysToday, setBirthdaysToday] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("http://localhost:5500/api/task/todayevents?type=birthday") // <-- API endpoint
      .then((res) => {
        setBirthdaysToday(res.data); // 👈 make sure 'users' match backend response
      })
      .catch((err) => {
        console.error("Error fetching birthday data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const [showAnimation, setShowAnimation] = useState(true); // start with animation visible

  useEffect(() => {
    if (showAnimation && birthdaysToday?.data) {
      const timer = setTimeout(() => {
        setShowAnimation(false); // close after 5 seconds
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation, birthdaysToday]);
  
  

  console.log("testing", birthdaysToday.data);

  const holidays = [
    {
      title: "Diwali",
      date: "02-12-2023",
      duration: "7 Days only",
      icon: "./assets/icons/diwali.png",
    },
    {
      title: "Christmas",
      date: "25-12-2023",
      duration: "1 Day only",
      icon: "./assets/icons/diwali.png",
    },
    {
      title: "New Year",
      date: "01-01-2024",
      duration: "1 Day only",
      icon: "./assets/icons/diwali.png",
    },
    {
      title: "Holi",
      date: "14-03-2025",
      duration: "2 Days only",
      icon: "./assets/icons/bucket.png",
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-xl-4">
          <div className="card cardborder overflow-hidden p-0 rounded-3 ">
            <div className="bg-primary-subtle">
              <div className="row">
                <div className="col-7">
                  <div className="text-primary p-3">
                    <h5 className="text-primary">Welcome Back !</h5>
                    <p>Developer Dashboard</p>
                  </div>
                </div>
                <div className="col-5 align-self-end">
                  <img
                    src="./assets/icons/undraw_hello_ccwj.svg"
                    alt="Profile"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>

            <div className="card-body pt-0">
              <div className="row">
                <div className="col-sm-5">
                  <div className="avatar-md profile-user-wid mb-4">
                    <img
                      src="./assets/icons/user-1.jpg"
                      alt="User Avatar"
                      className="img-thumbnail rounded-circle"
                    />
                  </div>
                  <h5
                    className="font-size-15 text-truncate mb-0"
                    style={{ fontSize: "16px" }}
                  >
                    John Deo
                  </h5>
                  <p
                    className="text-muted mb-0 text-truncate"
                    style={{ fontSize: "14px" }}
                  >
                    UI/UX Designer
                  </p>
                </div>

                <div className="col-sm-7">
                  <div className="pt-4">
                    <div className="row">
                      <div className="col-12">
                        <h5
                          className="font-size-15 mb-0"
                          style={{ fontSize: "14px" }}
                        >
                          Contact
                        </h5>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "13px" }}
                        >
                          john.smith@company.com
                        </p>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "13px" }}
                        >
                          +91 2837 283793
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <CountsCard title="Total Employees" icon="fa-user" count={employee} />
          <CountsCard title="Total Leaders" icon="fa-user" count={leader} />
          {/* <div
            class="rounded-3 p-2 shadow-sm d-flex flex-column justify-content-between"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div class="d-flex bg-white p-3 rounded-3 position-relative">
              <div
                class="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: "32px", height: "32px" }}
              >
                <i class="bi bi-person-fill"></i>
              </div>
              <div className="ms-2 ">
                <span
                  class="text-muted small fw-medium"
                  style={{ fontSize: "19px" }}
                >
                  Total Employe
                </span>
                <p class="fw-bold text-dark mb-0">30</p>
              </div>
              <div class="d-flex align-items-center text-success small" style={{position:"absolute",right:"10px", bottom:"10px"}}>
                <i class="fas fa-arrow-up me-1"></i>
                <span class="fw-semibold">2.5%</span>
                <span class="ms-1 text-muted fw-normal">vs last month</span>
              </div>
            </div>
          </div> */}
        </div>
        <div className="col-xl-4">
          <CountsCard title="Total Admins" icon="fa-user" count={admin} />
          <CountsCard title="Total Team Department" icon="fa-user" count={team} />
        </div>
      </div>
      
      <div className="row mb-3">
        {/* <div className="col-md-4">
          <div className="card timeline-card shadow-sm rounded-0">
            <div className="card-body">
              <h5 className="card-title mb-4">Developer Recent Tasks</h5>
              <ul className="timeline-widget mb-0 position-relative mb-n5 ps-0">
                {developerTasks.map((task, index) => (
                  <li
                    key={index}
                    className="timeline-item d-flex position-relative overflow-hidden"
                  >
                    <div className="timeline-time text-dark flex-shrink-0 text-end" style={{ width: '69px',  }}>
                      {task.time}
                    </div>
                    <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                      <span className={`timeline-badge border border-${task.color} flex-shrink-0`} style={{ width: '12px', height: '12px', borderRadius: '50%' }}></span>
                      {index !== developerTasks.length - 1 && (
                        <span className="timeline-badge-border d-block flex-shrink-0" style={{ width: '2px', backgroundColor: '#dee2e6', height: '100%' }}></span>
                      )}
                    </div>
                    <div className="timeline-desc text-dark mt-n1 flex-grow-1" style={{height:"fit-content"}}>{task.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div> */}
        {/* Holiday Section */}
        <div className="col-md-6">
          <div className="card cardborder rounded-4">
            <div class="employees-card">
              <h2 class="employees-title d-flex align-items-center">
                {" "}
                <img
                  src="./assets/icons/sunbed.png"
                  alt="holiday"
                  class="me-3"
                  width="40"
                  height="40"
                  style={{ objectFit: "cover" }}
                />
                Company holiday
              </h2>

              {holidays.map((holiday, index) => (
                <div
                  key={index}
                  className={`d-flex justify-content-between align-items-center ${
                    index !== holidays.length - 1
                      ? "border-bottom pb-3 mb-3"
                      : "pt-2"
                  }`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={holiday.icon}
                      alt={holiday.title}
                      className={
                        holiday.title === "Holi"
                          ? "rounded-circle"
                          : "img-fluid"
                      }
                      width="40"
                      height="40"
                      style={{ objectFit: "cover" }}
                    />
                    <div>
                      <p
                        className="mb-0 employee-name"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {holiday.title}
                      </p>
                      <p
                        className="mb-0 employee-desc"
                        style={{
                          fontSize: "0.75rem",
                          whiteSpace: "normal",
                          maxWidth: "none",
                        }}
                      >
                        {holiday.date}
                      </p>
                    </div>
                  </div>
                  <p className="red-text mb-0">{holiday.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Birthday Section */}
        <div className="col-md-6">
  

          <div>
 
          {showAnimation && birthdaysToday.data && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 9999,
    }}
  >
    <iframe
      src="https://lottie.host/embed/2d8d036d-43ea-4820-9f17-b6631846aed5/uqTlmKSbkU.lottie"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
      title="Birthday Animation"
      allowFullScreen
    ></iframe>
    <audio src="./assets/icons/cl.mp3" autoPlay />
  </div>
)}


            <div className="cardborder p-3 mb-3 rounded-4">
              {loading ? (
                <p>Loading...</p>
              ) : birthdaysToday?.data ? (
                
                birthdaysToday.data?.map((employee, index) => (

                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center birthday-card mb-4 "
                    style={{
                      backgroundImage:
                        "url(./assets/icons/freepik__adjust__63979.png)",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={`https://storage.googleapis.com/a1aa/image/c2bd0146-dff9-4b60-9b6e-215fbdd1dfa5.jpg`} // 👈 Adjust this path if needed
                        alt={employee.name}
                        className="rounded-circle"
                        width="48"
                        height="48"
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <p className="mb-0 employee-name">{employee.name}</p>
                        <p className="mb-0 employee-desc">
                          Has birthday today.
                        </p>
                        <p className="mb-0 employee-desc">{employee.quote}</p>
                        {/* <p className="mb-0 employee-desc">{employee.dob}</p> */}
                      </div>
                    </div>
               
          
          
                  </div>
                  
                ))
              ) : (
                <div className="text-center mb-4 cardborder rounded-4 p-4 h-100">
                  <img
                    src="https://example.com/alex.jpg"
                    alt="No birthdays today"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  <p className="mt-2 text-muted">No birthdays today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div id="chart" className="rounded-4">
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="line"
              height={350}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
