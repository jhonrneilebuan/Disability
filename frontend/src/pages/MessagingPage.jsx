import { chatStore } from "../stores/chatStore";
import NoChatSelected from "../components/NoChatSelected";
import ChatSidebar from "../components/chatSidebar";
import Navbar from "../components/Navbar";
import NavbarEmployer from "../components/NavbarEmployer";
import { authStore } from "../stores/authStore";
import { ChevronLeft } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import ChatContainer from "@/components/ChatContainer";


const HomePage = () => {
  const { selectedUser } = chatStore();
  const { user } = authStore();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      {user.role === "Applicant" ? <Navbar /> : <NavbarEmployer />}
      <div className="flex items-stretch justify-center h-[89vh] overflow-hidden">
        <div className="bg-white shadow-cl w-full">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Back</span>
            </button>
          </div>
          <div className="flex h-[calc(100%-64px)] rounded-lg overflow-hidden"> 
            <ChatSidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
