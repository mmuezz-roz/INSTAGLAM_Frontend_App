export default function ProfilePosts() {
  
  const posts = [
    "https://source.unsplash.com/random/300x300?1",
    "https://source.unsplash.com/random/300x300?2",
    "https://source.unsplash.com/random/300x300?3",
    "https://source.unsplash.com/random/300x300?4",
    "https://source.unsplash.com/random/300x300?5",
    "https://source.unsplash.com/random/300x300?6",
  ];

  return (
    <div className="mt-8">
      
     
      <div className="flex justify-center gap-10 border-t pt-4 text-sm">
        <button className="font-semibold border-t-2 border-black pb-2">
          POSTS
        </button>
      
      </div>

      
      <div className="grid grid-cols-3 gap-2 mt-6">
        {posts.map((img, index) => (
          <div key={index} className="aspect-square">
            <img
              src={img}
              alt="post"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

    </div>
  );
}
