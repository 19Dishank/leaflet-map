import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        try {
            await axios.post('/api/v1/auth/logout', {}, { withCredentials: true });
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            navigate('/');
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/v1/auth/profile-me', {
                    withCredentials: true
                });
                setProfile(response.data);
            } catch (error) {
                console.log(error.response)

                if (error.response?.status === 401) {
                    try {
                        console.log("Token expired, attempting refresh...");
                        await axios.post('/api/v1/auth/refreshAccessToken', {}, { withCredentials: true });

                        const retryResponse = await axios.get('/api/v1/auth/profile-me', {
                            withCredentials: true
                        });
                        console.log(retryResponse);
                        setProfile(retryResponse.data);
                        console.log(retryResponse);
                    } catch (error) {
                        console.log(error)
                        console.error('Refresh failed → logging out');
                        // navigate('/');
                    }
                } else {
                    console.log(error)
                    console.error('Fetch error:', error.message);
                    // navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <header>
                <h1>Dashboard</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>

            <main>
                <section>
                    {/* Accessing data safely based on your console.log structure */}
                    <h2>Welcome back, {profile?.data?.name || 'User'}!</h2>
                    <p>Email: {profile?.data?.email}</p>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;