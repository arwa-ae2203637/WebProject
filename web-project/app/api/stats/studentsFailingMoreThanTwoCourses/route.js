import { getStudentsFailingMoreThanTwoCourses } from '@/repo/statistics.js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getStudentsFailingMoreThanTwoCourses();
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 