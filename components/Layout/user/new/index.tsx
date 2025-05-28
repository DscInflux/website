"use client";

import type React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  User,
  Settings,
  Shield,
  Briefcase,
  Save,
  X,
  Camera,
  LinkIcon,
  Mail,
  MapPin,
  Calendar,
  Languages,
  AtSign,
  Plus,
  Check,
  ChevronRight,
  ChevronLeft,
  Globe,
  Upload,
  Sparkles,
  Zap,
  Share2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Social options for selection
export const SOCIAL_OPTIONS = [
  {
    name: "Github",
    url: "https://github.com/{username}",
    color: "#000000",
    enabled: true,
  },
  {
    name: "Twitter/X",
    url: "https://x.com/{username}",
    color: "#1DA1F2",
    enabled: true,
  },
  {
    name: "Facebook",
    url: "https://facebook.com/{username}",
    color: "#3b5998",
    enabled: true,
  },
  {
    name: "Instagram",
    url: "https://instagram.com/{username}",
    color: "#E1306C",
    enabled: true,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/{username}",
    color: "#0077B5",
    enabled: true,
  },
  {
    name: "StackOverflow",
    url: "https://stackoverflow.com/users/{username}",
    color: "#f48024",
    enabled: true,
  },
  {
    name: "Reddit",
    url: "https://reddit.com/user/{username}",
    color: "#FF4500",
    enabled: true,
  },
  {
    name: "YouTube",
    url: "https://youtube.com/channel/{username}",
    color: "#FF0000",
    enabled: true,
  },
  {
    name: "Steam",
    url: "https://steamcommunity.com/{username}",
    color: "#171A21",
    enabled: true,
  },
  {
    name: "Twitch",
    url: "https://www.twitch.tv/{username}",
    color: "#9147FF",
    enabled: true,
  },
  {
    name: "MyAnimeList",
    url: "https://myanimelist.net/profile/{username}",
    color: "#2E51A2",
    enabled: true,
  },
];

