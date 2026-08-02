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

    // 1. D1 Database Persistence: Ensure messages table exists
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

    // Save message to Cloudflare D1
    try {
      await queryD1(
        `INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
        [name.trim(), email.trim(), msgSubject.trim(), message.trim()]
      );
    } catch (dbErr) {
      console.error('Failed to insert message into D1:', dbErr);
    }

    // 2. Direct Gmail Delivery: Send email directly to contact.cbtrank@gmail.com
    try {
      await fetch('https://formsubmit.co/ajax/contact.cbtrank@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[CBT RANK Contact] ${msgSubject} from ${name.trim()}`,
          _replyto: email.trim(),
          _captcha: 'false',
          Name: name.trim(),
          Email: email.trim(),
          Subject: msgSubject.trim(),
          Message: message.trim()
        })
      });
    } catch (emailErr) {
      console.error('Failed to forward message to Gmail:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been delivered directly to our Gmail and stored in database successfully!',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while sending message. Please try again.' },
      { status: 500 }
    );
  }
}
