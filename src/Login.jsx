import { useState } from "react"
import axios from "axios";

const Login = () => {
  const [email,setEmail] = useState("huhu@yahoo.com");
  const [password,setPassword] = useState("Huhu@1172");

  const handleLogin = async() => {
    try {
      const res = await axios.post('http://localhost:3000/login',{
        email,
        password
      },
    {
      withCredentials: true
    })
    } catch(err) {
      console.log("An error occured while logging in ", err.message);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="card bg-base-100 w-full max-w-md shadow-xl rounded-2xl">
        <div className="card-body">
          {/* Logo / App Name */}
          <div className="text-center mb-6">
            <span className="text-3xl font-extrabold text-primary">Lynk 💕🔗</span>
            <p className="text-sm text-base-content/70 mt-1">Welcome back! Please sign in</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={e => {
              e.preventDefault();
              handleLogin();
            }}>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                required
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
                <a href="#" className="label-text-alt link link-hover text-primary">
                  Forgot?
                </a>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-lg">
              Sign in
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-base-content/70 mt-6">
            Don’t have an account?{" "}
            <a href="#" className="link link-primary font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
