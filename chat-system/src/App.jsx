
import LoginPage from './auth/LoginPage'
import ChatComponent from './ChatComponent'
import { Routes, Route, useNavigate } from "react-router-dom";
import SignUpPage from './auth/SignUp';
import Loginpage from './auth/LoginPage';
import ForgotPasswordPage from './auth/FogotPasswordPage';
import ResetPassword from './auth/ResetPassword';
import GroupCompoents from './GroupComponent';
import CreateGroup from './CreateGroup';
import { use } from 'react';
function App() {
  const user = JSON.parse(localStorage.getItem("user")) 
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/create" element={<CreateGroup />} />

        <Route path="/chat" element={<GroupCompoents />}></Route>
        {/* 
        <Route
          path="/chat"
          element={
            user ? (
              <ChatComponent
                senderId={user.id}
                receiverId={2}
                senderEmail={user.email}
                receiverEmail={"a@b.com"}
              />
            ) : (
              navigate("/")
            )
          }
        ></Route> */}
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App
