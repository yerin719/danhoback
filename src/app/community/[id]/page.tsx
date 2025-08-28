export default function CommunityPostPage({ params }: { params: { id: string } }) {
  const postId = params.id;
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">커뮤니티 게시글 {postId}</h1>
    </div>
  );
}