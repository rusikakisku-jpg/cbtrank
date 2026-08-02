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

    // 1. D1 Database Persistence
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

      await queryD1(
        `INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
        [name.trim(), email.trim(), msgSubject.trim(), message.trim()]
      );
    } catch (dbErr) {
      console.error('Failed to save message in D1:', dbErr);
    }

    // 2. Direct Instant Gmail Delivery via Web3Forms & FormSubmit
    try {
      // Primary: Web3Forms instant email submission to contact.cbtrank@gmail.com
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: "62688fbd-758a-4467-9c98-1e42a045952c",
          to_email: "contact.cbtrank@gmail.com",
          name: name.trim(),
          email: email.trim(),
          subject: `[CBT RANK Contact] ${msgSubject} from ${name.trim()}`,
          message: message.trim()
        })
      }).catch(e => console.error('Web3Forms Error:', e));

      // Backup: FormSubmit AJAX submission
      fetch('https://formsubmit.co/ajax/contact.cbtrank@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `[CBT RANK Contact] ${msgSubject} from ${name.trim()}`,
          _replyto: email.trim(),
          _captcha: 'false',
          Name: name.trim(),
          Email: email.trim(),
          Subject: msgSubject.trim(),
          Message: message.trim()
        })
      }).catch(e => console.error('FormSubmit Error:', e));

    } catch (emailErr) {
      console.error('Email Delivery Error:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message was sent successfully! We will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while sending message. Please try again.' },
      { status: 500 }
    );
  }
}
