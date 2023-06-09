import Head from 'next/head'
import Layout from '../layout/layout'
import Link from 'next/link'
import styles from '../styles/Form.module.css';
import Image from 'next/image'
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import { useState } from 'react';
import { signIn, signOut } from "next-auth/react"
import { useFormik } from 'formik';
import login_validate from '../lib/validate';
import { useRouter } from 'next/router';

export default function Login() {
    const [show, setShow] = useState(false)
    const router = useRouter()
    const [alertMsg, setAlertMsg] = useState({});

    // formik hook
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate: login_validate,
        onSubmit
    })

    async function onSubmit(values) {
        const status = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
            callbackUrl: "/"
        });
    
        if (status?.error) {
            setAlertMsg({ type: 'error', message: status?.error });
        } else if (status?.ok) {
            setAlertMsg({ type: 'success', message: 'Login Successful!' });
            router.push(status?.url);
        } else {
            setAlertMsg({ type: 'error', message: 'Login Failed! Please Try Again.' });
        }
    }
    

    // Google Handler function
    async function handleGoogleSignin() {
        signIn('google', { callbackUrl: "http://localhost:3000" })
    }

    return (
        <Layout>
            <Head>
                <title>Login</title>
            </Head>
            <section className='w-3/4 mx-auto flex flex-col gap-10'>
                <div className="title">
                    <h1 className='text-gray-800 text-4xl font-bold py-4'>Login</h1>
                    <p className='w-3/4 mx-auto text-gray-400'>Welcome</p>
                </div>
                {/* form */}
                <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
                    <div className={`${styles.input_group} ${formik.errors.email && formik.touched.email ? 'border-rose-600' : ''}`}>
                        <input
                            type="email"
                            name='email'
                            placeholder='Email'
                            className={styles.input_text}
                            {...formik.getFieldProps('email')}
                        />
                        <span className='icon flex items-center px-4'>
                            <HiAtSymbol size={25} />
                        </span>
                    </div>

                    <div className={`${styles.input_group} ${formik.errors.password && formik.touched.password ? 'border-rose-600' : ''}`}>
                        <input
                            type={`${show ? "text" : "password"}`}
                            name='password'
                            placeholder='password'
                            className={styles.input_text}
                            {...formik.getFieldProps('password')}
                        />
                        <span className='icon flex items-center px-4' onClick={() => setShow(!show)}>
                            <HiFingerPrint size={25} />
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className={`text-${alertMsg.type === 'success' ? 'green' : 'red'}-500 my-1`}>
                            {alertMsg.message}
                        </p>
                    </div>

                    {/* login buttons */}
                    <div className="input-button">
                        <button type='submit' className={styles.button}>
                            Login
                        </button>
                    </div>

                    <div className="input-button">
                    <button type='button' onClick={handleGoogleSignin} className={styles.button_custom}>
                        Sign In with Google <Image src={'/assets/google.svg'} width="20" height={20} alt='google_img'></Image>
                    </button>
                </div>
            </form>

            {/* bottom */}
            <p className='text-center text-gray-400 '>
                don&#39;t have an account yet? <Link href={'/register'} className='text-blue-700'>Sign Up</Link>
            </p>
        </section>

        </Layout>
    );
}

