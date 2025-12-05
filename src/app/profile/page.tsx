// app/profile/[id]/page.tsx
import ProfileDisplay from '@/components/ProfileDisplay';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return <ProfileDisplay profileId={params.id} />;
}