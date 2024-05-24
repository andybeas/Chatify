import useLogin from '../../hooks/useLogin.js';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { handler } from 'tailwindcss-animate';


const Login = () => {

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const {loading, login} = useLogin();

	const handleLogin = async (e) => {
		e.preventDefault();
		await login(username,password);
		}
  return (
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
 				<h1 className='text-3xl font-semibold text-center text-white'>
 					Login
 					<span className='text-blue-500'> Chatify</span>
 				</h1>

 				<form onSubmit={handleLogin}>
 					<div>
 						<label className='label p-2'>
 							<span className='text-base label-text'>Username</span>
 						</label>
 						{/* <input type='text' placeholder='Enter username' className='w-full input input-bordered h-10' /> */}
             			<input 
							type="text" 
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Type here" 
							className="input input-ghost w-full text-white max-w-xs" />
 					</div>

 					<div>
 						<label className='label'>
 							<span className='text-base label-text'>Password</span>
 						</label>
 						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='Enter Password'
							className='input input-ghost w-full text-white max-w-xs'
						/>
					</div>
					<Link to={'/signup'} className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
						{"Don't"} have an account?
					</Link>

					<div>
						<button className='btn btn-block btn-sm mt-2' disabled={loading}>
							{loading ? <span className='loading loading-spinner '></span> : "Login"}
						</button>
					</div>
				</form>
			</div>
		</div>
  )
}

export default Login