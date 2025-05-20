"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import type { Entity } from "@/types/entity";
import type { User } from "@/types/users";
import MiniCard from "@/components/cards/UserCards";

// InfiniteScrollComponent Props
interface InfiniteScrollComponentProps {
  url: string;
  dataPath: string[];
  container: string;
  upperContainer: string;
  preRenderCount: number;
  preRender: (item: any, i: number) => React.ReactNode;
  itemsCount: number;
  render: (item: any, i: number) => React.ReactNode;
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
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(url.replace("%s", page.toString()));
      const data = await res.json();
      const newItems = Array.isArray(data.data) ? data.data : [];
      setItems((prevItems) => [...prevItems, ...newItems]);
      setHasMore(newItems.length > 0);
    };
    fetchData();
  }, [page, url]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        !hasMore
      )
        return;
      setPage((prevPage) => prevPage + 1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <div className={upperContainer}>
      <div className={container}>
        {items.length === 0
          ? Array.from({ length: preRenderCount }).map((_, i) =>
              preRender(null, i),
            )
          : items.map((item, i) => render(item, i))}
      </div>
    </div>
  );
};

// RadioGroup Props
interface RadioGroupItem {
  label: string;
  value?: any;
  icon?: any;
  default?: boolean;
}
interface RadioGroupProps {
  items: RadioGroupItem[];
  value: number | null;
  onChange: (item: RadioGroupItem) => void;
}
const RadioGroup: React.FC<RadioGroupProps> = ({ items, value, onChange }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <input
            type="radio"
            id={`radio-${index}`}
            name="radio-group"
            checked={value === index}
            onChange={() => onChange({ label: item.label, value: index })}
            className="mr-2"
          />
          <label htmlFor={`radio-${index}`}>{item.label}</label>
        </div>
      ))}
    </div>
  );
};

