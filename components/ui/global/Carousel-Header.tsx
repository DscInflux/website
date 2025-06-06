import React from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
	next,
	prev,
	isPrev,
	isNext
}: CarouselHeaderProps) {
	return (
		<div className="mb-6 flex flex-col items-start justify-between gap-4 px-1 lg:flex-row lg:items-center">
			<div className="flex items-center gap-4">
				{icon && (
					<div className="hidden items-center justify-center rounded-xl bg-primary/10 p-3 text-4xl text-primary lg:flex">
						{icon}
					</div>
				)}
				<div>
					<h2 className="font-jakarta text-2xl font-bold tracking-tight text-black dark:text-white">
						{title}
					</h2>
					{description && (
						<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
					)}
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="flex gap-2">
					<button
						onClick={prev}
						disabled={!isPrev}
						className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
							isPrev
								? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
								: 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-900 dark:text-gray-600'
						}`}
						aria-label="Previous"
					>
						<FaChevronLeft size={14} />
					</button>
					<button
						onClick={next}
						disabled={!isNext}
						className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
							isNext
								? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
								: 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-900 dark:text-gray-600'
						}`}
						aria-label="Next"
					>
						<FaChevronRight size={14} />
					</button>
				</div>

				{seeAll && (
					<Link
						href={seeAll}
						className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/20 hover:text-primary/80"
					>
						See all
					</Link>
				)}
			</div>
		</div>
	);
}
