import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import api from "../../http";

const Leader = () => {
  const {user} = useSelector(state=>state.authSlice);
  const [meetingsToday, setMeetingsToday] = useState([]); // Store today's meetings
  const [loading, setLoading] = useState(true); // Handle loading state

  // Existing Employee & Holiday data
  const employees = [
    {
      name: "Jennie Duncan",
      image:
        "https://storage.googleapis.com/a1aa/image/c2bd0146-dff9-4b60-9b6e-215fbdd1dfa5.jpg",
      dob: "1995-05-05",
    },
    {
      name: "Alex Carter",
      image: "https://example.com/alex.jpg",
      dob: "1990-11-23",
    },
  ];

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

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  const birthdaysToday = employees.filter((emp) => {
    const dob = new Date(emp.dob);
    return dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDate;
  });

  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    if (birthdaysToday?.length > 0) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setShowAnimation(false);
    }
  }, [birthdaysToday]);

  // Fetch Today's Meetings
  useEffect(() => {
    const fetchMeetingsForToday = async () => {
      try {
        const response = await api.get(
          `http://localhost:5500/api/task/meetings/today/${user.id}`
        );
        setMeetingsToday(response.data); // Set the fetched meetings in the state
      } catch (error) {
        console.error("Error fetching today's meetings:", error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    console.log("jdjjdjfkdjfkdjfkdjfkjdkjfjdfjkdjfkkd")
    console.log(user)

    if (user || user.id) {
      fetchMeetingsForToday();
    }
  }, [user]); // Depend on `user` to refetch if it changes

  return (
    <>
      <div className="row">
        {/* <section className="section">
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h4>Welcome {user?.name}</h4>
            </div>
          </div>

          <div className="card">
            <div className="card-body row">
              <div className="col-md-3 ">
                <img className="img-fluid img-thumbnail" src={user.image} alt="" />
              </div>
              <div className="col-md-9">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <td>{user.name}</td>
                    </tr>
                    <tr>
                      <th>Username</th>
                      <td>{user.username}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{user.email}</td>
                    </tr>
                    <tr>
                      <th>Usertype</th>
                      <td>{user.type}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>{user.status}</td>
                    </tr>
                    <tr>
                      <th>Mobile</th>
                      <td>{user.mobile}</td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <td>{user.address}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section> */}

        <div className="col-xl-4">
          <div className="card cardborder overflow-hidden p-0 rounded-3 ">
            <div className="bg-primary-subtle">
              <div className="row">
                <div className="col-7">
                  <div className="text-primary p-3">
                    <h5 className="text-primary">Welcome Back !</h5>
                    <p>{user?.name}</p>
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

            <div className="card-body pt-0" style={{paddingBottom:"185px"}}>
              <div className="row">
                <div className="col-sm-5">
                  <div className="avatar-md profile-user-wid mb-4 position-relative">
                    <img
                      src="./assets/icons/user-1.jpg"
                      alt="User Avatar"
                      className="img-thumbnail rounded-circle"
                    />
                    <span
                      className="activedot"
                      style={{
                        backgroundColor: "#65d500",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        display: "inline-block",
                        position: "absolute",
                        bottom: "3px",
                        right: "12px",
                      }}
                    ></span>
                  </div>
                  <h5
                    className="font-size-15 text-truncate mb-0"
                    style={{ fontSize: "16px" }}
                  >
                    {user.username}
                  </h5>
                  <p
                    className="text-muted mb-0 text-truncate"
                    style={{ fontSize: "14px" }}
                  >
                    {user.type}
                  </p>
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
                          {user.email}
                        </p>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "13px" }}
                        >
                          {user.mobile}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Holidays Section */}
        <div className="col-md-8">
          <div className="card cardborder rounded-4">
            <div className="employees-card">
              <h2 className="employees-title d-flex align-items-center">
                {" "}
                <img
                  src="./assets/icons/sunbed.png"
                  alt="holiday"
                  className="me-3"
                  width="40"
                  height="40"
                  style={{ objectFit: "cover" }}
                />
                Company holiday
              </h2>

              {holidays?.map((holiday, index) => (
                <div
                  key={index}
                  className={`d-flex justify-content-between align-items-center ${
                    index !== holidays?.length - 1
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

       
      </div>
       {/* Meetings Section */}
       <div className="col-md-8">
          <div className="card cardborder rounded-4">
            <h5 className="card-header">Today's Meetings</h5>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Venue</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : meetingsToday?.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No meetings scheduled for today.
                        </td>
                      </tr>
                    ) : (
                      meetingsToday?.map((meeting, index) => (
                        <tr key={index} className="text-danger">
                          <td className="text-danger">{meeting.title}</td>
                          <td className="text-danger">{new Date(meeting.startDate).toLocaleString()}</td>
                          <td className="text-danger">{new Date(meeting.endDate).toLocaleString()}</td>
                          <td className="text-danger">{meeting.venue}</td>
                          <td className="text-danger">{meeting.location}</td>
                          <td className="text-danger">{meeting.dealId.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
    </>
  );
};

export default Leader;
