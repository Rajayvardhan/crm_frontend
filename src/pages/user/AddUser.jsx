import { useState } from "react";
import { toast } from "react-toastify";
import HeaderSection from "../../components/HeaderSection";
import { addUser } from "../../http";
import Modal from "../../components/modal/Modal";

const AddUser = () => {
  const [imagePreview, setImagePreview] = useState("/assets/icons/user.png");
  const initialState = {
    name: "",
    email: "",
    mobile: "",
    password: "",
    type: "Employee",
    profile: "",
    
    desgination: "",
    account_number: "",
    ifsc: "",
    bank_name: "",
    father_name: "",
    mother_name: "",
    current_address: "",
    permanent_address: "",
    status: "",
    branch: "",
    gender: "",
    DOB: "",
    Un_no:"",
    Esi_no:"",
    alternate_number: "",
    DOJ: "",
    experience: "" ,
    total_experience: "",
    company_name: "",
    reason_of_leaving: "",
    nominee_name: "",
    nominee_relation: "",
    nominee_address: "",
    nominee_mobile: "",
    nominee_age: "",
    employee_adhar_image: "",
    employee_pan_image: "",
    tenth_marksheet_img: "",
    twelth_marksheet_img: "",
    mother_adhar_image: "",
    father_adhar_image: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [showModal, setShowModal] = useState(false);

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormData((old) => ({
      ...old,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      mobile,
      password,
      type,
      status,
      current_address,
      permanent_address,
      desgination,
      account_number,
      ifsc,
      bank_name,
      branch,
      father_name,
      mother_name,
      alternate_number,
      DOB,
      DOJ,
      Esi_no,
      Un_no,
      experience,
      total_experience,
      company_name,
      reason_of_leaving,
      nominee_name,
      nominee_relation,
      nominee_mobile,
      nominee_address,
      nominee_age,
      profile,
    } = formData;
    if (
      !name ||
      !email ||
      !mobile ||
      !password ||
      !type ||
      !status ||
      !current_address ||
      !permanent_address ||
      !desgination ||
      !account_number ||
      !ifsc ||
      !bank_name ||
      !branch ||
      !father_name ||
      !mother_name ||
      !alternate_number ||
      !DOB ||
      !DOJ ||
      !experience ||
     !Un_no ||
     !Esi_no ||
      !nominee_name ||
      !nominee_relation ||
      !nominee_mobile ||
      !nominee_address ||
      !nominee_age
    )
      return toast.error("All Field Required");
    if (!profile) return toast.error("Please choose profile image");

    if (type === "Admin" && !showModal) {
      setShowModal(true);
      return;
    }

    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      fd.append(key, formData[key]);
    });

    const { success, message } = await addUser(fd);
    if (success) {
      toast.success(message);
      setShowModal(false);
      setFormData({ ...initialState });
      setImagePreview("/assets/icons/user.png");
    }
  };

  const captureImage = (e) => {
    const file = e.target.files[0];
    setFormData((old) => ({
      ...old,
      profile: file,
    }));
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const captureFile = (e) => {
    const { name, files } = e.target;
    setFormData((old) => ({
      ...old,
      [name]: files[0],
    }));
  };

  const modalAction = () => setShowModal(!showModal);

  return (
    <>
      {showModal && (
        <Modal close={modalAction} title="Add Admin" width="35%">
          <div className="row" style={{ margin: "20px" }}>
            <div className="col col-md-4 text-center">
              <img className="rounded" src={imagePreview} width="120" alt="" />
            </div>
            <div className="col col-md-8">
              <table className="table table-md">
                <tr>
                  <th>Name</th>
                  <td>{formData.name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{formData.email}</td>
                </tr>
                <tr>
                  <th>User Type</th>
                  <td>{formData.type}</td>
                </tr>
              </table>
            </div>
          </div>
          <div className="form-group col-md-12">
            <label>Enter Your Password</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="fas fa-lock"></i>
                </div>
              </div>
              <input
                onChange={inputEvent}
                value={formData.adminPassword}
                type="password"
                placeholder={`Enter Password To Add ${formData.name} As Admin`}
                id="adminPassword"
                name="adminPassword"
                className="form-control"
              />
            </div>
          </div>
          <div className="justify-content-center text-center mb-3">
            <button
              className="btn btn-primary btn-lg"
              type="submit"
              form="addUserForm"
              style={{ width: "30vh" }}
            >
              Add {formData.type}
            </button>
          </div>
        </Modal>
      )}

      <div className="main-content">
        <section className="section">
          <HeaderSection title="Add User" />
          <div className="">
            <div className="card-body">
              <form className="row" onSubmit={onSubmit} id="addUserForm">
                <div className="form-group col-md-12 text-center">
                  <div className="input-group justify-content-center">
                    <input
                      type="file"
                      id="profile"
                      name="image"
                      className="form-control d-none"
                      onChange={captureImage}
                      accept="image/*"
                    />
                    <label htmlFor="profile">
                      <img
                        className="rounded"
                        src={imagePreview}
                        width="120"
                        alt=""
                      />
                    </label>
                  </div>
                </div>

                <hr className="my-3" style={{ borderColor: "#000" }} />
                {/* 👇 Extra Fields Added */}
                <h4
                  className="fw-bold d-flex align-items-center mb-3"
                  style={{ color: "#000", fontSize: "16px" }}
                >
                  <i class="fas fa-list me-2 "></i>User Details
                </h4>

                {/* Existing Input Fields */}
                <div className="form-group col-md-4">
                  <label>Enter Name</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.name}
                      type="text"
                      name="name"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>Enter Mobile Number</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-phone"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.mobile}
                      type="number"
                      name="mobile"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label>Gender</label>
                  <select
                    name="gender"
                    onChange={inputEvent}
                    value={formData.gender}
                    className="form-control select2"
                  >
                    <option>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label>Select DOB</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-calender"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.DOB}
                      type="date"
                      name="DOB"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label>Father name</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.father_name}
                      type="text"
                      name="father_name"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label>Mother name</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.mother_name}
                      type="text"
                      name="mother_name"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>Enter Email</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.email}
                      type="email"
                      name="email"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label>Alternate number</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-phone"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.alternate_number}
                      type="number"
                      name="alternate_number"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>Enter Password</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.password}
                      type="password"
                      name="password"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>User Type</label>
                  <select
                    name="type"
                    onChange={inputEvent}
                    value={formData.type}
                    className="form-control select2"
                  >
                    <option>Employee</option>
                    <option>Leader</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label>Select DOJ</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-calender"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.DOJ}
                      type="date"
                      name="DOJ"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label>Designation</label>
                  <input
                    onChange={inputEvent}
                    value={formData.desgination}
                    name="desgination"
                    type="text"
                    className="form-control"
                  />
                </div>

                <div className="form-group col-md-4">
                  <label>Account Number</label>
                  <input
                    onChange={inputEvent}
                    value={formData.account_number}
                    name="account_number"
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Ifsc Code</label>
                  <input
                    onChange={inputEvent}
                    value={formData.ifsc}
                    name="ifsc"
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Bank Name</label>
                  <input
                    onChange={inputEvent}
                    value={formData.bank_name}
                    name="bank_name"
                    type="text"
                    className="form-control"
                  />
                </div>

                <div className="form-group col-md-4">
                  <label>Current Address</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.current_address}
                      type="text"
                      name="current_address"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label>Permanent Address</label>
                  <input
                    onChange={inputEvent}
                    value={formData.permanent_address}
                    name="permanent_address"
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Status</label>
                  <select
                    name="status"
                    onChange={inputEvent}
                    value={formData.status}
                    className="form-control select2"
                  >
                    <option value='active'>active</option>
                    <option value='banned'>banned</option>
                    <option value="notice">notice</option>
                    <option value="provison">provison</option>
                  </select>
                </div>
                <div className="form-group col-md-3">
                  <label>Pf UnNumber</label>
                  <input
                    onChange={inputEvent}
                    value={formData.Un_no}
                    name="Un_no"
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-3">
                  <label>Esi Number</label>
                  <input
                    onChange={inputEvent}
                    value={formData.Esi_no}
                    name="Esi_no"
                    type="number"
                    className="form-control"
                  />
                </div>
               
                <div className="form-group col-md-3">
                  <label>Department</label>
                  <select
                    name="branch"
                    onChange={inputEvent}
                    value={formData.branch}
                    className="form-control select2"
                  >
                    <option value=""> Select Branch</option>
                    <option value="tech">Tech</option>
                    <option value="sales">Sales</option>
                    <option value="telecaller">Telecaller</option>
                    <option value="hr">Hr</option>
                  </select>
                </div>

                <div className="form-group col-md-3">
                  <label>Select Experience</label>
                  <select
                    name="experience"
                    onChange={inputEvent}
                    value={formData.experience}
                    className="form-control select2"
                  >
                    <option value="">Select Experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Experiance">Experiance</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>

                {/* Conditional Fields for Experience */}
                {formData.experience === "Experiance" && (
                  <>
                    <div className="form-group col-md-4">
                      <label>Company Name</label>
                      <input
                        type="text"
                        name="company_name"
                        className="form-control"
                        value={formData.company_name}
                        onChange={inputEvent}
                        placeholder="Enter Company Name"
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label>Total Experience</label>
                      <input
                        type="text"
                        name="total_experience"
                        className="form-control"
                        value={formData.total_experience}
                        onChange={inputEvent}
                        placeholder="e.g. 2 Years"
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label>Reason for Leaving</label>
                      <input
                        type="text"
                        name="reason_of_leaving"
                        className="form-control"
                        value={formData.reason_of_leaving}
                        onChange={inputEvent}
                        placeholder="Reason for leaving previous company"
                      />
                    </div>
                  </>
                )}
                <hr className="my-3" style={{ borderColor: "#000" }} />
                {/* 👇 Extra Fields Added */}
                <h4 className="fw-bold d-flex align-items-center mb-3" style={{color:"#000", fontSize:"16px"}}>
                  <i class="fas fa-user me-2 "></i>Nominee Details
                </h4>

                <div className="form-group col-md-4">
                  <label>Nominee Name</label>
                  <input
                    onChange={inputEvent}
                    value={formData.nominee_name}
                    name="nominee_name"
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Nominee Relation</label>
                  <input
                    onChange={inputEvent}
                    value={formData.nominee_relation}
                    name="nominee_relation"
                    type="text"
                    className="form-control"
                  />
                </div>

                <div className="form-group col-md-4">
                  <label>Nominee Mobile</label>
                  <input
                    onChange={inputEvent}
                    value={formData.nominee_mobile}
                    name="nominee_mobile"
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Nominee Address</label>
                  <input
                    onChange={inputEvent}
                    value={formData.nominee_address}
                    name="nominee_address"
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Nominee age</label>
                  <input
                    onChange={inputEvent}
                    value={formData.nominee_age}
                    name="nominee_age"
                    type="text"
                    className="form-control"
                  />
                </div>

                <hr className="my-3" style={{ borderColor: "#000" }} />
                {/* 👇 Extra Fields Added */}
                <h4 className="fw-bold  d-flex align-items-center mb-3" style={{color:"#000", fontSize:"16px"}}>
                  <i class="fas fa-upload me-2 "></i>Document Uploads
                </h4>

                <div className="form-group col-md-4">
                  <label>Upload Aadhaar</label>
                  <input
                    type="file"
                    name="employee_adhar_image"
                    className="form-control"
                    onChange={captureFile}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Upload PAN</label>
                  <input
                    type="file"
                    name="employee_pan_image"
                    className="form-control"
                    onChange={captureFile}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Upload 10thMarksheet</label>
                  <input
                    type="file"
                    name="tenth_marksheet_img"
                    className="form-control"
                    onChange={captureFile}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Upload 12thMarksheet</label>
                  <input
                    type="file"
                    name="twelth_marksheet_img"
                    className="form-control"
                    onChange={captureFile}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Upload Mohter Adhar</label>
                  <input
                    type="file"
                    name="mother_adhar_image"
                    className="form-control"
                    onChange={captureFile}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Upload Father Adhar</label>
                  <input
                    type="file"
                    name="father_adhar_image"
                    className="form-control"
                    onChange={captureFile}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Upload Police-Verfication</label>
                  <input
                    type="file"
                    name="Policeverification"
                    className="form-control"
                    onChange={captureFile}
                  />
                </div>

                <div className="form-group text-center col-md-12">
                  <button
                    className="btn btn-primary btn-lg"
                    type="submit"
                    style={{ width: "30vh" }}
                  >
                    Add {formData.type}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AddUser;
