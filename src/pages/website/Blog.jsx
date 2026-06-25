const posts = [
  { title: '5 Tips for a Smooth Ride Experience', date: 'May 2026', excerpt: 'Simple habits that make every trip safer and more comfortable.' },
  { title: 'How RideGo Calculates Fares', date: 'April 2026', excerpt: 'A behind-the-scenes look at our transparent pricing engine.' },
  { title: 'Driver Spotlight: Stories from the Road', date: 'March 2026', excerpt: 'Meet the drivers who keep our city moving every day.' },
];

const Blog = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">From Our Blog</h1>
    <div className="grid sm:grid-cols-2 gap-6">
      {posts.map((post) => (
        <div key={post.title} className="card">
          <p className="text-xs text-gray-400 mb-2">{post.date}</p>
          <h3 className="font-semibold text-lg text-gray-800 mb-2">{post.title}</h3>
          <p className="text-sm text-gray-500">{post.excerpt}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Blog;
