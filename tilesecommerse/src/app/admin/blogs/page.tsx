"use client";

import { useState, useEffect } from "react";
import { HiPlus, HiPencil, HiTrash, HiX, HiCheck, HiNewspaper, HiEye, HiCalendar, HiUser, HiTag } from "react-icons/hi";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const BLOG_CATEGORIES = [
  'Tile Trends',
  'Installation Tips',
  'Design Ideas',
  'Maintenance Guide',
  'Product Reviews',
  'Industry News',
  'DIY Projects',
  'Case Studies'
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: 'Admin',
    category: 'Tile Trends',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published',
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockBlogs: Blog[] = [
        {
          _id: '1',
          title: '2026 Tile Design Trends: What\'s Hot This Year',
          slug: '2026-tile-design-trends',
          excerpt: 'Discover the latest tile design trends that are transforming modern homes in 2026.',
          content: `<h2>Introduction</h2><p>The world of tile design is constantly evolving, and 2026 brings exciting new trends that blend aesthetics with functionality.</p><h2>1. Large Format Tiles</h2><p>Large format tiles continue to dominate, creating seamless looks with fewer grout lines.</p><h2>2. Natural Stone Look</h2><p>Porcelain tiles mimicking natural stone are more popular than ever, offering durability without compromise.</p>`,
          featuredImage: 'https://images.unsplash.com/photo-1615875221248-3e9d5b90e593?w=800',
          author: 'Admin',
          category: 'Tile Trends',
          tags: ['trends', 'design', '2026'],
          status: 'published',
          views: 1250,
          publishedAt: '2026-01-20T10:00:00Z',
          createdAt: '2026-01-18T10:00:00Z',
          updatedAt: '2026-01-20T10:00:00Z'
        },
        {
          _id: '2',
          title: 'Complete Guide to Tile Installation',
          slug: 'complete-guide-tile-installation',
          excerpt: 'Everything you need to know about professional tile installation from preparation to finishing.',
          content: `<h2>Preparation</h2><p>Proper surface preparation is crucial for successful tile installation.</p><h2>Tools Required</h2><ul><li>Tile cutter</li><li>Trowel</li><li>Level</li><li>Spacers</li></ul>`,
          featuredImage: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800',
          author: 'Admin',
          category: 'Installation Tips',
          tags: ['installation', 'guide', 'diy'],
          status: 'published',
          views: 890,
          publishedAt: '2026-01-15T14:30:00Z',
          createdAt: '2026-01-14T14:30:00Z',
          updatedAt: '2026-01-15T14:30:00Z'
        },
        {
          _id: '3',
          title: 'Bathroom Tile Ideas for Small Spaces',
          slug: 'bathroom-tile-ideas-small-spaces',
          excerpt: 'Maximize your small bathroom with these clever tile design ideas and space-saving tips.',
          content: `<h2>Light Colors</h2><p>Using light-colored tiles can make small bathrooms feel more spacious.</p>`,
          featuredImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
          author: 'Admin',
          category: 'Design Ideas',
          tags: ['bathroom', 'small-space', 'design'],
          status: 'draft',
          views: 0,
          createdAt: '2026-01-25T09:00:00Z',
          updatedAt: '2026-01-25T09:00:00Z'
        }
      ];
      setBlogs(mockBlogs);
    } catch (error) {
      showAlert('error', 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        featuredImage: blog.featuredImage,
        author: blog.author,
        category: blog.category,
        tags: blog.tags,
        status: blog.status,
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        author: 'Admin',
        category: 'Tile Trends',
        tags: [],
        status: 'draft',
      });
    }
    setPreviewMode(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setPreviewMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (editingBlog) {
        setBlogs(blogs.map(b => b._id === editingBlog._id ? {
          ...b,
          ...formData,
          slug,
          updatedAt: new Date().toISOString(),
          publishedAt: formData.status === 'published' && !b.publishedAt ? new Date().toISOString() : b.publishedAt
        } : b));
        showAlert('success', 'Blog updated successfully!');
      } else {
        const newBlog: Blog = {
          _id: Date.now().toString(),
          ...formData,
          slug,
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: formData.status === 'published' ? new Date().toISOString() : undefined
        };
        setBlogs([newBlog, ...blogs]);
        showAlert('success', 'Blog created successfully!');
      }
      handleCloseModal();
    } catch (error) {
      showAlert('error', 'Failed to save blog');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeleteLoading(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBlogs(blogs.filter(b => b._id !== id));
      showAlert('success', 'Blog deleted successfully!');
    } catch (error) {
      showAlert('error', 'Failed to delete blog');
    } finally {
      setDeleteLoading(null);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-slate-600 mt-1">
            Create and manage blog posts ({blogs.length} posts)
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
        >
          <HiPlus className="w-5 h-5" />
          <span className="font-medium">New Blog Post</span>
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`p-4 rounded-lg border ${alert.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
          } flex items-center gap-3`}>
          {alert.type === 'success' ? (
            <HiCheck className="w-5 h-5 flex-shrink-0" />
          ) : (
            <HiX className="w-5 h-5 flex-shrink-0" />
          )}
          <p>{alert.message}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Posts</p>
              <p className="text-3xl font-bold mt-1">{blogs.length}</p>
            </div>
            <HiNewspaper className="w-12 h-12 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Published</p>
              <p className="text-3xl font-bold mt-1">
                {blogs.filter(b => b.status === 'published').length}
              </p>
            </div>
            <HiCheck className="w-12 h-12 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Drafts</p>
              <p className="text-3xl font-bold mt-1">
                {blogs.filter(b => b.status === 'draft').length}
              </p>
            </div>
            <HiNewspaper className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Views</p>
              <p className="text-3xl font-bold mt-1">
                {blogs.reduce((sum, b) => sum + b.views, 0)}
              </p>
            </div>
            <HiEye className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <HiNewspaper className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Blog Posts Yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start creating engaging content for your customers
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <HiPlus className="w-5 h-5" />
              <span className="font-medium">Create Your First Post</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Featured Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <HiNewspaper className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${blog.status === 'published'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-white'
                      }`}>
                      {blog.status}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <div className="flex items-center gap-1">
                      <HiUser className="w-4 h-4" />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <HiEye className="w-4 h-4" />
                      {blog.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <HiCalendar className="w-4 h-4" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => handleOpenModal(blog)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      <HiPencil className="w-4 h-4" />
                      <span className="font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      disabled={deleteLoading === blog._id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {deleteLoading === blog._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span className="font-medium">Deleting...</span>
                        </>
                      ) : (
                        <>
                          <HiTrash className="w-4 h-4" />
                          <span className="font-medium">Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <HiX className="w-6 h-6 text-slate-600" />
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="p-6 prose max-w-none">
                <h1>{formData.title || 'Untitled Post'}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                  <span className="flex items-center gap-1">
                    <HiUser className="w-4 h-4" />
                    {formData.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiTag className="w-4 h-4" />
                    {formData.category}
                  </span>
                </div>
                {formData.featuredImage && (
                  <img
                    src={formData.featuredImage}
                    alt={formData.title}
                    className="w-full rounded-lg mb-6"
                  />
                )}
                <p className="text-lg text-slate-600 italic">{formData.excerpt}</p>
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Enter blog title..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      placeholder="Brief description..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      required
                      rows={10}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none font-mono text-sm"
                      placeholder="Blog content (HTML supported)..."
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      You can use HTML tags for formatting
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      {BLOG_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Add a tag..."
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-orange-900"
                            >
                              <HiX className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="draft"
                          checked={formData.status === 'draft'}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                          className="w-4 h-4 text-orange-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Save as Draft</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="published"
                          checked={formData.status === 'published'}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                          className="w-4 h-4 text-orange-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Publish Now</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    {editingBlog ? 'Update Post' : 'Create Post'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
