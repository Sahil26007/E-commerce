import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";

import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { userReducerInitialTypes } from "../../types/reducer-types";
import { useAllOrderQuery } from "../../redux/api/orderApi";
import { customError } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/loader";
import AdminSidebar from "../../components/admin/AdminSidebar";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}



const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const { user } = useSelector(
    (state: { userReducer: userReducerInitialTypes }) => state.userReducer
  );
  const { data, isLoading, isError, error } = useAllOrderQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as customError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data!)
      setRows(
        data.orders.map((i) => ({
          user: i.user.name,
          amount: i.total,
          discount: i.discount,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "green"
                  : "yellow"
              }
            >
              {i.status}
            </span>
          ),
          quantity: i.orderList.length,
          action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{ isLoading? <Skeleton/>:  Table}</main>
    </div>
  );
};

export default Transaction;
