// "use client"
// import { signIn, signOut, useSession } from "next-auth/react"
// import "../login/login.css"
// import React from "react"

// const SignInButton = () => {
//   const { data: session } = useSession()
//   console.log(session?.user)

//   if (session && session.user) {
//     return (
//       <>
//         <p>{session.user.name}</p>
//         <button onClick={() => signOut()}>Sign Out</button>
//       </>
//     )
//   }
//   return (
//     <div className="login-cont">
//     <button id="login-button"                 onClick={() => signIn("github", { callbackUrl: "/student-registration" })} 

//  className="login-button">
//       <img src="../assets/icons/github.png" alt="GitHub Logo" className="gitLogo" />
//       Sign In With Git
//     </button>
//   </div>
//   )
// }

// export default SignInButton

"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import "../login/login.css"
import React, { useEffect } from "react"

const SignInButton = () => {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      // Extract first/last names from GitHub's single name field
      const [firstName, ...lastNameParts] = session.user.name?.split(" ") || ["GitHub", "User"];
      const lastName = lastNameParts.join(" ") || "User";
      
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({
          id: session.user.email, // Using email as ID fallback
          firstName,
          lastName,
          username: session.user.email.split("@")[0], // Create username from email
          userType: "student", // Default role for GitHub logins
          email: session.user.email,
          image: session.user.image // Optional: keep avatar
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
          localStorage.removeItem("githubUser") // Clean up on sign out
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