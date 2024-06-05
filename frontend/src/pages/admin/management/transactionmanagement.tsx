import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { server } from "../../../redux/store";
import { Order, orderList  } from "../../../types/types";
import { useSelector } from "react-redux";
import { userReducerInitialTypes } from "../../../types/reducer-types";
import { useDeleteOrderMutation, useOrderDetailQuery, useUpdateOrderMutation } from "../../../redux/api/orderApi";
import { Skeleton } from "../../../components/loader";
import { responseToast } from "../../../utils/features";
import AdminSidebar from "../../../components/admin/AdminSidebar";

const defaultData: Order = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  },
  orderList: [],
  subtotal: 0,
  total: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  status: "",
  user: {
    name: "",
    _id: "",
  },
  _id: "",
};

const TransactionManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: userReducerInitialTypes }) => state.userReducer
  );

  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useOrderDetailQuery(params.id!);

  const {
    shippingInfo: { address, city, state, country, pincode },
    orderList,
    user: { name },
    status,
    tax,
    subtotal,
    discount,
    total,
    shippingCharges,
  } = data?.order || defaultData;


  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const deleteHandler = async() => {
    const res = await deleteOrder({
      userId: user?._id!,
      orderId: data?.order._id!
    });
    responseToast(res,navigate,"/admin/transaction")
  };
  
  const updateHandler = async() => {
    const res = await updateOrder({
      userId: user?._id!,
      orderId: data?.order._id!
    });
    responseToast(res,navigate,"/admin/transaction")
  };

  if (isError) return <Navigate to={"/404"} />;



  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
      {
        isLoading? <Skeleton/> : 
        <>
              <section
          style={{
            padding: "2rem",
          }}
        >
          <h2>Order Items</h2>

          {orderList.map((i) => (
            <ProductCard
              key={i._id}
              name={i.name}
              photo={`${server}/${i.photo}`}
              productId={i.productId}
              _id={i._id}
              quantity={i.quantity}
              price={i.price}
            />
          ))}
        </section>

        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {name}</p>
          <p>
            Address: {`${address}, ${city}, ${state}, ${country} ${pincode}`}
          </p>
          <h5>Amount Info</h5>
          <p>Subtotal: {subtotal}</p>
          <p>Shipping Charges: {shippingCharges}</p>
          <p>Tax: {tax}</p>
          <p>Discount: {discount}</p>
          <p>Total: {total}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                status === "Delivered"
                  ? "yellow"
                  : status === "Shipped"
                  ? "green"
                  : "red"
              }
            >
              {status}
            </span>
          </p>
          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        </article>
        </>
      }
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: orderList) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
