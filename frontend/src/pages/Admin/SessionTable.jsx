import { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import AdminMenu from "./AdminMenu";

const SessionTable = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await axios.get("/api/sessions");
        setSessions(data);
      } catch (error) {
        console.error("🔴 Error fetching sessions:", error);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div className="p-4 p-[120px] page-Sessiontable">
       <AdminMenu />
      <h2 className="text-xl font-bold mb-4">سجلات التسجيل</h2>

      {/* 🔹 زر تحميل البيانات في Excel */}
      <CSVLink 
  data={sessions.map(session => ({
    رقم: session._id,
    الاسم: session.username || "غير متوفر",
    الإيميل: session.email || "غير متوفر",
    الموقع: `${session.location.latitude}, ${session.location.longitude}`,
    "وقت تسجيل الدخول": new Date(session.loginTime).toLocaleString(),
  }))} 
  filename="sessions.csv" 
  className="mb-2 p-2 bg-green-500 text-white rounded"
>
  تحميل كـ Excel
</CSVLink>


      {/* 🔹 جدول عرض البيانات */}
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-black-200">
            <th className="border p-2">#</th>
            <th className="border p-2">الصورة</th>
            <th className="border p-2">الاسم</th>
            <th className="border p-2">الإيميل</th>
            <th className="border p-2">الموقع</th>
            <th className="border p-2">وقت تسجيل الدخول</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr key={session._id} className="text-center">
              <td className="border p-2">{index + 1}</td>

              {/* 🔹 عرض صورة المستخدم من قاعدة البيانات */}
              <td className="border p-2">
                {session.userImage ? (
                  <img 
                    src={session.userImage} 
                    alt="User Avatar" 
                    className="w-21 h-20  mx-auto"
                  />
                ) : (
                  "❌ لا يوجد صورة"
                )}
              </td>

              <td className="border p-2">{session.username || "غير متوفر"}</td>
              <td className="border p-2">{session.email || "غير متوفر"}</td>
              <td className="border p-2">
                {session.location.latitude}, {session.location.longitude}
              </td>
              <td className="border p-2">{new Date(session.loginTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionTable;
