import ProfileHeader from "../components/ProfileHeader";
import ProfilePosts from "../components/ProfilePosts";


export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <ProfileHeader/>
      <ProfilePosts/>
    </div>
  );
}