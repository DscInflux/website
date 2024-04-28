import StatsCard from "@/components/Layout/Other/StatsLayout";
import React, { useState, useEffect } from "react";

interface Stats {
    name: string;
    description: string;
    stats?: string;
}

const StatsPage = () => {
    const [profilesCount, setProfilesCount] = useState<number>(0);
    const [usersCount, setUsersCount] = useState<number>(0);
    const [staffCount, setStaffCount] = useState<number>(0);
    const [verfiedprofile, setVerifiedProfileCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const responses = await Promise.all([
                    fetch(`${apiUrl}/profilenum`),
                    fetch(`${apiUrl}/usernum`),
                    fetch(`${apiUrl}/staffnum`),
                    fetch(`${apiUrl}/verifiednum`),
                ]);

                const data = await Promise.all(
                    responses.map((res) => res.json())
                );

                setProfilesCount(data[0].total_profiles);
                setUsersCount(data[1].total_user);
                setStaffCount(data[2].total_staff);
                setVerifiedProfileCount(data[3].total_verified);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data");
            }
        };

        fetchData();
    }, []);
    const stats: Stats[] = [
        {
            name: "Users",
            description: "Total number of users present on DscInflux:",
            stats: `${usersCount}`,
        },
        {
            name: "Profiles",
            description: "Total number of profiles present on DscInflux:",
            stats: `${profilesCount}`,
        },
        {
            name: "Staff",
            description: "Total Number of Staff Members working on DscInflux:",
            stats: `${staffCount}`,
        },
        {
            name: "Verified Profile",
            description: "Number of Verified Profiles present in DscInflux:",
            stats: `${verfiedprofile}`,
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center px-10 3xl:px-0">
            <div className="max-w-7xl w-full">
                <div className="w-full mt-5">
                    <div className="flex items-center gap-5">
                        <div className="hidden lg:block relative">
                            <i className="fa fa-users hidden lg:block text-5xl text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg lg:text-3xl text-transparent bg-clip-text bg-gradient-to-tr from-primary to-secondary font-extrabold">
                                Stats{" "}
                            </h1>
                            <p
                                className={`text-sm lg:text-base text-gray-700 $["bold-text"]}`}
                            >
                                Check out our statistics
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mt-12">
                    {stats.map((stat, index) => (
                        <StatsCard key={index} {...stat} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsPage;
