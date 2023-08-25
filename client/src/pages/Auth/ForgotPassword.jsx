import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthStyles.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,
        { email, newPassword, answer }
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
    <Layout title="Forgot Password - Ecommerce App">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1 className="title">RESET PASSWORD</h1>
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
              placeholder="New Password"
              value={newPassword}
              className="form-control"
              required
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter your favorite sports name"
              value={answer}
              className="form-control"
              required
              onChange={(e) => {
                setAnswer(e.target.value);
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            RESET
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
