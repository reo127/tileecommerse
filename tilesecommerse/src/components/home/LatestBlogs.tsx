"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCalendar, FaUser, FaArrowRight, FaClock } from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  category: string;
  publishedAt: string;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Tile Trends': 'bg-purple-500',
    'Installation Tips': 'bg-blue-500',
    'Design Ideas': 'bg-green-500',
    'Maintenance Guide': 'bg-yellow-500',
    'Product Reviews': 'bg-red-500',
    'Industry News': 'bg-indigo-500',
    'DIY Projects': 'bg-pink-500',
    'Case Studies': 'bg-teal-500',
  };
  return colors[category] || 'bg-slate-500';
};

const getAuthorInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const LatestBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const abortController = new AbortController();

    const fetchWithAbort = async () => {
      try {
        await fetchLatestBlogs(abortController.signal);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error fetching blogs:', error);
        }
      }
    };

    fetchWithAbort();

    // Cleanup function
    return () => {
      abortController.abort();
    };
  }, []);

  const fetchLatestBlogs = async (signal?: AbortSignal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/latest?limit=4`, { signal });

      if (!response.ok) {
        console.error('Failed to fetch blogs:', response.status);
        setBlogs([]);
        setLoading(false);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error('Response is not JSON');
        setBlogs([]);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.blogs) {
        setBlogs(data.blogs);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching latest blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Latest Blogs By MyTyles
          </h2>
          <p className="text-slate-600 text-lg">
            Expert advice, trends, and inspiration for your tile projects
          </p>
        </div>
        <Link
          href="/blogs"
          className="hidden md:flex items-center gap-2 text-slate-900 hover:text-slate-700 font-semibold transition-colors group"
        >
          <span>View All</span>
          <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            href={`/blogs/${blog.slug}`}
            className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-slate-50">
              {blog.featuredImage ? (
                <Image
                  src={blog.featuredImage}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                  <span className="text-4xl">📰</span>
                </div>
              )}
              {/* Category Badge with color */}
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1.5 ${getCategoryColor(blog.category)} text-white text-xs font-semibold rounded-lg shadow-lg`}>
                  {blog.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              {/* Date */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <FaCalendar className="w-3 h-3" />
                <time dateTime={blog.publishedAt}>
                  {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'UTC'
                  })}
                </time>
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700 transition-colors leading-snug">
                {blog.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1 leading-relaxed">
                {blog.excerpt}
              </p>

              {/* Author & Read More */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                    {getAuthorInitials(blog.author)}
                  </div>
                  <span className="text-xs font-medium text-slate-700">{blog.author}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-900 font-medium text-sm group-hover:gap-2.5 transition-all">
                  <span className="text-xs">Read</span>
                  <FaArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Mobile */}
      <div className="mt-10 text-center md:hidden">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span>View All Blogs</span>
          <FaArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
