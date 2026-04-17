import React, { useState, useEffect } from 'react';
import { Menu, Search, X, MapPin, ClosedCaptionIcon } from 'lucide-react';

export const MapComponent = ({ query, setQuery, searchResult, handleSearch, handleViewLocation }) => {
    const [isSearchActive, setIsSearchActive] = useState(false);

    useEffect(() => {
        if (searchResult?.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsSearchActive(true);
        }
    }, [searchResult]);


    return (
        <div className="relative w-full h-dvh bg-slate-100 overflow-hidden font-sans text-slate-900">
            <div id="map" className="absolute inset-0 z-0"></div>

            <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
                <div className="flex items-center justify-center bg-white rounded-full shadow-lg px-4 py-3 gap-3 w-full md:w-full max-w-md mr-auto md:mx-auto pointer-events-auto">
                    {isSearchActive ? (
                        <button
                            onClick={() => {
                                setIsSearchActive(false);
                                setQuery('');
                            }}
                            className="p-1 text-slate-600 hover:text-slate-900"
                        >
                            <X size={22} />
                        </button>
                    ) : (
                        <button className="p-1 text-slate-600 hover:text-slate-900">
                            <Menu size={22} />
                        </button>
                    )}

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsSearchActive(true)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search here"
                        className="flex-1 bg-transparent border-none outline-none text-base w-full placeholder-slate-500"
                    />

                    <button
                        onClick={handleSearch}
                        className="p-1 text-slate-600 hover:text-blue-600 border-l border-slate-200 pl-3 shrink-0"
                    >
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {isSearchActive && (
                <div
                    className="absolute inset-0 bg-black/20 z-30"
                    onClick={() => setIsSearchActive(false)}
                />
            )}

            <div className={`absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out flex flex-col w-full md:max-w-md md:mx-auto md:mb-4 md:rounded-3xl ${isSearchActive ? 'translate-y-0 h-[65dvh] md:h-[50dvh]' : 'translate-y-full h-0 md:translate-y-[120%]'}`}>
                <div className="w-full flex justify-center py-3 shrink-0">
                    <div className="w-10 h-1.5 bg-slate-200 rounded-full"></div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-6">
                    {searchResult && searchResult.length > 0 ? (
                        searchResult.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    handleViewLocation(item);
                                    setIsSearchActive(false);
                                }}
                                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                            >
                                <div className="p-2.5 bg-slate-100 rounded-full text-slate-600 shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex-1 min-w-0 border-b border-slate-100 pb-4 pt-1">
                                    <p className="text-base font-medium text-slate-800 truncate">
                                        {item.display_name.split(',')[0]}
                                    </p>
                                    <p className="text-sm text-slate-500 truncate mt-0.5">
                                        {item.display_name}
                                    </p>

                                </div>
                            </button>
                        ))
                    ) : query ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
                            <Search size={28} className="text-slate-300" />
                            <p className="text-sm">Press search to find locations</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};