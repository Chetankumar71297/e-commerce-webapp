import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthStyles.css";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { name, email, password, phone, address }
      );
      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title="Register - Shopping kart">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1 className="title">REGISTER FORM</h1>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              className="form-control"
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              className="form-control"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              className="form-control"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              className="form-control"
              required
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Address"
              value={address}
              className="form-control"
              required
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Register;
