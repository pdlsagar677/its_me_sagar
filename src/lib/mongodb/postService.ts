import { connectToDatabase } from '../mongodb/connection';
import { ObjectId } from 'mongodb';

export interface Post {
  _id?: ObjectId;
  id: string;
  title: string;
  description: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  authorId: string;
  authorName: string;
  views: number;
  likes: number;
  comments: number;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostData {
  title: string;
  description: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  authorId: string;
  authorName: string;
}

const POSTS_COLLECTION = 'posts';

export const generatePostId = (): string => {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export const postService = {
  async createPost(postData: CreatePostData): Promise<{ success: boolean; post?: Post; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      // Calculate reading time
      const wordCount = postData.content.trim().split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200) || 1;

      const newPost: Post = {
        id: generatePostId(),
        title: postData.title,
        description: postData.description,
        content: postData.content,
        excerpt: postData.excerpt || postData.description.substring(0, 150) + '...',
        coverImage: postData.coverImage || '',
        category: postData.category || 'General',
        tags: postData.tags || [],
        isPublished: postData.isPublished || false,
        isFeatured: postData.isFeatured || false,
        authorId: postData.authorId || 'admin',
        authorName: postData.authorName || 'Admin',
        views: 0,
        likes: 0,
        comments: 0,
        readingTime,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = await db.collection<Post>(POSTS_COLLECTION).insertOne(newPost);
      newPost._id = result.insertedId;

      return { success: true, post: newPost };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: 'Failed to create post' };
    }
  },

  async getAllPosts(): Promise<Post[]> {
    try {
      const { db } = await connectToDatabase();
      const posts = await db.collection<Post>(POSTS_COLLECTION)
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  async getPostById(id: string): Promise<Post | null> {
    try {
      const { db } = await connectToDatabase();
      return db.collection<Post>(POSTS_COLLECTION).findOne({ id });
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },


  async updatePost(id: string, updates: Partial<Post>): Promise<{ success: boolean; post?: Post; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      const result = await db.collection<Post>(POSTS_COLLECTION).findOneAndUpdate(
        { id },
        { $set: updateData },
        { 
          returnDocument: 'after',
          includeResultMetadata: true 
        }
      );

      if (!result) {
        return { success: false, error: 'Post not found' };
      }

      return { success: true, post: result as unknown as Post };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error: 'Failed to update post' };
    }
  },

  async deletePost(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection<Post>(POSTS_COLLECTION).deleteOne({ id });
      
      if (result.deletedCount === 0) {
        return { success: false, error: 'Post not found' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: 'Failed to delete post' };
    }
  },

  async getPostsByStatus(status: 'published' | 'draft'): Promise<Post[]> {
    try {
      const { db } = await connectToDatabase();
      
      const query = status === 'published' 
        ? { isPublished: true } 
        : { isPublished: false };

      const posts = await db.collection<Post>(POSTS_COLLECTION)
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
      
      return posts;
    } catch (error) {
      console.error('Error fetching posts by status:', error);
      return [];
    }
  },

  async getStats(): Promise<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    featuredPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  }> {
    try {
      const { db } = await connectToDatabase();
      
      const totalPosts = await db.collection<Post>(POSTS_COLLECTION).countDocuments();
      const publishedPosts = await db.collection<Post>(POSTS_COLLECTION).countDocuments({ isPublished: true });
      const draftPosts = await db.collection<Post>(POSTS_COLLECTION).countDocuments({ isPublished: false });
      const featuredPosts = await db.collection<Post>(POSTS_COLLECTION).countDocuments({ isFeatured: true });
      
      const statsAggregate = await db.collection<Post>(POSTS_COLLECTION).aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$views" },
            totalLikes: { $sum: "$likes" },
            totalComments: { $sum: "$comments" }
          }
        }
      ]).toArray();
      
      const stats = statsAggregate[0] || { totalViews: 0, totalLikes: 0, totalComments: 0 };

      return {
        totalPosts,
        publishedPosts,
        draftPosts,
        featuredPosts,
        totalViews: stats.totalViews,
        totalLikes: stats.totalLikes,
        totalComments: stats.totalComments
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        featuredPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0
      };
    }
  }
};