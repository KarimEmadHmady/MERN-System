import { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import AdminMenu from "./AdminMenu";

const SessionTable = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=b5b55deb46ef473fa730a340f28684a3`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].formatted;
      } else {
        return "عنوان غير متوفر";
      }
    } catch (error) {
      console.error("🔴 Error fetching address:", error);
      return "خطأ في جلب العنوان";
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true); 
      try {
        const response = await axios.get("/api/sessions");
        const data = response.data;

        const sessionsWithAddress = await Promise.all(
          data.map(async (session) => {
            if (session.location) {
              const address = await fetchAddress(
                session.location.latitude,
                session.location.longitude
              );
              return { ...session, address };
            }
            return { ...session, address: "الموقع غير متوفر" };
          })
        );

        setSessions(sessionsWithAddress);
      } catch (error) {
        console.error("🔴 Error fetching sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div className="p-4 p-[120px] page-Sessiontable">
      <AdminMenu />
      <h2 className="text-xl font-bold mb-4">سجلات التسجيل</h2>

      {isLoading ? ( 
        <p className="text-center text-lg font-bold">Loading ...</p>
      ) : (
        <>
          <CSVLink
            data={sessions.map((session) => ({
              رقم: session._id,
              الاسم: session.username || "غير متوفر",
              الإيميل: session.email || "غير متوفر",
              الموقع: `${session.location.latitude}, ${session.location.longitude}`,
              العنوان: session.address || "غير متوفر",
              "وقت تسجيل الدخول": new Date(session.loginTime).toLocaleString(),
            }))}
            filename="sessions.csv"
            className="mb-2 p-2 bg-green-500 text-white rounded"
          >
            تحميل كـ Excel
          </CSVLink>

          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-black-200">
                <th className="border p-2">#</th>
                <th className="border p-2">الصورة</th>
                <th className="border p-2">الاسم</th>
                <th className="border p-2">الإيميل</th>
                <th className="border p-2">الاحدثيات</th>
                <th className="border p-2">العنوان</th>
                <th className="border p-2">وقت تسجيل الدخول</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={session._id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">
                    {session.userImage ? (
                      <img
                        src={session.userImage}
                        alt="User Avatar"
                        className="w-21 h-20 mx-auto rounded-full"
                      />
                    ) : (
                      "❌ لا يوجد صورة"
                    )}
                  </td>
                  <td className="border p-2">{session.username || "غير متوفر"}</td>
                  <td className="border p-2">{session.email || "غير متوفر"}</td>
                  <td className="border p-2">
                    {session.location
                      ? `${session.location.latitude}, ${session.location.longitude}`
                      : "غير متوفر"}
                  </td>
                  <td className="border p-2">{session.address}</td>
                  <td className="border p-2">
                    {new Date(session.loginTime).toLocaleString()}
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

export default SessionTable;
