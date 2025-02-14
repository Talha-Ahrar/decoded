import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
// import { hash } from 'bcryptjs';
import { GET as verify } from '../../../auth/verify/route';



export async function GET(request) {
    try {
        // console.log(isAuthenticated,"------isauthenticated");
      const isAuthenticated = await verify(request);
      console.log(isAuthenticated,"------isauthenticated");
      if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const db = await connectDB();
      const users = await db.collection('usersadmin')
        .find({}, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
  
      return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
      console.error('List users error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }