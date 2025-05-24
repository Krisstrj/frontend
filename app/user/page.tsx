"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowPathIcon, BookOpenIcon, ClockIcon, UserCircleIcon, CheckCircleIcon, PlusIcon, ExclamationCircleIcon, BookmarkIcon, ArrowUpIcon, ArrowDownIcon, ExclamationTriangleIcon, ShieldCheckIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import ProfileModal from "@/components/ProfileModal";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  available_copies: number;
  total_copies: number;
  borrowed_at?: string;
  due_date?: string;
  returned_date?: string;
  added_by?: string;
  user?: {
    name: string;
  };
  transaction_id: number;
  unique_key?: string;
  status?: string;
}

interface SidebarProps {
  activeTab: "all" | "available" | "borrowed";
  setActiveTab: (tab: "all" | "available" | "borrowed") => void;
  setShowProfileModal: (show: boolean) => void;
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  trend: "up" | "down";
  trendText: string;
}

interface BookCardProps {
  book: Book;
  onBorrow: (id: number) => void;
  selectedBookId: number | null;
  setSelectedBookId: (id: number | null) => void;
  dueDate: Date | null;
  setDueDate: (date: Date | null) => void;
  loading: {
    action: boolean;
  };
}

interface BorrowedBooksTableProps {
  books: Book[];
  onReturn: (transactionId: number, bookTitle: string) => void;
  loading: {
    borrowed: boolean;
    action: boolean;
  };
}

