import CreatePostForm from '@/components/CreatePostForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Post - Admin Dashboard',
  description: 'Create a new blog post',
};

export default function CreatePostPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
            <p className="mt-2 text-gray-600">
              Fill out the form below to create a new blog post
            </p>
          </div>
          <CreatePostForm />
        </div>
      </div>
    </div>
  );
}