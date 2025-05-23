"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import UserCard from "@/components/cards/UserCards"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HiOutlineAdjustments,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineX,
  HiChevronDown,
} from "react-icons/hi"
import { useQuery } from "@tanstack/react-query"

interface RadioGroupItem {
  label: string
  value?: any
  icon?: React.ReactNode
  default?: boolean
}

interface RadioGroupProps {
  items: RadioGroupItem[]
  value: number | null
  onChange: (item: RadioGroupItem) => void
}

const RadioGroup: React.FC<RadioGroupProps> = ({ items, value, onChange }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
            value === index
              ? "bg-primary/10 text-primary font-medium shadow-sm"
              : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange({ label: item.label, value: item.value })}
        >
          <div
            className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border-2 transition-colors ${
              value === index ? "border-primary" : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {value === index && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
          </div>
          <div className="flex items-center gap-2">
            {item.icon && <span className="text-xl">{item.icon}</span>}
            <span className="text-base">{item.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// CheckboxGroup Props
interface CheckboxGroupItem {
  label: string
}

interface CheckboxGroupProps {
  items: CheckboxGroupItem[]
  value: string[]
  query?: any
  onChange: (value: string[]) => void
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ items, value, onChange }) => {
  const handleCheckboxChange = (itemLabel: string) => {
    const newValue = value.includes(itemLabel) ? value.filter((v) => v !== itemLabel) : [...value, itemLabel]
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
            value.includes(item.label)
              ? "bg-primary/10 text-primary font-medium shadow-sm"
              : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleCheckboxChange(item.label)}
        >
          <div
            className={`w-5 h-5 rounded-md mr-3 flex items-center justify-center transition-colors ${
              value.includes(item.label) ? "bg-primary border-primary" : "border-2 border-gray-300 dark:border-gray-600"
            }`}
          >
            {value.includes(item.label) && <HiOutlineX className="text-white" size={14} />}
          </div>
          <span className="text-base">{item.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

export default function ExplorePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { data: session } = useSession()
  const [active, setActive] = useState<number>(0)
  const [language, setLanguage] = useState<number | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    sorting: true,
    language: true,
    roles: true,
    skills: true,
  })
  const [search, setSearch] = useState<string>("")

  const user = session?.user || null

  const sortings: RadioGroupItem[] = [
    {
      label: "Newest",
      value: "newest",
      icon: <HiOutlineSortDescending className="text-lg" />,
      default: true,
    },
    {
      label: "Oldest",
      value: "oldest",
      icon: <HiOutlineSortAscending className="text-lg" />,
    },
    {
      label: "Popular",
      value: "popular",
      icon: <HiOutlineHeart className="text-lg" />,
    },
    {
      label: "Random",
      value: "random",
      icon: <HiOutlineSparkles className="text-lg" />,
    },
  ]

  // --- React Query: Fetch all user data ---
  const {
    data: allItems = [],
    isLoading: allItemsLoading,
    error: allItemsError,
  } = useQuery({
    queryKey: ['explore-entities', searchParams.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/get/entity/explore?page=1&limit=100&${searchParams.toString()}`);
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : [];
    },
  });

  // --- DYNAMIC FILTER OPTIONS ---
  const [dynamicRoles, setDynamicRoles] = useState<{ name: string; slug: string }[]>([])
  const [dynamicSkills, setDynamicSkills] = useState<{ name: string; slug: string }[]>([])
  const [dynamicLanguages, setDynamicLanguages] = useState<string[]>([])

  useEffect(() => {
    if (allItems.length > 0) {
      // Roles
      const rolesSet = new Set<string>()
      allItems.forEach((item: any) => {
        if (Array.isArray(item.roles)) {
          item.roles.forEach((role: string) => rolesSet.add(role))
        }
      })
      setDynamicRoles(
        Array.from(rolesSet)
          .filter(Boolean)
          .map((r) => ({ name: r, slug: r.toLowerCase().replace(/\s+/g, "-") })),
      )
      // Skills
      const skillsSet = new Set<string>()
      allItems.forEach((item: any) => {
        if (Array.isArray(item.skills)) {
          item.skills.forEach((skill: string) => skillsSet.add(skill))
        }
      })
      setDynamicSkills(
        Array.from(skillsSet)
          .filter(Boolean)
          .map((s) => ({ name: s, slug: s.toLowerCase().replace(/\s+/g, "-") })),
      )
      // Languages
      const langSet = new Set<string>()
      allItems.forEach((item: any) => {
        if (typeof item.language === "string" && item.language.trim()) {
          item.language.split(/,|\//).forEach((lang: string) => langSet.add(lang.trim()))
        }
      })
      setDynamicLanguages(Array.from(langSet).filter(Boolean))
    }
  }, [allItems])

  // Helper to get query params as object
  function getQueryObject() {
    const obj: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }

  useEffect(() => {
    const query = getQueryObject()
    if (query.sort) {
      const index = sortings.findIndex((item) => item.value === query.sort)
      if (index !== -1) {
        setActive(index)
      } else {
        const defaultIndex = sortings.findIndex((item) => item.default)
        setActive(defaultIndex)
      }
    } else {
      const defaultIndex = sortings.findIndex((item) => item.default)
      setActive(defaultIndex)
    }
    if (query.language) {
      const findIndex = dynamicLanguages.findIndex((item) => item === query.language)
      if (findIndex !== -1) {
        setLanguage(findIndex)
      } else {
        setLanguage(null)
      }
    } else {
      setLanguage(null)
    }
    if (query.name) {
      setSearch(query.name)
    } else {
      setSearch("")
    }
  }, [searchParams])

  // Helper to update query params
  function updateQuery(newQuery: Record<string, any>) {
    const params = new URLSearchParams(getQueryObject())
    Object.entries(newQuery).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSortChange = (item: RadioGroupItem) => {
    updateQuery({ sort: item.value })
    setActive(sortings.findIndex((i) => i.value === item.value))
  }

  const handleLanguageChange = (item: RadioGroupItem) => {
    updateQuery({ language: item.label })
    setLanguage(dynamicLanguages.findIndex((i) => i === item.label))
  }

  const handleRolesChange = (selectedRoles: string[]) => {
    updateQuery({ roles: selectedRoles.join(",") })
  }

  const handleSkillsChange = (selectedSkills: string[]) => {
    updateQuery({ skills: selectedSkills.join(",") })
  }

  // --- FILTER & SORT ---
  // Filter and sort users client-side
  const filteredItems = useMemo(() => {
    let filtered = [...allItems]
    // Search
    if (search) {
      filtered = filtered.filter((item: any) => {
        const uname = item.discordUsername?.toLowerCase() || ""
        const dname = item.discordDisplayName?.toLowerCase() || ""
        return uname.includes(search.toLowerCase()) || dname.includes(search.toLowerCase())
      })
    }
    // Language filter
    const query = getQueryObject()
    if (query.language) {
      filtered = filtered.filter((item: any) => {
        if (!item.language) return false
        return item.language
          .split(/,|\//)
          .map((l: string) => l.trim())
          .includes(query.language)
      })
    }
    // Roles filter
    if (query.roles) {
      const selectedRoles = query.roles.split(",")
      filtered = filtered.filter(
        (item: any) => Array.isArray(item.roles) && selectedRoles.every((role) => item.roles.includes(role)),
      )
    }
    // Skills filter
    if (query.skills) {
      const selectedSkills = query.skills.split(",")
      filtered = filtered.filter(
        (item: any) => Array.isArray(item.skills) && selectedSkills.every((skill) => item.skills.includes(skill)),
      )
    }
    // Sort
    if (sortings[active]?.value === "newest") {
      filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortings[active]?.value === "oldest") {
      filtered = filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (sortings[active]?.value === "popular") {
      filtered = filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    } else if (sortings[active]?.value === "random") {
      filtered = filtered.sort(() => Math.random() - 0.5)
    }
    return filtered
  }, [allItems, search, active, searchParams, dynamicLanguages, sortings])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const FilterSection = ({
    title,
    expanded,
    onToggle,
    children,
  }: {
    title: string
    expanded: boolean
    onToggle: () => void
    children: React.ReactNode
  }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between cursor-pointer mb-3" onClick={onToggle}>
        <h3 className="text-lg font-semibold">{title}</h3>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <HiChevronDown className="text-xl text-gray-500" />
        </motion.div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Mobile Filter Button - Fixed at bottom for mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-10">
        <motion.button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HiOutlineAdjustments className="text-lg" />
          <span>{mobileFiltersOpen ? "Hide Filters" : "Show Filters"}</span>
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <AnimatePresence>
          {(mobileFiltersOpen || window.innerWidth >= 1024) && (
            <motion.div
              className={`lg:w-1/4 lg:static fixed inset-0 z-50 lg:z-0 ${
                mobileFiltersOpen ? "block" : "hidden lg:block"
              }`}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-6 rounded-2xl shadow-lg bg-black h-full lg:h-auto overflow-auto">
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <HiOutlineX className="text-xl" />
                  </button>
                </div>

                <FilterSection
                  title="Sort By"
                  expanded={expandedSections.sorting}
                  onToggle={() => toggleSection("sorting")}
                >
                  <RadioGroup items={sortings} value={active} onChange={handleSortChange} />
                </FilterSection>

                <FilterSection
                  title="Language"
                  expanded={expandedSections.language}
                  onToggle={() => toggleSection("language")}
                >
                  <CheckboxGroup
                    items={dynamicLanguages.map((lang) => ({ label: lang }))}
                    value={language !== null ? [dynamicLanguages[language]] : []}
                    onChange={(selected) => {
                      const index = dynamicLanguages.findIndex((lang) => lang === selected[0])
                      setLanguage(index)
                      updateQuery({ language: index !== -1 ? dynamicLanguages[index] : undefined })
                    }}
                  />
                </FilterSection>

                <FilterSection title="Roles" expanded={expandedSections.roles} onToggle={() => toggleSection("roles")}>
                  <CheckboxGroup
                    items={dynamicRoles.map((r) => ({ label: r.name }))}
                    value={searchParams.get("roles") ? searchParams.get("roles")!.split(",") : []}
                    onChange={handleRolesChange}
                  />
                </FilterSection>

                <FilterSection
                  title="Skills"
                  expanded={expandedSections.skills}
                  onToggle={() => toggleSection("skills")}
                >
                  <CheckboxGroup
                    items={dynamicSkills.map((s) => ({ label: s.name }))}
                    value={searchParams.get("skills") ? searchParams.get("skills")!.split(",") : []}
                    onChange={handleSkillsChange}
                  />
                </FilterSection>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Section */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative bg-black">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  if (e.target.value === "") {
                    updateQuery({ name: undefined })
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateQuery({ name: search })
                  }
                }}
                className="w-full p-4 pl-12  rounded-xl transition-all"
                placeholder="Search users..."
              />
              <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              {search && (
                <button
                  onClick={() => {
                    setSearch("")
                    updateQuery({ name: undefined })
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <HiOutlineX className="text-xl" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {searchParams.get("language") && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full"
              >
                <span>Language: {searchParams.get("language")}</span>
                <button
                  onClick={() => updateQuery({ language: undefined })}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <HiOutlineX className="text-sm" />
                </button>
              </motion.div>
            )}
            {searchParams.get("roles") &&
              searchParams
                .get("roles")!
                .split(",")
                .map((role) => (
                  <motion.div
                    key={role}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full"
                  >
                    <span>Role: {role}</span>
                    <button
                      onClick={() => {
                        const roles = searchParams
                          .get("roles")!
                          .split(",")
                          .filter((r) => r !== role)
                        updateQuery({ roles: roles.length ? roles.join(",") : undefined })
                      }}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <HiOutlineX className="text-sm" />
                    </button>
                  </motion.div>
                ))}
            {searchParams.get("skills") &&
              searchParams
                .get("skills")!
                .split(",")
                .map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full"
                  >
                    <span>Skill: {skill}</span>
                    <button
                      onClick={() => {
                        const skills = searchParams
                          .get("skills")!
                          .split(",")
                          .filter((s) => s !== skill)
                        updateQuery({ skills: skills.length ? skills.join(",") : undefined })
                      }}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <HiOutlineX className="text-sm" />
                    </button>
                  </motion.div>
                ))}
            {(searchParams.get("language") || searchParams.get("roles") || searchParams.get("skills")) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  updateQuery({ language: undefined, roles: undefined, skills: undefined })
                }}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700"
              >
                <HiOutlineRefresh className="text-sm" />
                <span>Clear all</span>
              </motion.button>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4 text-gray-500 dark:text-gray-400">
            Found {filteredItems.length} {filteredItems.length === 1 ? "user" : "users"}
          </div>

          {/* Users Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
              hidden: {},
            }}
          >
            {filteredItems.length === 0 && (
              <motion.div
                className="col-span-3 text-center py-16 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <HiOutlineSearch className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No results found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filters.</p>
                <button
                  onClick={() => {
                    setSearch("")
                    updateQuery({
                      name: undefined,
                      language: undefined,
                      roles: undefined,
                      skills: undefined,
                    })
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Reset all filters
                </button>
              </motion.div>
            )}
            {filteredItems.map((user) => (
              <motion.div
                key={user.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
              >
                <UserCard entity={user} />
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          {filteredItems.length > 0 && (
            <div className="mt-10 text-center">
              <motion.button
                className="px-6 py-3 bg-primary text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Load More
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
