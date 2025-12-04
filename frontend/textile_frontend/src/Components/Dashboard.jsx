import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Navbar2 from "./Navbar2";

export default function Dashboard() {
  const { admin_id } = useParams();

  return (
    <>
      <Navbar2 admin_id={admin_id} />
      <br />
      <center>
        <h2>Welcome, Administrator !.{admin_id}</h2>
      </center>
    </>
  );
}
