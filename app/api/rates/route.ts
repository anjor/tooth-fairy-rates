import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM rates ORDER BY location ASC, created_at DESC');
        return NextResponse.json(result.rows);
    } finally {
        client.release();
    }
}

export async function POST(req: Request) {
    const { location, rate } = await req.json();
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO rates (location, rate) VALUES ($1, $2) RETURNING *',
            [location, rate]
        );
        return NextResponse.json(result.rows[0]);
    } finally {
        client.release();
    }
}