// CheckboxGroup Props
interface CheckboxGroupItem {
  label: string;
}
interface CheckboxGroupProps {
  items: CheckboxGroupItem[];
  value: string[];
  query?: any;
  onChange: (value: string[]) => void;
}
const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  items,
  value,
  onChange,
}) => {
  const handleCheckboxChange = (itemLabel: string) => {
    const newValue = value.includes(itemLabel)
      ? value.filter((v) => v !== itemLabel)
      : [...value, itemLabel];
    onChange(newValue);
  };
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <input
            type="checkbox"
            id={`checkbox-${index}`}
            checked={value.includes(item.label)}
            onChange={() => handleCheckboxChange(item.label)}
            className="mr-2"
          />
          <label htmlFor={`checkbox-${index}`}>{item.label}</label>
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [active, setActive] = useState<number>(0);
  const [language, setLanguage] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const meRes = await fetch("/api/auth/me");
      const meData = meRes.ok ? await meRes.json() : null;
      setUser(meData?.user || null);
    };
    fetchUser();
  }, []);

  const sortings: RadioGroupItem[] = [
    {
      label: "Newest",
      value: "newest",
      icon: { value: "fas fa-sort-amount-down", label: "Newest" },
      default: true,
    },
    {
      label: "Oldest",
      value: "oldest",
      icon: { value: "fas fa-sort-amount-up", label: "Oldest" },
    },
    {
      label: "Popular",
      value: "popular",
      icon: { value: "fas fa-heart", label: "Popular" },
    },
    {
      label: "Random",
      value: "random",
      icon: { value: "fas fa-random", label: "Random" },
    },
  ];
  const languages: string[] = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
  ];
  const roles = [
    { name: "Developer", slug: "developer" },
    { name: "Designer", slug: "designer" },
    { name: "Manager", slug: "manager" },
  ];
  const skills = [
    { name: "JavaScript", slug: "javascript" },
    { name: "Python", slug: "python" },
    { name: "Java", slug: "java" },
  ];

  // Helper to get query params as object
  function getQueryObject() {
    const obj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  useEffect(() => {
    const query = getQueryObject();
    if (query.sort) {
      const index = sortings.findIndex((item) => item.value === query.sort);
      if (index !== -1) {
        setActive(index);
      } else {
        const defaultIndex = sortings.findIndex((item) => item.default);
        setActive(defaultIndex);
      }
    } else {
      const defaultIndex = sortings.findIndex((item) => item.default);
      setActive(defaultIndex);
    }
    if (query.language) {
      const findIndex = languages.findIndex((item) => item === query.language);
      if (findIndex !== -1) {
        setLanguage(findIndex);
      } else {
        setLanguage(null);
      }
    } else {
      setLanguage(null);
    }
  }, [searchParams]);

  // Helper to update query params
  function updateQuery(newQuery: Record<string, any>) {
    const params = new URLSearchParams(getQueryObject());
    Object.entries(newQuery).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  const handleSortChange = (item: RadioGroupItem) => {
    updateQuery({ sort: item.value });
    setActive(sortings.findIndex((i) => i.value === item.value));
  };

  const handleLanguageChange = (item: RadioGroupItem) => {
    updateQuery({ language: item.label });
    setLanguage(languages.findIndex((i) => i === item.label));
  };

  const handleRolesChange = (selectedRoles: string[]) => {
    updateQuery({ roles: selectedRoles.join(",") });
  };

  const handleSkillsChange = (selectedSkills: string[]) => {
    updateQuery({ skills: selectedSkills.join(",") });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-7xl w-full py-24">
          <div className="lg:grid grid-cols-1 lg:grid-cols-12 gap-6 px-10 2xl:px-0">
            <div className="col-span-3 2xl:col-span-2">
              <div className="flex items-center justify-between border-b border-zinc-500/5 pb-4">
                <h1 className="text-2xl text-black dark:text-white lg:pb-2 font-bold flex items-center gap-2">
                  Users
                </h1>
                <Link
                  href={{ pathname }}
                  className="hidden lg:block text-primary text-sm font-light hover:underline"
                >
                  Reset all filters
                </Link>
              </div>
              <div className="hidden lg:flex flex-col gap-4 mt-4 space-y-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg text-black dark:text-white pb-2 font-bold">
                      Sorting
                    </h1>
                    <Link
                      href={{
                        pathname,
                        query: { ...getQueryObject(), sort: undefined },
                      }}
                      className="text-primary text-sm font-light hover:underline"
                    >
                      Reset
                    </Link>
                  </div>
                  <RadioGroup
                    items={sortings}
                    value={active}
                    onChange={handleSortChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg text-black dark:text-white pb-2 font-bold">
                      Language
                    </h1>
                    <Link
                      href={{
                        pathname,
                        query: { ...getQueryObject(), language: undefined },
                      }}
                      className="text-primary text-sm font-light hover:underline"
                    >
                      Reset
                    </Link>
                  </div>
                  <RadioGroup
                    items={languages.map((el) => ({ label: el }))}
                    value={language}
                    onChange={handleLanguageChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg text-black dark:text-white pb-2 font-bold">
                      Roles
                    </h1>
                    <Link
                      href={{
                        pathname,
                        query: { ...getQueryObject(), roles: undefined },
                      }}
                      className="text-primary text-sm font-light hover:underline"
                    >
                      Reset
                    </Link>
                  </div>
                  <CheckboxGroup
                    items={roles.map((el) => ({ label: el.name }))}
                    value={
                      getQueryObject().roles
                        ? getQueryObject().roles.split(",")
                        : []
                    }
                    onChange={handleRolesChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg text-black dark:text-white pb-2 font-bold">
                      Skills
                    </h1>
                    <Link
                      href={{
                        pathname,
                        query: { ...getQueryObject(), skills: undefined },
                      }}
                      className="text-primary text-sm font-light hover:underline"
                    >
                      Reset
                    </Link>
                  </div>
                  <CheckboxGroup
                    items={skills.map((el) => ({ label: el.name }))}
                    value={
                      getQueryObject().skills
                        ? getQueryObject().skills.split(",")
                        : []
                    }
                    onChange={handleSkillsChange}
                  />
                </div>
              </div>
            </div>
            <InfiniteScrollComponent
              url={`/api/get/entity/explore?page=%s&limit=9${searchParams.toString() ? `&${searchParams.toString()}` : ""}`}
              dataPath={["data", "users"]}
              container="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 w-full"
              upperContainer="col-span-9 2xl:col-span-10 w-full"
              preRenderCount={9}
              preRender={(_, i) => (
                <MiniCard key={i} entity={{} as Entity} isSkeleton />
              )}
              itemsCount={12}
              render={(item, i) => (
                <MiniCard
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
  );
}
