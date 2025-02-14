import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { hash } from 'bcryptjs';
import { GET as verify } from '../../../auth/verify/route';


export async function POST(request) {
  try {
    const isAuthenticated = await verify(request);
    console.log(isAuthenticated,"------isauthenticated");
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, FullName, email, password, isActive, routes } = await request.json();

    // Validate required fields
    if (!username || !FullName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const db = await connectDB();

    // Check if user exists
    const existingUser = await db.collection('usersadmin').findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? 'Email already exists' : 'Username already exists' },
        { status: 400 }
      );
    }

    // Validate routes
    const validRoutes = ['news', 'articles', 'gadget', 'mobiles'];
    const invalidRoutes = routes.filter(route => !validRoutes.includes(route));
    if (invalidRoutes.length > 0) {
      return NextResponse.json(
        { error: 'Invalid routes specified' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hash(password, 12);
    const newUser = {
      username,
      FullName,
      email,
      password: hashedPassword,
      isActive,
      routes,
      createdAt: new Date(),
      lastModified: new Date()
    };

    await db.collection('usersadmin').insertOne(newUser);

    // Return success without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}