import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { CSVLink } from "react-csv"; // استيراد مكتبة CSVLink

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto p-[10]">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <>
          {/* إضافة زر تحميل البيانات كـ CSV */}
          <CSVLink
            data={orders.map((order) => ({
              "Order ID": order._id,
              "Serial Number": order.orderItems.map(item => item.serialnumber).join(", "),
              "Date": new Date(order.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              "Total": `L.E ${order.totalPrice}`,
            }))}
            filename="user_orders.csv"
            className="mb-4 p-2 bg-green-500 text-white rounded"
          >
            تحميل كـ Excel
          </CSVLink>

          <table className="w-full ">
            <thead>
              <tr className="info-page-order">
                <td className="py-2">IMAGE</td>
                <td className="py-2 info-page-order-id">Serial Number</td>
                <td className="py-2">DATE</td>
                <td className="py-2">TOTAL</td>
                <td className="py-2"></td>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr className="info-page-order-row" key={order._id}>
                  <img
                    src={order.orderItems[0].image}
                    alt={order.user}
                    className="w-[6rem] mb-5 info-page-order-img"
                  />

                  <td className="py-2 info-page-order-id">
                    {order.orderItems.map((item, index) => (
                      <div key={index}>{item.serialnumber}</div>
                    ))}
                  </td>

                  <td className="py-2">
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  <td className="py-2">L.E {order.totalPrice}</td>

                  <td className="px-2 py-2">
                    <Link to={`/order/${order._id}`}>
                      <button className="info-page-order-btn bg-[#5f2476] text-back py-2 px-3 rounded">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UserOrder;

