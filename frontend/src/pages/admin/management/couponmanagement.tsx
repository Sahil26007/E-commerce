import { ReactElement, useState, useEffect } from "react";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import TableHOC from "../../../components/admin/TableHOC";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { userReducerInitialTypes } from "../../../types/reducer-types";
import { useAllCouponsQuery } from "../../../redux/api/couponApi";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";

type DataType = {
    code: string;
    amount: number;
    action: ReactElement;
    copy: ReactElement;
};

const columns: Column<DataType>[] = [
    {
        Header: "Code",
        accessor: "code",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Action",
        accessor: "action",
    },
    {
        Header: "Copy",
        accessor: "copy",
    },
];

const Coupon = () => {
    const { user } = useSelector(
        (state: { userReducer: userReducerInitialTypes }) => state.userReducer
    );

    console.log(user);

    const { data, error, isLoading } = useAllCouponsQuery(user?._id!);

    const [rows, setRows] = useState<DataType[]>([]);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            toast.success(`Copied code: ${code}`);
        });
    };

    useEffect(() => {
        if (data) {
            const formattedData = data.coupons.map((coupon) => ({
                code: coupon.code,
                amount: coupon.amount,
                action: <Link to={`/order/${coupon._id}`}>Manage</Link>,
                copy: (
                    <button onClick={() => handleCopy(coupon.code)}>
                        <FaCopy />
                    </button>
                ),
            }));
            setRows(formattedData);
        }
    }, [data]);

    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Coupon",
        rows.length > 6
    )();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading coupons</div>;

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main>{Table}</main>
        </div>
    );
};

export default Coupon;
