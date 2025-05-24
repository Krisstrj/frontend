<<<<<<< HEAD
'use client';

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppProvider';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BookOpenIcon, EnvelopeIcon, LockClosedIcon, UserIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Loader from '@/components/loader';

interface FormData {
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
  role: 'user' | 'admin';
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const router = useRouter();
  const { login, register, authToken, isLoading, user } = useAppContext();

  useEffect(() => {
    if (!hasRedirected && authToken && !isLoading && user?.role) {
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/user');
      }
      setHasRedirected(true);
    }
  }, [authToken, isLoading, user?.role, hasRedirected, router]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void> = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Logged in successfully!");
      } else {
        if (formData.password !== formData.password_confirmation) {
          toast.error("Passwords don't match!");
          setIsSubmitting(false);
          return;
        }
        await register(
          formData.name!,
          formData.email,
          formData.password,
          formData.password_confirmation!,
          formData.role
        );
        toast.success("Registered successfully! Please login.");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error?.response?.data?.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || authToken) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[
          { x: "10%", y: "20%" },
          { x: "85%", y: "30%" },
          { x: "20%", y: "70%" },
          { x: "75%", y: "80%" }
        ].map((pos, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 shadow-lg">
                <ShieldCheckIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10">
          <div>
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <ShieldCheckIcon className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-white tracking-tight">
              {isLogin ? "Secure Access" : "Create Shield"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              {isLogin ? "Enter your credentials to access your assets" : "Set up your secure account"}
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-gray-800/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Input Name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Account Type</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserGroupIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <select
                        id="role"
                        name="role"
                        required
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-gray-800/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-gray-800/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      required
                      minLength={8}
                      className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-gray-800/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="••••••••"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                ) : (
                  isLogin ? "Access Assets" : "Create Shield"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              {isLogin ? "Don't have a shield?" : "Already have a shield?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                disabled={isSubmitting}
                className="ml-1 font-medium text-blue-400 hover:text-blue-300 focus:outline-none focus:underline transition-colors duration-200"
              >
                {isLogin ? "Create One" : "Access"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

=======
'use client';

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppProvider';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BookOpenIcon, EnvelopeIcon, LockClosedIcon, UserIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Loader from '@/components/loader';

interface FormData {
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
  role: 'user' | 'admin';
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const router = useRouter();
  const { login, register, authToken, isLoading, user } = useAppContext();

  useEffect(() => {
    if (!hasRedirected && authToken && !isLoading && user?.role) {
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/user');
      }
      setHasRedirected(true);
    }
  }, [authToken, isLoading, user?.role, hasRedirected, router]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void> = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Logged in successfully!");
      } else {
        if (formData.password !== formData.password_confirmation) {
          toast.error("Passwords don't match!");
          setIsSubmitting(false);
          return;
        }
        await register(
          formData.name!,
          formData.email,
          formData.password,
          formData.password_confirmation!,
          formData.role
        );
        toast.success("Registered successfully! Please login.");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error?.response?.data?.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || authToken) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[
          { x: "10%", y: "20%" },
          { x: "85%", y: "30%" },
          { x: "20%", y: "70%" },
          { x: "75%", y: "80%" }
        ].map((pos, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 shadow-lg">
                <ShieldCheckIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10">
          <div>
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <ShieldCheckIcon className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-white tracking-tight">
              {isLogin ? "Secure Access" : "Create Shield"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              {isLogin ? "Enter your credentials to access your assets" : "Set up your secure account"}
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-gray-800/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Input Name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Account Type</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserGroupIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <select
                        id="role"
                        name="role"
                        required
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-gray-800/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-gray-800/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      required
                      minLength={8}
                      className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-gray-800/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="••••••••"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                ) : (
                  isLogin ? "Access Assets" : "Create Shield"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              {isLogin ? "Don't have a shield?" : "Already have a shield?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                disabled={isSubmitting}
                className="ml-1 font-medium text-blue-400 hover:text-blue-300 focus:outline-none focus:underline transition-colors duration-200"
              >
                {isLogin ? "Create One" : "Access"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

>>>>>>> 0ff9da5 (update)
export default AuthPage;