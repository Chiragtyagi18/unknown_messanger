// 'use client';

// import { ApiResponse } from '@/types/ApiResponse';
// import { zodResolver } from '@hookform/resolvers/zod';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import {useDebounceCallback } from 'usehooks-ts';
// import * as z from 'zod';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import toast, { Toaster } from 'react-hot-toast'; // ✅ using react-hot-toast only
// import { Loader2 } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { signupSchema } from '@/schemas/signupSchema'; // ✅ correct schema import
// import axios, { AxiosError } from 'axios';

// export default function SignUpForm() {
//   const [username, setUsername] = useState('');
//   const [usernameMessage, setUsernameMessage] = useState('');
//   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const debounced = useDebounceCallback(setUsername, 300);

//   const router = useRouter();

//   const form = useForm<z.infer<typeof signupSchema>>({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       username: '',
//       email: '',
//       password: '',
//     },
//   });

//   // ✅ Check username availability
//   useEffect(() => {
//     const checkUsernameUnique = async () => {
//       if (username) {
//         setIsCheckingUsername(true);
//         setUsernameMessage('');
//         try {
//           const response = await axios.get<ApiResponse>(
//             `/api/check-username-unique?username=${username}`
//           );
//           setUsernameMessage(response.data.message);
//         } catch (error) {
//           const axiosError = error as AxiosError<ApiResponse>;
//           setUsernameMessage(
//             axiosError.response?.data.message ?? 'Error checking username'
//           );
//         } finally {
//           setIsCheckingUsername(false);
//         }
//       }
//     };
//     checkUsernameUnique();
//   }, [username]);

//   // ✅ Form submit handler
//   const onSubmit = async (data: z.infer<typeof signupSchema>) => {
//     setIsSubmitting(true);
//     try {
//       const response = await axios.post<ApiResponse>('/api/sign-up', data);

//       toast.success(response.data.message); // ✅ Success toast
//       router.replace(`/verify/${data.username}`);
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       const errorMessage =
//         axiosError.response?.data.message ??
//         'There was a problem with your sign-up. Please try again.';

//       toast.error(errorMessage); // ✅ Error toast
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Toaster position="top-center" reverseOrder={false} /> {/* ✅ Toast container */}

//       <div className="flex justify-center items-center min-h-screen bg-gray-800">
//         <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//           <div className="text-center">
//             <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//               Join True Feedback
//             </h1>
//             <p className="mb-4">Sign up to start your anonymous adventure</p>
//           </div>

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               {/* USERNAME FIELD */}
//               <FormField
//                 name="username"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Username</FormLabel>
//                     <Input
//                       {...field}
//                       onChange={(e) => {
//                         field.onChange(e);
//                         debounced(e.target.value);
//                       }}
//                     />
//                     {isCheckingUsername && (
//                       <Loader2 className="animate-spin inline h-4 w-4 text-gray-500 ml-2" />
//                     )}
//                     {!isCheckingUsername && usernameMessage && (
//                       <p
//                         className={`text-sm ${
//                           usernameMessage === 'Username is unique'
//                             ? 'text-red-500'
//                             : 'text-green-500'
//                         }`}
//                       >
//                         {usernameMessage}
//                       </p>
//                     )}
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* EMAIL FIELD */}
//               <FormField
//                 name="email"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <Input {...field} />
//                     <p className="text-gray-400 text-sm">
//                       We will send you a verification code
//                     </p>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* PASSWORD FIELD */}
//               <FormField
//                 name="password"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <Input type="password" {...field} />
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* SUBMIT BUTTON */}
//               <Button type="submit" className="w-full" disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Please wait
//                   </>
//                 ) : (
//                   'Sign Up'
//                 )}
//               </Button>
//             </form>
//           </Form>

//           <div className="text-center mt-4">
//             <p>
//               Already a member?{' '}
//               <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Loader2, User, Mail, Lock, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signupSchema } from '@/schemas/signupSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const _debouncedResult = useDebounceValue(username, 300);
  const debouncedUsername = Array.isArray(_debouncedResult)
    ? _debouncedResult[0]
    : _debouncedResult;

  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername.trim()) return;

      setIsCheckingUsername(true);
      setUsernameMessage('');

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${debouncedUsername}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? 'Error checking username'
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast.success(response.data.message);
      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ??
        'There was a problem with your sign-up. Please try again.';
      toast.error('Sign-up failed: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 relative py-12">
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-violet-500/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md p-8 glass rounded-2xl shadow-2xl border border-white/10 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Join the <span className="gradient-text">Adventure</span>
          </h1>
          <p className="text-muted-foreground">Sign up to start your anonymous journey</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4 text-violet-400" />
                    Username
                  </FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                      className="bg-white/5 border-white/10 focus:border-violet-500/50 transition-all h-11 pr-10"
                      placeholder="Pick a unique username"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isCheckingUsername ? (
                        <Loader2 className="animate-spin h-4 w-4 text-violet-500" />
                      ) : usernameMessage === 'Username is available' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : usernameMessage ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  {usernameMessage && !isCheckingUsername && (
                    <p className={`text-xs font-medium ${usernameMessage === 'Username is available' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-violet-400" />
                    Email
                  </FormLabel>
                  <Input 
                    {...field} 
                    className="bg-white/5 border-white/10 focus:border-violet-500/50 transition-all h-11"
                    placeholder="Enter your email"
                  />
                  <p className='text-[10px] text-muted-foreground/60 italic uppercase tracking-wider font-bold'>
                    Use a valid email for your account
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-violet-400" />
                    Password
                  </FormLabel>
                  <Input 
                    type="password" 
                    {...field} 
                    className="bg-white/5 border-white/10 focus:border-violet-500/50 transition-all h-11"
                    placeholder="Create a strong password"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className='w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/25 gap-2' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-8 pt-6 border-t border-white/5">
          <p className="text-sm text-muted-foreground">
            Already a member?{' '}
            <Link href="/sign-in" className="text-violet-400 hover:text-violet-300 font-bold underline underline-offset-4 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
