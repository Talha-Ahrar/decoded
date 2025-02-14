import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
// import { hash } from 'bcryptjs';
import { GET as verify } from '../../../auth/verify/route';

export async function DELETE(request, { params }) {
    try {
      const isAuthenticated = await verify(request);
      if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const { id } = params;
      const db = await connectDB();
  
      const result = await db.collection('usersadmin').deleteOne({ 
        _id: new ObjectId(id) 
      });
  
      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: 'User deleted successfully' },
        { status: 200 }
      );
  
    } catch (error) {
      console.error('Delete user error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }