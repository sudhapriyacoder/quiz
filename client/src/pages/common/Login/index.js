import React from 'react';
import {Form} from 'antd';
import { Link } from 'react-router-dom';
import { loginUser } from '../../../apicalls/users';
import {message} from 'antd';
import {showLoading, hideLoading} from '../../../redux/loaderSlice';
import { useDispatch } from 'react-redux';


function Login() {
    const dispatch = useDispatch();
    const onFinish = async (values) =>{
        try {
            dispatch(showLoading())
          const res = await loginUser(values);
          dispatch(hideLoading())
          console.log(res);
          if(res.success){
           message.success(res.message);
           localStorage.setItem('token', res.data);
           window.location.href = '/';
          } else {
           message.error(res.message)
          }
        } catch(error) {
           message.error(error.message)
           dispatch(hideLoading())
        }
   }
    return(
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="card w-400 p-3">
               <div className='flex flex-col'>
                    <h1 className="text-2xl">Login</h1>
                    <div className='divider'></div>
                    <Form layout='vertical' onFinish={onFinish}>
                        <Form.Item name="email" label="Email">
                            <input type='text' value="sudha" />
                        </Form.Item>
                        <Form.Item name="password" label="Password">
                            <input type='password' value="sudha" />
                        </Form.Item>
                        <div className='flex flex-col gap-2'>
                        <button type='submit' className='primary-contained-btn mt-2 w-100'>Login</button>
                        <Link to="/register" className='underline'>Not a member? Register</Link>
                        </div>
                        
                    </Form>
               </div>
            </div>
        </div>
    )
}

export default Login;