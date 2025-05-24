"use client";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppProvider";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { authToken, isLoading } = useAppContext();
  const router = useRouter();

  if (isLoading) {
    return (
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-end h-16">
            <div className="animate-pulse h-4 w-24 bg-gray-700 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-end h-16">
          {authToken && <LogoutButton />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;