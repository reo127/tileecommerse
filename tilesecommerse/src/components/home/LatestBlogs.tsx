import Link from "next/link";
import Image from "next/image";
import { FaCalendar, FaUser, FaArrowRight, FaClock } from "react-icons/fa";

const blogs = [
  {
    id: 1,
    title: "Top 10 Tile Trends for Modern Indian Homes in 2024",
    excerpt: "Discover the latest tile designs that are transforming homes across India. From minimalist patterns to bold statements...",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800",
    author: "Priya Sharma",
    authorAvatar: "PS",
    date: "January 15, 2024",
    category: "Design Trends",
    categoryColor: "bg-purple-500",
    readTime: "5 min read",
    href: "#",
  },
  {
    id: 2,
    title: "How to Choose Perfect Bathroom Tiles: Complete Guide",
    excerpt: "Learn expert tips on selecting water-resistant, anti-skid tiles that combine safety with style for your bathroom...",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800",
    author: "Rajesh Kumar",
    authorAvatar: "RK",
    date: "January 12, 2024",
    category: "Buying Guide",
    categoryColor: "bg-blue-500",
    readTime: "7 min read",
    href: "#",
  },
  {
    id: 3,
    title: "Tile Installation Tips: DIY vs Professional Installation",
    excerpt: "Understanding when to hire professionals and when you can install tiles yourself. Save money without compromising quality...",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=800",
    author: "Anita Desai",
    authorAvatar: "AD",
    date: "January 10, 2024",
    category: "Installation",
    categoryColor: "bg-green-500",
    readTime: "6 min read",
    href: "#",
  },
  {
    id: 4,
    title: "Maintaining Your Tiles: Cleaning and Care Guide",
    excerpt: "Keep your tiles looking brand new with these simple maintenance tips. Learn the best cleaning products and techniques...",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800",
    author: "Vikram Patel",
    authorAvatar: "VP",
    date: "January 8, 2024",
    category: "Maintenance",
    categoryColor: "bg-yellow-500",
    readTime: "4 min read",
    href: "#",
  },
];

export const LatestBlogs = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Latest Blogs By MyTyles
          </h2>
          <p className="text-slate-600 text-lg">
            Expert advice, trends, and inspiration for your tile projects
          </p>
        </div>
        <Link
          href="#"
          className="hidden md:block text-yellow-500 hover:text-yellow-600 font-semibold transition-colors"
        >
          View All Blogs →
        </Link>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={blog.href}
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-2"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Category Badge with color */}
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1.5 ${blog.categoryColor} text-white text-xs font-bold rounded-full shadow-lg`}>
                  {blog.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              {/* Author with Avatar */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {blog.authorAvatar}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-700">{blog.author}</span>
                  <span className="text-xs text-gray-500">{blog.date}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors">
                {blog.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                {blog.excerpt}
              </p>

              {/* Read More */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FaClock className="text-yellow-500" />
                  <span>{blog.readTime}</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-500 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Read More</span>
                  <FaArrowRight className="text-xs" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Mobile */}
      <div className="mt-8 text-center md:hidden">
        <Link
          href="#"
          className="inline-block px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          View All Blogs
        </Link>
      </div>
    </section>
  );
};
