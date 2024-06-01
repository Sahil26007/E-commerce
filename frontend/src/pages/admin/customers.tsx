import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { userReducerInitialTypes } from "../../types/reducer-types";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userApi";
import { customError } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/loader";
import { responseToast } from "../../utils/features";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {

  const { user } = useSelector(
    (state: { userReducer: userReducerInitialTypes }) => state.userReducer
  );
  
  const { data, isLoading, isError, error } = useAllUsersQuery(user?._id!);

  const [deleteUser] = useDeleteUserMutation();
 
  const [rows, setRows] = useState<DataType[]>([]);

  
  
  const deleteHandler = async(userId : string) => {
    const res = await deleteUser({userId , adminUserId : user?._id!});
    responseToast(res,null,"");
  }  

  if (isError) {
    const err = error as customError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data!)
      setRows(
        data.user.map((i) => ({
          avatar: (
            <img
              style={{
                borderRadius: "50%",
              }}
              src={ i.photo }
            />
          ),
          name: i.name,
          email: i.email,
          gender: i.gender,
          role: i.role,
          action: (
            <button onClick={() => deleteHandler(i._id)}>
              <FaTrash />
            </button>
          )
        }))
      );
  }, [data]);


  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{ isLoading? <Skeleton/>:  Table}</main>
    </div>
  );
};

export default Customers;
