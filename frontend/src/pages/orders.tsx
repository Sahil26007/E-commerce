import { ReactElement, useState } from "react";
import TableHOC from "../components/admin/TableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";

type DataType = {
    _id:string;
    quantity:number;
    discount:number;
    amount:number;
    status:ReactElement;
    action:ReactElement;
};
const column: Column<DataType>[] = [{
    Header : "ID",
    accessor : "_id",
}, {
    Header : "Quantity",
    accessor : "quantity"
}, {
    Header : "Amount",
    accessor : "amount"
}, {
    Header : "Discount",
    accessor : "discount"
}, {
    Header : "Status",
    accessor : "status",
}, {
    Header : "Action",
    accessor : "action"
}]

const Orders = () => {

    const [rows] = useState<DataType[]>([{
        _id: "asdhasfasdasf",
        quantity:10,
        discount:10,
        amount:100,
        status:<span className="green">
            Processing
        </span>,
        action:<Link to={`/order/asdhasf`}>View</Link>
    }])

    const Table = TableHOC<DataType>(
        column,
        rows,
        "dashboard-product-box",
        "Orders",
        rows.length > 6
    )();

  return (
    <div className="container">
        <h1>MY Orders</h1>
        {Table}
    </div>
  )
}

export default Orders
