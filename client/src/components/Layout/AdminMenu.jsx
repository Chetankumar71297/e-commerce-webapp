import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group">
          <h4>Admin panel</h4>
          <NavLink
            to="/dashboard/admin/manage-category"
            className="list-group-item list-group-item-action"
          >
            Manage category
          </NavLink>
          <NavLink
            to="/dashboard/admin/manage-product"
            className="list-group-item list-group-item-action"
          >
            Manage product
          </NavLink>
          <NavLink
            to="/dashboard/admin/products"
            className="list-group-item list-group-item-action"
          >
            Products
          </NavLink>
          <NavLink
            to="/dashboard/admin/users"
            className="list-group-item list-group-item-action"
          >
            Users
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
