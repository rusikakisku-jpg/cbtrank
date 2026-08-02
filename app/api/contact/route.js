export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields (Name, Email, Message).' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const msgSubject = subject || 'General Query';

    // Ensure messages table exists in D1
    try {
      await queryD1(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT,
          message TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (tblErr) {
      console.error('Table creation check failed:', tblErr);
    }

    // Save message to D1
    try {
      await queryD1(
        `INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
        [name.trim(), email.trim(), msgSubject.trim(), message.trim()]
      );
    } catch (dbErr) {
      console.error('Failed to insert message into D1:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you shortly.',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while sending message. Please try again.' },
      { status: 500 }
    );
  }
}