export default function EditProfilePage({
  roles: initialRoles = [],
  skills: initialSkills = [],
  isSubmit = false,
}: {
  roles?: string[];
  skills?: string[];
  isSubmit?: boolean;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user || null;
  const [entity, setEntity] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  // Form state
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [socials, setSocials] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [banner, setBanner] = useState("");
  const [avatar, setAvatar] = useState("");
  const [language, setLanguage] = useState("");

  // New social media state
  const [newSocialName, setNewSocialName] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  // Privacy settings
  const [isShow, setIsShow] = useState(true);
  const [isEmailPrivate, setIsEmailPrivate] = useState(true);
  const [isBirthdayPrivate, setIsBirthdayPrivate] = useState(true);
  const [isLocationPrivate, setIsLocationPrivate] = useState(true);
  const [isGenderPrivate, setIsGenderPrivate] = useState(true);
  const [isSexualityPrivate, setIsSexualityPrivate] = useState(true);
  const [isPronounsPrivate, setIsPronounsPrivate] = useState(true);

  // New skill/role input state
  const [newSkill, setNewSkill] = useState("");
  const [newRole, setNewRole] = useState("");

  // File upload state
  const [files, setFiles] = useState<any[]>([]);
  const [Uploading, setUploading] = useState(false);
  // Refs for file inputs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // New state for pronouns, website, sexuality, and timeZone
  const [pronouns, setPronouns] = useState("");
  const [website, setWebsite] = useState("");
  const [sexuality, setSexuality] = useState("");
  const [timeZone, setTimeZone] = useState("");

  // Fetch entity for the current user (if logged in) using React Query
  const { data: entityData, isLoading: entityLoading } = useQuery({
    queryKey: ["edit-entity", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await fetch(`/api/get/entity?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch entity");
      return res.json();
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (entityLoading) {
      setLoading(true);
      return;
    }
    if (entityData) {
      setEntity(entityData);
      setIsEdit(true);
      setAbout(entityData.about || "");
      setEmail(entityData.email || "");
      setUrl(entityData.url || "");
      setGender(entityData.gender || "");
      setBirthday(entityData.birthday ? entityData.birthday.slice(0, 10) : "");
      setLocation(entityData.location || "");
      setOccupation(entityData.occupation?.join(", ") || "");
      setSocials(entityData.socials || []);
      setSkills(entityData.skills || []);
      setRoles(entityData.roles || []);
      setBanner(entityData.banner || "");
      setAvatar(entityData.avatar || "");
      setIsShow(entityData.isShow ?? true);
      setIsEmailPrivate(entityData.isEmailPrivate ?? true);
      setIsBirthdayPrivate(entityData.isBirthdayPrivate ?? true);
      setIsLocationPrivate(entityData.isLocationPrivate ?? true);
      setIsGenderPrivate(entityData.isGenderPrivate ?? true);
      setIsSexualityPrivate(entityData.isSexualityPrivate ?? true);
      setIsPronounsPrivate(entityData.isPronounsPrivate ?? true);
      setLanguage(entityData.language || "");
      setPronouns(entityData.pronouns || "");
      setWebsite(entityData.website || "");
      setSexuality(entityData.sexuality || "");
      setTimeZone(entityData.timeZone || "");
    } else {
      setEntity(null);
      setIsEdit(false);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityData, entityLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    // Only include banner/avatar if not empty string, otherwise let backend use default
    const payload: any = {
      about,
      email,
      url,
      gender,
      birthday: birthday ? new Date(birthday).toISOString() : undefined,
      location,
      occupation: occupation ? occupation.split(",").map((s) => s.trim()) : [],
      socials,
      skills,
      roles,
      language,
      pronouns,
      website,
      sexuality,
      timeZone,
      privacy: {
        isShow,
        isEmailPrivate,
        isBirthdayPrivate,
        isLocationPrivate,
        isGenderPrivate,
        isPronounsPrivate,
        isSexualityPrivate,
      },
      staff: false,
    };
    if (banner && banner.trim() !== "") payload.banner = banner;
    if (avatar && avatar.trim() !== "") payload.avatar = avatar;

    try {
      const res = await fetch(
        isEdit ? "/api/post/entity/edit" : "/api/post/entity/new",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json(); // god is dead, and we have killed him.

      if (res.ok) {
        setSuccess(
          isEdit
            ? "Profile updated successfully!"
            : "Profile created successfully!",
        );
        // Only redirect if isSubmit is true and the user actually clicked the submit button
        if (isSubmit && data.entity?.url) {
          router.push("/user/" + data.entity.url);
        }
      } else {
        setError(data.error?.toString() || "Something went wrong");
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const addRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole("");
    }
  };

  const addSocial = () => {
    if (newSocialName.trim() && newSocialUrl.trim()) {
      setSocials([
        ...socials,
        {
          name: newSocialName.trim(),
          url: newSocialUrl.trim(),
        },
      ]);
      setNewSocialName("");
      setNewSocialUrl("");
    }
  };

  const uploadFiles = async (
    type: "avatar" | "banner",
    files: FileList | null,
  ): Promise<void> => {
    const API_URL = "https://bytepurr.purrquinox.com";
    if (!files || files.length === 0 || !user?.id) return;
    Array.from(files).forEach(async (p) => {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", p);
      try {
        const e = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: {
            userID: String(user.id),
            platform: "DscInflux",
          },
          body: formData,
        });
        const resp = await e.json();
        let newUrl = `${API_URL}/${resp.key}`;
        if (type === "avatar") setAvatar(newUrl);
        if (type === "banner") setBanner(newUrl);
        // Only update DB if in edit mode
        if (isEdit) {
          const payload = {
            avatar: type === "avatar" ? newUrl : avatar,
            banner: type === "banner" ? newUrl : banner,
          };
          await fetch("/api/post/entity/edit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
        setUploading(false);
      } catch (err) {
        setUploading(false);
        setError("File upload failed");
      }
    });
  };

  const tabs = [
    {
      id: 0,
      name: "Basic Info",
      icon: <User className="w-5 h-5" />,
      description: "Your personal information",
    },
    {
      id: 1,
      name: "Appearance",
      icon: <Settings className="w-5 h-5" />,
      description: "Customize your profile appearance",
    },
    {
      id: 2,
      name: "Privacy",
      icon: <Shield className="w-5 h-5" />,
      description: "Manage your privacy settings",
    },
    {
      id: 3,
      name: "Skills & Roles",
      icon: <Briefcase className="w-5 h-5" />,
      description: "Add your skills and roles",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-20 h-20 border-4 border-primary rounded-full border-t-transparent shadow-lg"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6">
      {/* Background patterns */}
      <div className="fixed inset-0 z-0 opacity-30 dark:opacity-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.1),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(67,56,202,0.1),transparent_50%)]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isEdit ? "Edit Your Profile" : "Create Your Profile"}
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            {isEdit
              ? "Update your information to keep your profile current"
              : "Tell the community about yourself and what you do"}
          </p>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700"
        >
          {/* Banner preview */}
          <div
            className="h-64 w-full bg-gradient-to-r from-primary/80 to-secondary/80 relative"
            style={
              banner
                ? {
                    backgroundImage: `url(${banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          >
            {/* Banner overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

            {/* Banner edit button */}
            <div className="absolute top-4 right-4 z-10">
              <div
                className="bg-black/30 backdrop-blur-md text-white rounded-full p-2 cursor-pointer hover:bg-black/50 transition-all duration-200"
                onClick={() => bannerInputRef.current?.click()}
              >
                <Camera className="w-6 h-6" />
              </div>
              <input
                ref={bannerInputRef}
                id="banner-upload-header"
                type="file"
                className="hidden"
                onChange={(e) => {
                  uploadFiles("banner", e.target.files);
                }}
              />
            </div>

            {/* Avatar overlay */}
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 md:left-12 md:transform-none">
              <div className="relative group">
                <div
                  className="w-40 h-40 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-xl"
                  style={
                    avatar
                      ? {
                          backgroundImage: `url(${avatar})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {}
                  }
                >
                  {!avatar && <Camera className="w-12 h-12 text-gray-400" />}
                </div>
                <div
                  className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                  onClick={() => avatarInputRef.current?.click()}
                  style={{ cursor: "pointer" }}
                >
                  <div className="text-white">
                    <Camera className="w-8 h-8 mx-auto" />
                    <span className="text-xs font-medium">Change Photo</span>
                  </div>
                </div>
                <input
                  ref={avatarInputRef}
                  id="avatar-upload-header"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    uploadFiles("avatar", e.target.files);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="pt-24 pb-12 px-6 md:px-12">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 md:justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 font-medium text-sm transition-all duration-200 rounded-xl ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Tab content */}
              <div className="mb-10">
                <AnimatePresence mode="wait">
                  {/* Basic Info */}
                  {activeTab === 0 && (
                    <motion.div
                      key="basic-info"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <User className="w-6 h-6 text-primary" />
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Basic Information
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400">
                            {tabs[0].description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-12 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                              placeholder="your.email@example.com"
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {isEmailPrivate
                              ? "This will be kept private"
                              : "This will be visible to others"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Profile URL
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <LinkIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                              className="pl-12 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                              placeholder="username"
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <Globe className="w-3.5 h-3.5" />
                            This will be your public profile URL
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Location
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="pl-12 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                              placeholder="City, Country"
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            {isLocationPrivate ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                This is currently private
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                This is currently public
                              </>
                            )}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Birthday
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="date"
                              value={birthday}
                              onChange={(e) => setBirthday(e.target.value)}
                              className="pl-12 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            {isBirthdayPrivate ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                This is currently private
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                This is currently public
                              </>
                            )}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Gender
                          </label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="I don't want to say">
                              I don't want to say
                            </option>
                          </select>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            {isGenderPrivate ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                This is currently private
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                This is currently public
                              </>
                            )}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Occupation
                          </label>
                          <input
                            type="text"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                            placeholder="Software Engineer, Designer, etc."
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Separate multiple occupations with commas
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Pronouns
                          </label>
                          <input
                            type="text"
                            value={pronouns}
                            onChange={(e) => setPronouns(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                            placeholder="e.g. He/Him, She/Her, They/Them"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Website
                          </label>
                          <input
                            type="text"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                            placeholder="https://dscinflux.xyz"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Sexuality
                          </label>
                          <input
                            type="text"
                            value={sexuality}
                            onChange={(e) => setSexuality(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                            placeholder="e.g. Straight, Gay, Bisexual, etc."
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            {isSexualityPrivate ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" /> This is
                                currently private
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" /> This is
                                currently public
                              </>
                            )}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Timezone
                          </label>
                          <input
                            type="text"
                            value={timeZone}
                            onChange={(e) => setTimeZone(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                            placeholder="e.g. UTC+2, America/New_York, etc."
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            This will be shown on your profile
                          </p>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            About
                          </label>
                          <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows={5}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                            placeholder="Tell us about yourself..."
                          ></textarea>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            This will be displayed on your profile page
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Appearance */}
                  {activeTab === 1 && (
                    <motion.div
                      key="appearance"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Settings className="w-6 h-6 text-primary" />
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Appearance
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400">
                            {tabs[1].description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Profile Picture
                            </h3>
                            <div className="flex gap-6 items-center">
                              <div
                                className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg"
                                style={
                                  avatar
                                    ? {
                                        backgroundImage: `url(${avatar})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                      }
                                    : {}
                                }
                              >
                                {!avatar && (
                                  <Camera className="w-10 h-10 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 space-y-4">
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LinkIcon className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <input
                                    type="text"
                                    value={avatar}
                                    onChange={(e) => setAvatar(e.target.value)}
                                    className="pl-12 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                                    placeholder="https://example.com/avatar.jpg"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      avatarInputRef.current?.click()
                                    }
                                    className="flex-1 flex items-center justify-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 py-2.5 px-4 rounded-xl font-medium transition-colors"
                                  >
                                    <Upload className="w-5 h-5" />
                                    Upload
                                  </button>
                                  <input
                                    ref={avatarInputRef}
                                    id="avatar-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                      uploadFiles("avatar", e.target.files);
                                    }}
                                  />
                                  {avatar && (
                                    <button
                                      type="button"
                                      onClick={() => setAvatar("")}
                                      className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 p-2.5 rounded-xl font-medium transition-colors"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Language
                            </h3>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Languages className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="pl-12 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                                placeholder="English, Spanish, etc."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Banner Image
                            </h3>
                            <div className="space-y-4">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <LinkIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  value={banner}
                                  onChange={(e) => setBanner(e.target.value)}
                                  className="pl-12 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3.5 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                                  placeholder="https://example.com/banner.jpg"
                                />
                              </div>
                              <div
                                className="w-full h-48 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg"
                                style={
                                  banner
                                    ? {
                                        backgroundImage: `url(${banner})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                      }
                                    : {}
                                }
                              >
                                {!banner && (
                                  <Camera className="w-12 h-12 text-gray-400" />
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    bannerInputRef.current?.click()
                                  }
                                  className="flex-1 flex items-center justify-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 py-2.5 px-4 rounded-xl font-medium transition-colors"
                                >
                                  <Upload className="w-5 h-5" />
                                  Upload Banner
                                </button>
                                <input
                                  ref={bannerInputRef}
                                  id="banner-upload"
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    uploadFiles("banner", e.target.files);
                                  }}
                                />
                                {banner && (
                                  <button
                                    type="button"
                                    onClick={() => setBanner("")}
                                    className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 p-2.5 rounded-xl font-medium transition-colors"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Privacy */}
                  {activeTab === 2 && (
                    <motion.div
                      key="privacy"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-6 h-6 text-primary" />
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Privacy Settings
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400">
                            {tabs[2].description}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 shadow-inner">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                                Show Profile
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                If disabled, your profile will be hidden from
                                the public
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isShow}
                                onChange={() => setIsShow(!isShow)}
                                className="sr-only peer"
                              />
                              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                                Private Email
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                If enabled, your email will be hidden from the
                                public
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isEmailPrivate}
                                onChange={() =>
                                  setIsEmailPrivate(!isEmailPrivate)
                                }
                                className="sr-only peer"
                              />
                              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                                Private Birthday
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                If enabled, your birthday will be hidden from
                                the public
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isBirthdayPrivate}
                                onChange={() =>
                                  setIsBirthdayPrivate(!isBirthdayPrivate)
                                }
                                className="sr-only peer"
                              />
                              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                                Private Location
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                If enabled, your location will be hidden from
                                the public
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isLocationPrivate}
                                onChange={() =>
                                  setIsLocationPrivate(!isLocationPrivate)
                                }
                                className="sr-only peer"
                              />
                              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                                Private Gender
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                If enabled, your gender will be hidden from the
                                public
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isGenderPrivate}
                                onChange={() =>
                                  setIsGenderPrivate(!isGenderPrivate)
                                }
                                className="sr-only peer"
                              />
                              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                                Private Sexuality
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                If enabled, your sexuality will be hidden from
                                the public
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSexualityPrivate}
                                onChange={() =>
                                  setIsSexualityPrivate(!isSexualityPrivate)
                                }
                                className="sr-only peer"
                              />
                              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                                Private Pronouns
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                If enabled, your pronouns will be hidden from
                                the public
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isPronounsPrivate}
                                onChange={() =>
                                  setIsPronounsPrivate(!isPronounsPrivate)
                                }
                                className="sr-only peer"
                              />
                              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Skills & Roles */}
                  {activeTab === 3 && (
                    <motion.div
                      key="skills-roles"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Briefcase className="w-6 h-6 text-primary" />
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Skills & Roles
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400">
                            {tabs[3].description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                              <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              Skills
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-6 min-h-[100px]">
                            {skills.length === 0 ? (
                              <div className="w-full flex items-center justify-center h-24 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                  No skills added yet
                                </p>
                              </div>
                            ) : (
                              skills.map((skill, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 px-3 py-2 rounded-full group hover:from-primary/20 hover:to-secondary/20 transition-all duration-200"
                                >
                                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {skill}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSkills(
                                        skills.filter((_, i) => i !== index),
                                      )
                                    }
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Add a skill"
                              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                (e.preventDefault(), addSkill())
                              }
                            />
                            <button
                              type="button"
                              onClick={addSkill}
                              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2 flex items-center gap-2 transition-colors shadow-md hover:shadow-lg shadow-primary/10"
                            >
                              <Plus size={18} />
                              Add
                            </button>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                              <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              Roles
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-6 min-h-[100px]">
                            {roles.length === 0 ? (
                              <div className="w-full flex items-center justify-center h-24 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                  No roles added yet
                                </p>
                              </div>
                            ) : (
                              roles.map((role, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                                >
                                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {role}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRoles(
                                        roles.filter((_, i) => i !== index),
                                      )
                                    }
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              placeholder="Add a role"
                              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                (e.preventDefault(), addRole())
                              }
                            />
                            <button
                              type="button"
                              onClick={addRole}
                              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2 flex items-center gap-2 transition-colors shadow-md hover:shadow-lg shadow-primary/10"
                            >
                              <Plus size={18} />
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                            <Share2 className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Social Media
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {socials.length === 0 ? (
                            <div className="md:col-span-2 flex items-center justify-center h-24 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                No social links added yet
                              </p>
                            </div>
                          ) : (
                            socials.map((social, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:shadow-md transition-all duration-200 group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                    <AtSign className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                                      {social.name}
                                    </h4>
                                    <a
                                      href={social.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:text-primary/80 truncate max-w-[200px] flex items-center gap-1"
                                    >
                                      {social.url.length > 30
                                        ? social.url.substring(0, 30) + "..."
                                        : social.url}
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSocials(
                                      socials.filter((_, i) => i !== index),
                                    )
                                  }
                                  className="text-gray-400 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-1">
                            <select
                              value={newSocialName}
                              onChange={(e) => {
                                const selectedOption = SOCIAL_OPTIONS.find(
                                  (option) => option.name === e.target.value,
                                );
                                setNewSocialName(e.target.value);
                                setNewSocialUrl(
                                  selectedOption ? selectedOption.url : "",
                                );
                              }}
                              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                              <option value="">Select a platform</option>
                              {SOCIAL_OPTIONS.map((option) => (
                                <option key={option.name} value={option.name}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-1">
                            <input
                              type="text"
                              value={newSocialUrl}
                              onChange={(e) => setNewSocialUrl(e.target.value)}
                              placeholder="URL"
                              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={addSocial}
                              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg shadow-primary/10"
                            >
                              <Plus size={18} />
                              Add Social Link
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex items-start gap-3"
                  >
                    <div className="p-1 bg-red-100 dark:bg-red-800/30 rounded-full flex-shrink-0 mt-0.5">
                      <X className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Error</h4>
                      <p>{error}</p>
                    </div>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 flex items-start gap-3"
                  >
                    <div className="p-1 bg-green-100 dark:bg-green-800/30 rounded-full flex-shrink-0 mt-0.5">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Success</h4>
                      <p>{success}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                  className={`px-6 py-3 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                    activeTab === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={activeTab === 0}
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <div className="flex gap-3">
                  {activeTab < tabs.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab(Math.min(tabs.length - 1, activeTab + 1))
                      }
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-primary/20 hover:shadow-primary/30"
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-70"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          {isEdit ? "Save Changes" : "Create Profile"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
