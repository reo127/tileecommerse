"use client";

import Link from "next/link";
import { FaCalendar, FaUser, FaArrowRight } from "react-icons/fa";

// Temporary blog data - will be replaced with real data later
const tempBlogs = [
    {
        id: 1,
        title: "Top 10 Tile Trends for Modern Homes in 2024",
        excerpt: "Discover the latest tile design trends that are transforming modern homes. From bold patterns to minimalist aesthetics.",
        image: "/placeholder-blog-1.jpg",
        author: "Design Team",
        date: "Feb 15, 2024",
        category: "Design Trends",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "How to Choose the Perfect Tiles for Your Bathroom",
        excerpt: "A comprehensive guide to selecting bathroom tiles that combine style, durability, and water resistance.",
        image: "/placeholder-blog-2.jpg",
        author: "Expert Guide",
        date: "Feb 10, 2024",
        category: "Buying Guide",
        readTime: "7 min read"
    },
    {
        id: 3,
        title: "Maintenance Tips: Keep Your Tiles Looking New",
        excerpt: "Learn professional cleaning and maintenance techniques to preserve the beauty of your tiles for years to come.",
        image: "/placeholder-blog-3.jpg",
        author: "Care Tips",
        date: "Feb 5, 2024",
        category: "Maintenance",
        readTime: "4 min read"
    }
];

export const BlogSection = () => {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-white to-gray-50">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                    Latest from Our Blog
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                    Expert tips, design inspiration, and industry insights to help you make the best choices
                </p>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {tempBlogs.map((blog) => (
                    <article
                        key={blog.id}
                        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
                    >
                        {/* Blog Image */}
                        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl mb-2">📝</div>
                                    <p className="text-orange-600 font-medium">Coming Soon</p>
                                </div>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                                    {blog.category}
                                </span>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="p-6">
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                <div className="flex items-center gap-1">
                                    <FaCalendar className="text-orange-500" />
                                    <span>{blog.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaUser className="text-orange-500" />
                                    <span>{blog.author}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                {blog.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                {blog.excerpt}
                            </p>

                            {/* Read More Link */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">{blog.readTime}</span>
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-orange-600 font-semibold text-sm hover:gap-3 transition-all"
                                >
                                    Read More
                                    <FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* View All Blogs Button */}
            <div className="text-center">
                <Link
                    href="#"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
                >
                    View All Articles
                    <FaArrowRight />
                </Link>
            </div>
        </section>
    );
};
