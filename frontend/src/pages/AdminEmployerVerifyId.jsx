import { useEffect, useState } from "react";
import { adminStore } from "../stores/adminApi";
import SkeletonLoader from "../components/adminVerificationSkeletonLoader";
import { FaEye } from "react-icons/fa";

const AdminEmployerVerifyId = () => {
  const {
    getEmployerVerificationList,
    updateEmployerVerificationStatus,
    totaluploademployer,
    isAdminLoading,
  } = adminStore();

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(delay);
  }, [isAdminLoading]);

  useEffect(() => {
    getEmployerVerificationList();
  }, [getEmployerVerificationList]);

  const handleVerificationUpdate = async (userId, isVerified) => {
    await updateEmployerVerificationStatus(userId, isVerified);
    getEmployerVerificationList();
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800 font-poppins">
        Employer Verification
      </h2>

      {Array.isArray(totaluploademployer) && totaluploademployer.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 font-poppins">
                <th className="py-4 px-6 border-b text-left">User ID</th>
                <th className="py-4 px-6 border-b text-left">Employer Name</th>
                <th className="py-4 px-6 border-b text-center">
                  Verification ID
                </th>
                <th className="py-4 px-6 border-b text-center">Status</th>
                <th className="py-4 px-6 border-b text-center min-w-[250px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="font-poppins">
              {[...totaluploademployer].reverse().map((employer) => (
                <tr
                  key={employer.userId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 border-b">{employer.userId}</td>
                  <td className="py-4 px-6 border-b">{employer.fullName}</td>
                  <td className="py-4 px-6 border-b text-center">
                    <button
                      onClick={() => setSelectedImage(employer.verificationId)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View Image"
                    >
                      <FaEye size={18} />
                    </button>
                  </td>
                  <td className="py-4 px-6 border-b text-center">
                    {employer.isIdVerified !== undefined ? (
                      <span
                        className={`font-semibold ${
                          employer.isIdVerified
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {employer.isIdVerified ? "Verified" : "Not Verified"}
                      </span>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </td>
                  <td className="py-4 px-6 border-b text-center min-w-[150px]">
                    {employer.isIdVerified === false && (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            handleVerificationUpdate(employer.userId, true)
                          }
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleVerificationUpdate(employer.userId, false)
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-700 text-center">
          No pending employer verifications.
        </p>
      )}

      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-xl shadow-xl max-w-lg w-full transform transition-all duration-300">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
              title="Close"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Verification ID"
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminEmployerVerifyId;
