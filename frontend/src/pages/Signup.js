import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {
  // keep track of what people wype into the unput fields
  const [email, setEmail] = useState('')
  // setEmail updates the value, the initial state is an empty string
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()
  // grab the three parameters from useSingup hook

  const handleSubmit = async (e) => {
    e.preventDefault()
    // prevent a default refresh of the page 

    await signup(email, password)
    // send post request to the server with these parameters, the signup hook has this logic
  }

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      
      <label>Email address:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        // when the value of this changes you want to update the email state
        value={email}

      />
      <label>Password:</label>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
        // for two-way data binding
      />

      <button disabled={isLoading}>Sign up</button>
      {/* disables the button based on boolean */}
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Signup