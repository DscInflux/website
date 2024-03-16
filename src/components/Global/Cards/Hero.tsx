export default function Hero({ name, username, className }) {
  return (
    <div className={className ?? ""}>
      <div className="w-96 h-96 bg-light dark:bg-dark rounded-lg overflow-hidden">
        <div>
          <div className={"w-full h-40 rounded-lg overflow-hidden"}>
            <img
              src={
                "https://cdn.dscinflux.xyz/assets/jpg/influxbanner.jpg"
              }
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-center">
            <img
              className="w-24 h-24 rounded-full -mt-12 ring-4 ring-light dark:ring-dark ring-offset-0"
              src="https://cdn.discordapp.com/avatars/853483818464051200/74b3a7342e282cbc217c752377ce8ff2.png?size=1024"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-2">
          <h1 className="text-xl font-medium">
            {name} <i className="fa-solid fa-badge-check" />
          </h1>
          <p className="text-[15px] font-light text-white/40">
            @{username ?? "discord"}
          </p>
        </div>
        <div className="p-6">
          <p>
            <i className="fa fa-location-dot text-white/40" />{" "}
            <span className="text-white/40">India</span>
          </p>
        </div>
      </div>
    </div>
  );
}
