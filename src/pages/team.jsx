import PartnerCard from "@/components/Layout/Team/TeamLayout";

export default function Team() {
  const teamMembers = [
    // Members here:
    
    {
      name: "Connor200024",
      pfp: "https://cdn.discordapp.com/avatars/324646179134636043/a_a6b6a45371cc347290ad33f829dded7c.gif?size=4096",
      bio: "Hi, I'm Connor the new Owner of DscInflux.",
      link1: "https://connor200024.xyz",
      link2: "https://x.com/Connor200024",
      link1Title: "Connor200024",
      link2Title: "Twitter",
      link1Icon: "fa-icon-class-for-link1",
      link2Icon: "fa-icon-class-for-link1",
    },
    
    {
      name: "Maya Rose",
      pfp: "https://styles.redditmedia.com/t5_4wr4f2/styles/profileIcon_mp7lvbjw2d281.jpg?width=256&height=256&crop=256:256,smart&s=4ac91e07c3a6b3688b1a8195b60c5835de288756",
      bio: "Hi, I'm Maya Rose I am a Developer for DscInflux",
      link1: "https://discordinflux.xyz/Maya",
      link2: "https://x.com/ranveersoni98",
      link1Title: "DiscordInflux",
      link2Title: "X",
      link1Icon: "fa-icon-class-for-link1",
      link2Icon: "fa-icon-class-for-link1",
    },
    {
      name: "Toxic Dev",
      pfp: "https://cdn.discordapp.com/avatars/510065483693817867/a_5b8b978d724408fa66bc880d1ecc8d17.gif?size=1024",
      bio: "Curious by nature self-taught full-stack software developer who is always aiming for improvement. currently working at Infinity Bot List as a Founder/Owner, FrontEnd Designer/Engineer and Community Manager with a strong background in project management, project planning and customer relations.",
      link1: "https://x.com/TheRealToxicDev",
      link2: "https://infinitybots.gg/",
      link1Title: "X",
      link2Title: "Infinity Bot List",
      link1Icon: "fa-icon-class-for-link1",
      link2Icon: "fa-icon-class-for-link1",
    },
    
    // Add more team members here
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-center px-10 3xl:px-0">
        <div className="max-w-7xl w-full">
          <div className="w-full mt-5">
            <div className="flex items-center gap-5">
              <div className="hidden lg:block relative">
                <i className="fa fa-users hidden lg:block text-5xl text-primary" />
              </div>
              <div>
                <h1 className="text-lg lg:text-3xl text-transparent bg-clip-text bg-gradient-to-tr from-primary to-secondary font-extrabold">
                  Our Team
                </h1>
                <p
                  className={`text-sm lg:text-base text-gray-700 $["bold-text"]}`}
                >
                  Meet the team who have worked hard on this project
                </p>
              </div>
            </div>
          </div>
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
              {teamMembers.map((teamMember, index) => (
                <PartnerCard key={index} {...teamMember} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 mt-10">
              {/* Display a message when there are no team members */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
