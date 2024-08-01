import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userReducerInitialTypes } from "../types/reducer-types";
import { useMyOrderQuery } from "../redux/api/orderApi";
import { customError } from "../types/api-types";
import toast from "react-hot-toast";

type DataType = {
  _id: string;
  quantity: number;
  discount: number;
  amount: number;
  status: ReactElement;
  action: ReactElement;
};

const columns: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
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
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {
  const { user } = useSelector(
    (state: { userReducer: userReducerInitialTypes }) => state.userReducer
  );

  const { data, isError, error, isLoading } = useMyOrderQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (isError) {
      const err = error as customError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((i) => ({
          _id: i._id,
          quantity: i.orderList[0].quantity,
          discount: i.discount,
          amount: i.amount,
          status: <span className="status">{i.status}</span>,
          action: <Link to={`/order/${i._id}`}>View</Link>,
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();

  return (
    <div className="container">
      <h1>My Orders</h1>
      {isLoading ? <p>Loading...</p> : Table}
    </div>
  );
};

export default Orders;
