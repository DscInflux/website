import React, { useState, useEffect } from "react";
import TeamCard from "@/components/Layout/Team/TeamLayout";

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/v1/staff`)
      .then(response => response.json())
      .then(data => {
        setTeamMembers(data);
      })
      .catch(error => {
        console.error('Error fetching team members:', error);
      });
  }, []);

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
                Staff Team
              </h1>
              <p className={`text-sm lg:text-base text-gray-700 bold-text`}>
                Meet our Staff Team who work hard on this project.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
          {teamMembers.map((teamMember, index) => (
            <TeamCard
              key={index}
              name={teamMember.discord.DisplayName}
              pfp={teamMember.avatar}
              bio={teamMember.about}
              link1={teamMember.link1}
              link2={teamMember.link2}
              link1Title={teamMember.link1Title}
              link2Title={teamMember.link2Title}
              link1Icon={teamMember.link1Icon}
              link2Icon={teamMember.link2Icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}