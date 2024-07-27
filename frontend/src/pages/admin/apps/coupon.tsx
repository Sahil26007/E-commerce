import { FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { userReducerInitialTypes } from "../../../types/reducer-types";
import { useCreateCouponMutation } from "../../../redux/api/couponApi";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";

const CouponCode = () => {
  const { user } = useSelector((state: { userReducer: userReducerInitialTypes }) => state.userReducer);

  const [code, setCode] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const [newCoupon] = useCreateCouponMutation();

  const navigate = useNavigate();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!code || amount <= 0) {
      return toast.error("Both fields are required and amount must be greater than 0");
    }

    const coupon = `${code}${amount}`;
    const formData = new FormData();
    formData.set("code", coupon);
    formData.set("amount", amount.toString());

    try {
      const res = await newCoupon({ id: user?._id!, formData });
      responseToast(res, navigate, "/admin/coupon");
    } catch (error) {
      toast.error("Failed to create coupon");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Coupon</h1>
        <section>
          <form className="coupon-form" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Coupon Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <button type="submit">Generate</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CouponCode;
