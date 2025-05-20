import Link from "next/link";

type CarouselHeaderProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  seeAll?: string;
  next: () => void;
  prev: () => void;
  isPrev: boolean;
  isNext: boolean;
};

export default function CarouselHeader({
  title,
  description,
  icon,
  seeAll,
}: CarouselHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-1 gap-4">
      <div className="flex items-center gap-4">
        {icon && <div className="text-4xl text-primary">{icon}</div>}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white font-jakarta">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
      </div>

      {seeAll && (
        <Link href={seeAll} className="text-primary hover:underline text-sm font-semibold">
          See all →
        </Link>
      )}
    </div>
  );
}