const Sidebar = ({ activeTab, setActiveTab, setShowProfileModal }: SidebarProps) => (
  <div className="fixed left-0 top-0 h-full w-16 bg-gray-900/80 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 space-y-4">
    <button 
      onClick={() => setActiveTab("all")}
      className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-200 border border-red-500/20 ${activeTab === "all" ? "bg-white/10" : ""}`}
    >
      <BookOpenIcon className="h-6 w-6 text-blue-400" />
    </button>
    <button 
      onClick={() => setActiveTab("available")}
      className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-200 border border-red-500/20 ${activeTab === "available" ? "bg-white/10" : ""}`}
    >
      <PlusIcon className="h-6 w-6 text-purple-400" />
    </button>
    <button 
      onClick={() => setActiveTab("borrowed")}
      className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-200 border border-red-500/20 ${activeTab === "borrowed" ? "bg-white/10" : ""}`}
    >
      <BookmarkIcon className="h-6 w-6 text-green-400" />
    </button>
    <div className="flex-grow"></div>
    <button 
      onClick={() => setShowProfileModal(true)}
      className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 border border-red-500/20"
    >
      <UserCircleIcon className="h-6 w-6 text-yellow-400" />
    </button>
  </div>
);

const StatsCard = ({ title, value, icon: Icon, color, trend, trendText }: StatsCardProps) => (
  <div className={`bg-gray-900/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-lg hover:shadow-${color}-500/10 transition-all duration-200`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
        <div className="flex items-center mt-2">
          <ArrowUpIcon className={`h-4 w-4 text-${trend === 'up' ? 'green' : 'red'}-400 mr-1`} />
          <span className={`text-sm text-${trend === 'up' ? 'green' : 'red'}-400`}>{trendText}</span>
        </div>
      </div>
      <Icon className={`h-8 w-8 text-${color}-400`} />
    </div>
  </div>
);

const QuickGuide = () => (
  <div className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-lg mb-8">
    <h3 className="text-lg font-semibold text-white mb-3">Quick Guide</h3>
    <ul className="text-sm text-gray-400 space-y-2">
      <li className="flex items-center">
        <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
        Books can be borrowed for up to 7 days
      </li>
      <li className="flex items-center">
        <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
        Return books on time to maintain good standing
      </li>
      <li className="flex items-center">
        <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
        Use the refresh button to update your reading status
      </li>
      <li className="flex items-center">
        <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
        Click your profile picture to update your information
      </li>
    </ul>
  </div>
);

const BookCard = ({ book, onBorrow, selectedBookId, setSelectedBookId, dueDate, setDueDate, loading }: BookCardProps) => (
  <div className="bg-gray-900/80 backdrop-blur-xl rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1 border border-white/10">
    <div className="p-4">
      <div className="flex flex-col h-full">
        <div className="mb-2">
          <h3 className="text-base font-semibold text-white line-clamp-1 mb-1 hover:text-blue-400 transition-colors duration-200">{book.title}</h3>
          <h4 className="text-xs font-medium text-gray-400 line-clamp-1">by {book.author}</h4>
        </div>
        <div className="text-xs text-gray-400 line-clamp-2 min-h-[2.5rem] mb-2">
          {book.description || 'No description available'}
        </div>
        <div className="space-y-1 text-xs mt-2">
          <div className="flex items-center text-gray-400">
            <BookmarkIcon className="h-3 w-3 mr-1 text-blue-400" />
            <span className="line-clamp-1">{book.genre}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <PlusIcon className="h-3 w-3 mr-1 text-blue-400" />
            <span>{book.available_copies}/{book.total_copies}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="px-4 py-3 bg-gray-800/50 border-t border-white/10">
      {selectedBookId === book.id ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Return date (max 1 week)
            </label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              minDate={new Date()}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 7))}
              className="w-full px-2 py-1.5 text-sm bg-gray-900/80 border border-white/10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              placeholderText="Select return date"
              dateFormat="MMM d, yyyy"
            />
          </div>
          <div className="flex space-x-2">
            <button
              className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/20 border border-red-500/20"
              onClick={() => onBorrow(book.id)}
              disabled={loading.action}
            >
              {loading.action ? (
                <>
                  <span className="animate-spin mr-1 h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </button>
            <button
              className="px-3 py-1.5 border border-white/10 text-xs font-medium rounded-xl text-gray-400 bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              onClick={() => {
                setSelectedBookId(null);
                setDueDate(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className={`w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-xl transition-all duration-200 ${
            book.available_copies > 0
              ? 'text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:-translate-y-0.5 shadow-lg hover:shadow-red-500/20 border border-red-500/20'
              : 'text-gray-400 bg-gray-800/50 cursor-not-allowed border border-red-500/20'
          }`}
          onClick={() => book.available_copies > 0 && setSelectedBookId(book.id)}
          disabled={book.available_copies <= 0 || loading.action}
        >
          {book.available_copies > 0 ? 'Borrow' : 'Unavailable'}
        </button>
      )}
    </div>
  </div>
);

const BorrowedBooksTable = ({ books, onReturn, loading }: BorrowedBooksTableProps) => (
  <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Author</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900/80 divide-y divide-white/10">
          {loading.borrowed ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center">
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-blue-400"></div>
                  <span className="text-gray-400">Loading your reading list...</span>
                </div>
              </td>
            </tr>
          ) : books.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center py-8">
                  <BookOpenIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <p>Your reading list is empty. Start exploring our collection!</p>
                </div>
              </td>
            </tr>
          ) : (
            books.map(book => (
              <tr key={book.unique_key} className="hover:bg-gray-800/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{book.author}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.status === 'returned' 
                      ? 'bg-emerald-900/50 text-emerald-200 border border-emerald-500/20'
                      : 'bg-amber-900/50 text-amber-200 border border-amber-500/20'
                  }`}>
                    {book.status === 'returned' ? 'Returned' : 'Currently Reading'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {book.status !== 'returned' ? (
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/20 border border-red-500/20"
                      onClick={() => onReturn(book.transaction_id, book.title)}
                      disabled={loading.action}
                    >
                      {loading.action ? (
                        <>
                          <span className="animate-spin mr-2 h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                          Returning...
                        </>
                      ) : (
                        'Return Book'
                      )}
                    </button>
                  ) : (
                    <button 
                      className="inline-flex items-center px-3 py-1.5 border border-red-500/20 text-xs font-medium rounded-xl text-gray-400 bg-gray-800/50 cursor-not-allowed"
                      disabled
                    >
                      Already Returned
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const UserDashboard = () => {
  const { authToken, user, isLoading, logout } = useAppContext();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "available" | "borrowed">("all");
  const [loading, setLoading] = useState({
    books: false,
    borrowed: false,
    action: false,
    refreshing: false
  });
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      setLastUpdated(new Date().toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchBooks();
      fetchBorrowedBooks();
    }
  }, [authToken]);

  const fetchBooks = async () => {
    setLoading(prev => ({...prev, books: true}));
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/books`,
        {
          headers: { 
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      );
      
      const data = Array.isArray(response.data) ? response.data : 
                  response.data.books ? response.data.books : 
                  response.data.data ? response.data.data : [];
      
      const formattedBooks = data.map((book: any) => ({
        id: book.id,
        title: book.title || 'No Title',
        author: book.author || 'Unknown Author',
        genre: book.genre || 'Uncategorized',
        description: book.description || 'No description available',
        available_copies: book.available_copies || 0,
        total_copies: book.total_copies || 0,
        added_by: book.user?.name || 'Admin'
      }));
      
      setBooks(formattedBooks);
    } catch (error: any) {
      console.error('Book fetch error:', error);
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to load books"
      );
    } finally {
      setLoading(prev => ({...prev, books: false}));
    }
  };

  const fetchBorrowedBooks = async () => {
    setLoading(prev => ({...prev, borrowed: true}));
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/borrowed-books`,
        {
          headers: { 
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      );
      
      const data = Array.isArray(response.data) ? response.data : 
                  response.data.books ? response.data.books : 
                  response.data.data ? response.data.data : [];
      //
      const formattedBooks = data.map((book: any) => {
        console.log('Raw book data:', book); // Debug log
        const formatted = {
          id: book.id,
          title: book.title || 'No Title',
          author: book.author || 'Unknown Author',
          genre: book.genre || 'Uncategorized',
          description: book.description || 'No description available',
          available_copies: book.available_copies || 0,
          total_copies: book.total_copies || 0,
          transaction_id: book.transaction_id || book.id,
          status: book.status || 'borrowed',
          due_date: book.due_date || null,
          borrowed_at: book.borrowed_at || null,
          returned_date: book.returned_date || null,
          unique_key: `${book.id}-${book.transaction_id || book.id}-${Date.now()}`
        };
        console.log('Formatted book:', formatted); // Debug log
        return formatted;
      });
      
      console.log('All formatted books:', formattedBooks); // Debug log
      setBorrowedBooks(formattedBooks);
    } catch (error: any) {
      console.error('Borrowed books fetch error:', error);
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to load borrowed books"
      );
    } finally {
      setLoading(prev => ({...prev, borrowed: false}));
    }
  };

  const refreshData = async () => {
    setLoading(prev => ({...prev, refreshing: true}));
    try {
      await Promise.all([fetchBooks(), fetchBorrowedBooks()]);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(prev => ({...prev, refreshing: false}));
    }
  };

  const handleBorrow = async (bookId: number) => {
    if (!dueDate) {
      toast.error("Please select a return date");
      return;
    }

    const today = new Date();
    const maxDueDate = new Date();
    maxDueDate.setDate(today.getDate() + 7);

    if (dueDate > maxDueDate) {
      toast.error("Maximum borrowing period is 1 week");
      return;
    }

    if (dueDate < today) {
      toast.error("Return date cannot be in the past");
      return;
    }

    setLoading(prev => ({...prev, action: true}));
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}/borrow`,
        { due_date: dueDate.toISOString().split('T')[0] },
        { 
          headers: { 
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json'
          }
        }
      );
      
      toast.success(response.data?.message || "Book borrowed successfully");
      setDueDate(null);
      setSelectedBookId(null);
      await Promise.all([fetchBooks(), fetchBorrowedBooks()]);
    } catch (error: any) {
      console.error('Borrow error:', error);
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to borrow book"
      );
    } finally {
      setLoading(prev => ({...prev, action: false}));
    }
  };

  const handleReturn = async (transactionId: number, bookTitle: string) => {
    if (!authToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Confirm Return",
        text: `Are you sure you want to return "${bookTitle}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, return it",
      });

      if (result.isConfirmed) {
        setLoading(prev => ({...prev, action: true}));
        
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/transactions/${transactionId}/return`,
            {},
            {
              headers: { 
                Authorization: `Bearer ${authToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data?.success) {
            toast.success(response.data.message || "Book returned successfully");
            await Promise.all([fetchBooks(), fetchBorrowedBooks()]);
          } else {
            throw new Error(response.data?.message || "Failed to process return");
          }
        } catch (error: any) {
          console.error('Return error:', error);
          let errorMessage = "Failed to return book";
          
          if (error.response) {
            if (error.response.status === 404) {
              errorMessage = "Transaction not found";
            } else if (error.response.status === 403) {
              errorMessage = "You are not authorized to return this book";
            } else if (error.response.status === 400) {
              errorMessage = error.response.data?.message || "This book was already returned";
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message;
            }
          }
          
          toast.error(errorMessage);
        } finally {
          setLoading(prev => ({...prev, action: false}));
        }
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      toast.error("An error occurred during confirmation");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return "Invalid Date";
    }
  };

  const formatReturnDate = (dateString?: string) => {
    if (!dateString) return "Not returned yet";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return "Invalid Date";
    }
  };

  const isBookOverdue = (dueDateString?: string) => {
    if (!dueDateString) return false;
    const dueDate = new Date(dueDateString);
    return dueDate < new Date();
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Confirm Logout",
        text: "Are you sure you want to logout?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, logout",
      });

      if (result.isConfirmed) {
        await logout();
        router.push('/auth');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  if (isLoading || !authToken || (user?.role === 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredBooks = activeTab === "available" 
    ? books.filter(book => book.available_copies > 0)
    : activeTab === "borrowed" 
      ? borrowedBooks 
      : books;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-800">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/images/got-pattern.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-gray-600/20 to-gray-800/20"></div>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-xl border-b border-red-500/10 z-50">
        <div className="h-full px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white font-got">
              Welcome to the Realm, {user?.name}!
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshData}
              disabled={loading.refreshing}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl shadow-lg hover:shadow-red-500/20 transition-all duration-200 border border-red-500/20"
            >
              <ArrowPathIcon className={`h-5 w-5 mr-2 ${loading.refreshing ? 'animate-spin' : ''}`} />
              {loading.refreshing ? 'Updating...' : 'Refresh'}
            </button>
            <button 
              onClick={() => setShowProfileModal(true)}
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 border border-red-500/20"
            >
              <UserCircleIcon className="h-6 w-6 text-yellow-400" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 border border-red-500/20"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Side Navigation */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 bg-gray-900/80 backdrop-blur-xl border-r border-red-500/10 flex flex-col items-center py-6 space-y-4">
        <button 
          onClick={() => setActiveTab("all")}
          className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-200 border border-red-500/20 ${activeTab === "all" ? "bg-white/10" : ""}`}
        >
          <BookOpenIcon className="h-6 w-6 text-blue-400" />
        </button>
        <button 
          onClick={() => setActiveTab("available")}
          className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-200 border border-red-500/20 ${activeTab === "available" ? "bg-white/10" : ""}`}
        >
          <PlusIcon className="h-6 w-6 text-purple-400" />
        </button>
        <button 
          onClick={() => setActiveTab("borrowed")}
          className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-200 border border-red-500/20 ${activeTab === "borrowed" ? "bg-white/10" : ""}`}
        >
          <BookmarkIcon className="h-6 w-6 text-green-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-20 pt-20 p-8 relative z-10">
        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Books Currently Borrowed"
            value={0}
            icon={BookOpenIcon}
            color="red"
            trend="up"
            trendText="Your active reads"
          />
          <StatsCard
            title="Books Returned"
            value={0}
            icon={ArrowPathIcon}
            color="amber"
            trend="up"
            trendText="Completed reads"
          />
          <StatsCard
            title="Books Overdue"
            value={0}
            icon={ExclamationTriangleIcon}
            color="red"
            trend="down"
            trendText="Need attention"
          />
          <StatsCard
            title="Available Books"
            value={3}
            icon={PlusIcon}
            color="emerald"
            trend="up"
            trendText="Ready to borrow"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Book List or Borrowed Books Table */}
          <div className="lg:col-span-1">
            {activeTab !== "borrowed" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading.books ? (
                  <div className="col-span-full">
                    <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 text-center border border-red-500/10">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600 mx-auto"></div>
                      <p className="mt-4 text-gray-400">Loading your reading options...</p>
                    </div>
                  </div>
                ) : filteredBooks.length === 0 ? (
                  <div className="col-span-full">
                    <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 text-center border border-red-500/10">
                      <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No books available at the moment.</p>
                    </div>
                  </div>
                ) : (
                  [
                    {
                      id: 1,
                      title: "Game of thrones",
                      author: "siMama",
                      genre: "basta",
                      description: "No description available",
                      available_copies: 7,
                      total_copies: 10
                    },
                    {
                      id: 2,
                      title: "HARRY POTTER",
                      author: "K",
                      genre: "SECRET",
                      description: "No description provided",
                      available_copies: 15,
                      total_copies: 17
                    },
                    {
                      id: 3,
                      title: "The Summer I turned Pretty 7",
                      author: "Jenny Han",
                      genre: "Young Adult, Romance",
                      description: "No description provided",
                      available_copies: 1,
                      total_copies: 1
                    }
                  ].map(book => (
                    <div key={`book-${book.id}`} className="bg-gray-900/80 backdrop-blur-xl rounded-lg overflow-hidden hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1 border border-red-500/10">
                      <div className="p-4">
                        <div className="flex flex-col h-full">
                          <div className="mb-2">
                            <h3 className="text-base font-semibold text-white line-clamp-1 mb-1 hover:text-red-400 transition-colors duration-200 font-got">{book.title}</h3>
                            <h4 className="text-xs font-medium text-gray-400 line-clamp-1">by {book.author}</h4>
                          </div>
                          <div className="text-xs text-gray-400 line-clamp-2 min-h-[2.5rem] mb-2">
                            {book.description}
                          </div>
                          <div className="space-y-1 text-xs mt-2">
                            <div className="flex items-center text-gray-400">
                              <BookmarkIcon className="h-3 w-3 mr-1 text-red-400" />
                              <span className="line-clamp-1">{book.genre}</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                              <PlusIcon className="h-3 w-3 mr-1 text-red-400" />
                              <span>{book.available_copies}/{book.total_copies}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-800/50 border-t border-red-500/10">
                        {selectedBookId === book.id ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Return date (max 1 week)
                              </label>
                              <DatePicker
                                selected={dueDate}
                                onChange={(date) => setDueDate(date)}
                                minDate={new Date()}
                                maxDate={new Date(new Date().setDate(new Date().getDate() + 7))}
                                className="w-full px-2 py-1.5 text-sm bg-gray-900/80 border border-red-500/10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                                placeholderText="Select return date"
                                dateFormat="MMM d, yyyy"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/20 border border-red-500/20"
                                onClick={() => handleBorrow(book.id)}
                                disabled={loading.action}
                              >
                                {loading.action ? (
                                  <>
                                    <span className="animate-spin mr-1 h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                                    Processing...
                                  </>
                                ) : (
                                  'Confirm'
                                )}
                              </button>
                              <button
                                className="px-3 py-1.5 border border-red-500/20 text-xs font-medium rounded-xl text-gray-400 bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                onClick={() => {
                                  setSelectedBookId(null);
                                  setDueDate(null);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className={`w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-xl transition-all duration-200 ${
                              book.available_copies > 0
                                ? 'text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:-translate-y-0.5 shadow-lg hover:shadow-red-500/20 border border-red-500/20'
                                : 'text-gray-400 bg-gray-800/50 cursor-not-allowed border border-red-500/20'
                            }`}
                            onClick={() => book.available_copies > 0 && setSelectedBookId(book.id)}
                            disabled={book.available_copies <= 0 || loading.action}
                          >
                            {book.available_copies > 0 ? 'Borrow' : 'Unavailable'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl border border-red-500/10 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-red-500/10">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900/80 divide-y divide-red-500/10">
                      {loading.borrowed ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center">
                            <div className="flex justify-center items-center space-x-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-red-400"></div>
                              <span className="text-gray-400">Loading your reading list...</span>
                            </div>
                          </td>
                        </tr>
                      ) : borrowedBooks.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                            <div className="flex flex-col items-center justify-center py-8">
                              <BookOpenIcon className="h-12 w-12 text-gray-400 mb-4" />
                              <p>Your reading list is empty. Start exploring our collection!</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        borrowedBooks.map(book => (
                          <tr key={book.unique_key} className="hover:bg-gray-800/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-got">{book.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{book.author}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                book.status === 'returned' 
                                  ? 'bg-emerald-900/50 text-emerald-200 border border-emerald-500/20'
                                  : 'bg-amber-900/50 text-amber-200 border border-amber-500/20'
                              }`}>
                                {book.status === 'returned' ? 'Returned' : 'Currently Reading'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {book.status !== 'returned' ? (
                                <button
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/20 border border-red-500/20"
                                  onClick={() => handleReturn(book.transaction_id, book.title)}
                                  disabled={loading.action}
                                >
                                  {loading.action ? (
                                    <>
                                      <span className="animate-spin mr-2 h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                                      Returning...
                                    </>
                                  ) : (
                                    'Return Book'
                                  )}
                                </button>
                              ) : (
                                <button 
                                  className="inline-flex items-center px-3 py-1.5 border border-red-500/20 text-xs font-medium rounded-xl text-gray-400 bg-gray-800/50 cursor-not-allowed"
                                  disabled
                                >
                                  Already Returned
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
        />
      )}
    </div>
  );
};

export default UserDashboard;