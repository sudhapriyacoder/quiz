import React from 'react';
import {Form, message} from 'antd';
import { Link } from 'react-router-dom';
import {registerUser} from '../../../apicalls/users';
import {showLoading, hideLoading} from '../../../redux/loaderSlice';
import { useDispatch } from 'react-redux';



function Register() {
    const dispatch = useDispatch();
    const onFinish = async (values) =>{
         try {
            dispatch(showLoading())
           const res = await registerUser(values);
           dispatch(hideLoading())
           console.log(res);
           if(res.success){
            message.success(res.message);
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
                    <h1 className="text-2xl">Register</h1>
                    <div className='divider'></div>
                    <Form layout='vertical' onFinish={onFinish}>
                        <Form.Item name="name" label="Name">
                            <input type='text' />
                        </Form.Item>
                        <Form.Item name="email" label="Email">
                            <input type='text' />
                        </Form.Item>
                        <Form.Item name="password" label="Password">
                            <input type='password' />
                        </Form.Item>
                        <div className='flex flex-col gap-2'>
                        <button type='submit' className='primary-contained-btn mt-2 w-100'>Register</button>
                        <Link to="/login" className='underline'>Already a member? Login</Link>
                        </div>
                        
                    </Form>
               </div>
            </div>
        </div>
    )
}

export default Register;