"use client"
import React from 'react';
import { GoLink } from 'react-icons/go';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/store/store';
import Input from '../ui/Input';
import { MdOutlineEmail } from "react-icons/md";
import InputPassword from '../ui/InputPassword';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import Divider from '../ui/Divider';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import Link from 'next/link';


const LoginPage = ({register,errors,handleSubmit,handleLogin}) => {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);

  const SignOptions = [{id:1,title : "Sign in Apple",icon:<FaApple size={20}/>},{id:1,title : "Sign in Google",icon:<FcGoogle size={20}/>}]


  return (
    <div className='w-full min-h-screen max-w-lg flex flex-col gap-6 pt-20 pb-4 overflow-hidden'>

      {/* mobile branding — only visible on small screens */}
      <div className='flex md:hidden gap-1 items-center justify-center mb-2'>
        <h1 className='text-primary'>Service</h1>
        <GoLink size={28} />
        <h1 className='text-primary'>Link</h1>
      </div>

      <div className='flex flex-col gap-1'>
        <h1 className='font-bold'>LOGIN</h1>
        <p className='text-gray-700'>
          Please enter your email and password.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col gap-4 h-[300px] overflow-y-auto'>
        <Input
        label={"Email"}
        name={"email"}
        placeholder={"Enter Email Address"}
        register={register}
        errors={errors}
        type={"email"}
        icon = {<MdOutlineEmail size={20}/>}
        />

        <InputPassword
        name={"password"}
        register={register}
        errors={errors}
        placeholder={"Enter Password"}
        label={"Password"}
        />

        <div className='flex justify-between items-center'>
            <Checkbox
          label={"Remember me"}
          name={"remember"}
          errors={errors}
          register={register}
          />
          <button type='button' className='text-sm text-primary hover:underline'>
            Forgot password?
          </button>
        </div>

        <Button text={"Login"}/>
      </form>

      <Divider/>
    
    <div className='w-full flex gap-4 justify-center items-center'>
       
      {
        SignOptions.map((opt,idx)=>(
        <div key={idx} className='w-40 p-2 flex lg:gap-2 gap-0 items-center justify-center cursor-pointer border border-gray-400 rounded-full'>
        {opt.icon}
        <p>{opt.title}</p>
      </div>
        ))
      }
    </div>


        <Link
          href={"/sign-up"}
          className='text-gray-800 text-center font-semibold hover:underline cursor-pointer'
        >
          Sign Up Now
        </Link>

        <div className='mt-auto w-full flex flex-col justify-center items-center'>
      <p>By signing-in, you agree to our</p>
      <p>
        <span className='font-semibold cursor-pointer'
        onClick={()=>router.push("/agreements?active=terms")}
        >Terms & Conditions</span> | 
        <span className='font-semibold cursor-pointer'
        onClick={()=>router.push("/agreements?active=policy")}
        > Privacy Policy</span>
      </p>
        </div>

    </div>
  );
};

export default LoginPage;
