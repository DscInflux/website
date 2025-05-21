"use client"

import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import type { Entity } from "@/types/entity"
import UserCard from "@/components/cards/UserCards";
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HiOutlineAdjustments,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineX,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi"

// InfiniteScrollComponent Props
interface InfiniteScrollComponentProps {
  url: string
  dataPath: string[]
  container: string
  upperContainer: string
  preRenderCount: number
  preRender: (item: any, i: number) => React.ReactNode
  itemsCount: number
  render: (item: any, i: number) => React.ReactNode
}

const InfiniteScrollComponent: React.FC<InfiniteScrollComponentProps> = ({
  url,
  dataPath,
  container,
  upperContainer,
  preRenderCount,
  preRender,
  itemsCount,
  render,
}) => {
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(url.replace("%s", page.toString()))
        const data = await res.json()
        const newItems = Array.isArray(data.data) ? data.data : []
        setItems((prevItems) => [...prevItems, ...newItems])
        setHasMore(newItems.length > 0)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [page, url])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
        !hasMore ||
        isLoading
      )
        return
      setPage((prevPage) => prevPage + 1)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasMore, isLoading])

  return (
    <div className={upperContainer}>
      <div className={container}>
        {items.length === 0
          ? Array.from({ length: preRenderCount }).map((_, i) => preRender(null, i))
          : items.map((item, i) => render(item, i))}
      </div>
      {isLoading && items.length > 0 && (
        <div className="flex justify-center mt-8 mb-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

// RadioGroup Props
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
          className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${
            value === index ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange({ label: item.label, value: item.value })}
        >
          <div
            className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center border ${
              value === index ? "border-primary" : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {value === index && <div className="w-2 h-2 rounded-full bg-primary"></div>}
          </div>
          <div className="flex items-center gap-2">
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
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
          className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${
            value.includes(item.label)
              ? "bg-primary/10 text-primary font-medium"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleCheckboxChange(item.label)}
        >
          <div
            className={`w-4 h-4 rounded mr-3 flex items-center justify-center ${
              value.includes(item.label) ? "bg-primary border-primary" : "border border-gray-300 dark:border-gray-600"
            }`}
          >
            {value.includes(item.label) && <HiOutlineX className="text-white" size={12} />}
          </div>
          <span>{item.label}</span>
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

  const languages: string[] = ["English", "Spanish", "French", "German", "Chinese"]

  const roles = [
    { name: "Developer", slug: "developer" },
    { name: "Designer", slug: "designer" },
    { name: "Manager", slug: "manager" },
  ]

  const skills = [
    { name: "JavaScript", slug: "javascript" },
    { name: "Python", slug: "python" },
    { name: "Java", slug: "java" },
  ]

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
      const findIndex = languages.findIndex((item) => item === query.language)
      if (findIndex !== -1) {
        setLanguage(findIndex)
      } else {
        setLanguage(null)
      }
    } else {
      setLanguage(null)
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
    setLanguage(languages.findIndex((i) => i === item.label))
  }

  const handleRolesChange = (selectedRoles: string[]) => {
    updateQuery({ roles: selectedRoles.join(",") })
  }

  const handleSkillsChange = (selectedSkills: string[]) => {
    updateQuery({ skills: selectedSkills.join(",") })
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const resetAllFilters = () => {
    router.push(pathname)
  }

  const FilterSection = ({
    title,
    section,
    resetQuery,
    children,
  }: {
    title: string
    section: keyof typeof expandedSections
    resetQuery: Record<string, undefined>
    children: React.ReactNode
  }) => (
    <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex items-center justify-between py-3 cursor-pointer" onClick={() => toggleSection(section)}>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          {title}
          {Object.keys(resetQuery)[0] && getQueryObject()[Object.keys(resetQuery)[0]] && (
            <span className="text-white text-xs font-medium px-2 py-0.5 rounded-full">Active</span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {Object.keys(resetQuery)[0] && getQueryObject()[Object.keys(resetQuery)[0]] && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                updateQuery(resetQuery)
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Reset filter"
            >
              <HiOutlineRefresh size={18} />
            </button>
          )}
          {expandedSections[section] ? (
            <HiChevronUp className="text-gray-500" />
          ) : (
            <HiChevronDown className="text-gray-500" />
          )}
        </div>
      </div>
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Users</h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Find and connect with people from around the world who meet your interests.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <HiOutlineSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
              >
                <HiOutlineFilter size={20} />
                Filters
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="rounded-xl shadow-sm p-5 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <HiOutlineAdjustments size={20} />
                    Filters
                  </h2>
                  <button onClick={resetAllFilters} className="text-primary hover:text-primary/80 text-sm font-medium">
                    Reset all
                  </button>
                </div>

                <FilterSection title="Sort By" section="sorting" resetQuery={{ sort: undefined }}>
                  <RadioGroup items={sortings} value={active} onChange={handleSortChange} />
                </FilterSection>

                <FilterSection title="Language" section="language" resetQuery={{ language: undefined }}>
                  <RadioGroup
                    items={languages.map((el) => ({ label: el }))}
                    value={language}
                    onChange={handleLanguageChange}
                  />
                </FilterSection>

                <FilterSection title="Roles" section="roles" resetQuery={{ roles: undefined }}>
                  <CheckboxGroup
                    items={roles.map((el) => ({ label: el.name }))}
                    value={getQueryObject().roles ? getQueryObject().roles.split(",") : []}
                    onChange={handleRolesChange}
                  />
                </FilterSection>

                <FilterSection title="Skills" section="skills" resetQuery={{ skills: undefined }}>
                  <CheckboxGroup
                    items={skills.map((el) => ({ label: el.name }))}
                    value={getQueryObject().skills ? getQueryObject().skills.split(",") : []}
                    onChange={handleSkillsChange}
                  />
                </FilterSection>
              </div>
            </div>

            {/* Mobile Filters */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 md:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25 }}
                    className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 p-5 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <HiOutlineAdjustments size={20} />
                        Filters
                      </h2>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <HiOutlineX size={20} />
                      </button>
                    </div>

                    <FilterSection title="Sort By" section="sorting" resetQuery={{ sort: undefined }}>
                      <RadioGroup items={sortings} value={active} onChange={handleSortChange} />
                    </FilterSection>

                    <FilterSection title="Language" section="language" resetQuery={{ language: undefined }}>
                      <RadioGroup
                        items={languages.map((el) => ({ label: el }))}
                        value={language}
                        onChange={handleLanguageChange}
                      />
                    </FilterSection>

                    <FilterSection title="Roles" section="roles" resetQuery={{ roles: undefined }}>
                      <CheckboxGroup
                        items={roles.map((el) => ({ label: el.name }))}
                        value={getQueryObject().roles ? getQueryObject().roles.split(",") : []}
                        onChange={handleRolesChange}
                      />
                    </FilterSection>

                    <FilterSection title="Skills" section="skills" resetQuery={{ skills: undefined }}>
                      <CheckboxGroup
                        items={skills.map((el) => ({ label: el.name }))}
                        value={getQueryObject().skills ? getQueryObject().skills.split(",") : []}
                        onChange={handleSkillsChange}
                      />
                    </FilterSection>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={resetAllFilters}
                        className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 font-medium"
                      >
                        Reset all
                      </button>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="flex-1 py-3 bg-primary text-white rounded-lg font-medium"
                      >
                        Apply filters
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Grid */}
            <InfiniteScrollComponent
              url={`/api/get/entity/explore?page=%s&limit=9${searchParams.toString() ? `&${searchParams.toString()}` : ""}`}
              dataPath={["data", "users"]}
              container="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
              upperContainer="flex-1"
              preRenderCount={9}
              preRender={(_, i) => <UserCard key={i} entity={{} as Entity} isSkeleton />}
              itemsCount={12}
              render={(item, i) => (
                <UserCard
                  key={i}
                  entity={{
                    ...item,
                    isLiked: user ? item.like?.includes(user.id) : false,
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
    </Suspense>
  )
}
