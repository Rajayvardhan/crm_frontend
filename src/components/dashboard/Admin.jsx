import { useEffect, useState } from "react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import api, { getCounts } from "../../http";
import { setCount } from "../../store/main-slice";
import CountsCard from "./CountsCard";
import ReactApexChart from "react-apexcharts";

const Admin = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const res = await getCounts();
      if (res.success) dispatch(setCount(res.data));
    })();
  }, [dispatch]);

  const { counts } = useSelector((state) => state.mainSlice);
  const { admin = 0, employee = 0, leader = 0, team = 0 } = counts || {};

  const [state, setState] = useState({
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
      chart: { type: "line", zoom: { enabled: false } },
      stroke: { curve: "smooth" },
      xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      title: { text: "Weekly Attendance Report", align: "left" },
      yaxis: { title: { text: "Number of Employees" } },
      tooltip: { y: { formatter: (val) => `${val} employees` } },
    },
  });

  const [birthdaysToday, setBirthdaysToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    api
      .get("http://localhost:5500/api/task/todayevents?type=birthday")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setBirthdaysToday(res.data);
          setShowAnimation(true);
        } else {
          setBirthdaysToday([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching birthday data:", err);
        setBirthdaysToday([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setShowAnimation(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  const holidays = [
    { title: "Diwali", date: "02-12-2023", duration: "7 Days only", icon: "./assets/icons/diwali.png" },
    { title: "Christmas", date: "25-12-2023", duration: "1 Day only", icon: "./assets/icons/diwali.png" },
    { title: "New Year", date: "01-01-2024", duration: "1 Day only", icon: "./assets/icons/diwali.png" },
    { title: "Holi", date: "14-03-2025", duration: "2 Days only", icon: "./assets/icons/bucket.png" },
  ];

  return (
    <>
      <div className="row">
        <div className="col-xl-4">
          <CountsCard title="Total Employees" icon="fa-user" count={employee} />
          <CountsCard title="Total Leaders" icon="fa-user" count={leader} />
        </div>
        <div className="col-xl-4">
          <CountsCard title="Total Admins" icon="fa-user" count={admin} />
          <CountsCard title="Total Team Department" icon="fa-user" count={team} />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <div className="card cardborder rounded-4">
            <div className="employees-card">
              <h2 className="employees-title d-flex align-items-center">
                <img src="./assets/icons/sunbed.png" alt="holiday" className="me-3" width="40" height="40" />
                Company holiday
              </h2>
              {holidays.map((holiday, index) => (
                <div key={index} className={`d-flex justify-content-between align-items-center ${index !== holidays.length - 1 ? "border-bottom pb-3 mb-3" : "pt-2"}`}>
                  <div className="d-flex align-items-center gap-3">
                    <img src={holiday.icon} alt={holiday.title} className={holiday.title === "Holi" ? "rounded-circle" : "img-fluid"} width="40" height="40" />
                    <div>
                      <p className="mb-0 employee-name" style={{ fontSize: "0.875rem" }}>{holiday.title}</p>
                      <p className="mb-0 employee-desc" style={{ fontSize: "0.75rem" }}>{holiday.date}</p>
                    </div>
                  </div>
                  <p className="red-text mb-0">{holiday.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          {showAnimation && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9999 }}>
              <iframe
                src="https://lottie.host/embed/2d8d036d-43ea-4820-9f17-b6631846aed5/uqTlmKSbkU.lottie"
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Birthday Animation"
                allowFullScreen
              ></iframe>
            <audio src="./assets/icons/cl.mp3" autoPlay muted id="birthday-audio"></audio>
            </div>
          )}

          <div className="cardborder p-3 mb-3 rounded-4">
            {loading ? (
              <p>Loading...</p>
            ) : birthdaysToday.length > 0 ? (
              birthdaysToday.map((employee, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between align-items-center birthday-card mb-4"
                  style={{
                    backgroundImage: "url(./assets/icons/freepik__adjust__63979.png)",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src="https://storage.googleapis.com/a1aa/image/c2bd0146-dff9-4b60-9b6e-215fbdd1dfa5.jpg"
                      alt={employee.name}
                      className="rounded-circle"
                      width="48"
                      height="48"
                      style={{ objectFit: "cover" }}
                    />
                    <div>
                      <p className="mb-0 employee-name">{employee.name}</p>
                      <p className="mb-0 employee-desc">Has birthday today.</p>
                      <p className="mb-0 employee-desc">{employee.quote}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mb-4 cardborder rounded-4 p-4 h-100 d-flex flex-column align-items-center justify-content-center">
                <img
                  src="https://www.shutterstock.com/shutterstock/photos/1689399112/display_1500/stock-vector-sad-unhappy-mouth-frown-face-with-simple-shadows-and-highlights-authentic-negative-circle-template-1689399112.jpg"
                  alt="No Birthdays"
                  width="250"
                  height="200"
                  className="mb-3"
                  style={{ opacity: 0.8, borderRadius: "40%" }}
                />
                <h5 className="text-primary mb-2">No Birthdays Today 🎉</h5>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                  Celebrate your team’s hard work and wins today!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div id="chart" className="rounded-4">
            <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
