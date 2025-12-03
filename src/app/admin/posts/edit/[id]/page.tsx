'use client';

import { useParams } from 'next/navigation';
import EditPostForm from '@/components/EditPostForm'

const EditPostPage = () => {
  const params = useParams();
  const id = params.id as string;
  
  return (
    <div>
      <EditPostForm postId={id} />
    </div>
  )
}

export default EditPostPage