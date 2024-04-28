const { description } = require("./seo.config");

module.exports = {
  apiAddress: "https://api.dscinflux.xyz/v1",
  authRequired: ["/[id]/edit", "/submit"],
  titles: {
    "/": {
      title: "Home",
      description: "Start introducing yourself to the world.",
    },
    "/team": {
      title: "Team",
      description: "Meet the team behind DscInflux.",
    },
    "/stats": {
      title: "Stats",
      description: "Check out Dscinflux's Stats.",
    },
    "/profile/*": {
      title:"Profile",
      description: "profile of the user"
    },
    "/explore": {
      title: "Explore",
      description: "Find new peoples for your team.",
    },
    "/submit": {
      title: "Submit",
      description: "Submit your Profile to the DscInflux.",
    },
    "/partners": {
      title: "Partners",
      description: "View our amazing partners!!",
    },
    "/other/credits": {
      title: "Credits",
      description: "View the people you have supported us through this journy",
    },
    "/other/aboutus": {
      title: "About",
      description: "Learn more about us in this page",
    },
    
    "/privacy": {
      title: "Privacy",
      description: "View our Privacy Policy",
    },
    "/terms": {
      title: "Terms",
      description: "View our TOS",
    },
    "/support": {
      title: "Support",
      description: "View our Support page",
    },
    "/[id]": {
      title: "[id] - View Profile",
      description: "Start introducing yourself to the world.",
    },
    "/[id]/edit": {
      title: "Edit Profile",
      description: "Start introducing yourself to the world.",
    },
  },
};
