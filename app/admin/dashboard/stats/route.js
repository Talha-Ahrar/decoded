import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const isAuthenticated = await verifyToken(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const totalUsers = await db.collection('users').countDocuments();
    const activeUsers = await db.collection('users')
      .countDocuments({ lastActive: { $gte: new Date(Date.now() - 24*60*60*1000) }});
    
    const recentActivities = await db.collection('activities')
      .find()
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      totalUsers,
      activeUsers,
      recentActivities
    });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}