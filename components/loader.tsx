import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const Loader = () => {
    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl bg-gray-800/90 shadow-2xl border border-gray-700/50">
                <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20"></div>
                    <ArrowPathIcon className="h-16 w-16 text-blue-500 animate-spin" />
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <p className="text-blue-400 font-medium text-lg">Loading</p>
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loader;
