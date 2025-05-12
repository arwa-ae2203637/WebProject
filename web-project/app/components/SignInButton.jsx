
"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import "../login/login.css"
import React, { useEffect } from "react"

const SignInButton = () => {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      const [firstName, ...lastNameParts] = session.user.name?.split(" ") || ["GitHub", "User"];
      const lastName = lastNameParts.join(" ") || "User";
      
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({
          id: session.user.email, 
          firstName,
          lastName,
          username: session.user.email.split("@")[0], 
          userType: "student", 
          email: session.user.email,
          image: session.user.image 
        })
      );
      console.log("User logged in:", localStorage.getItem("loggedUser"));
    }
  }, [session]);

  if (session && session.user) {
    return (
      <>
         <p>Logged in as  : {session.user.name}</p>

       <button  id="signout-button"  onClick={() => {
          localStorage.removeItem("githubUser") 
          signOut()
        }}>Sign Out</button>
        
      </>
    )
  }

  return (
    <div className="login-cont">
      <button 
        id="login-button" 
        onClick={() => signIn("github", { callbackUrl: "/student-registration" })} 
        className="login-button"
      >
        <img src="../assets/icons/github.png" alt="GitHub Logo" className="gitLogo" />
        Sign In With GitHub
      </button>
    </div>
  )
}

export default SignInButton