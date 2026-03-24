import { sql } from '@/lib/db';

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  created_at: Date;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id}
  `;
  
  return result.length > 0 ? (result[0] as User) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  
  return result.length > 0 ? (result[0] as User) : null;
}

export async function createUser(
  id: string,
  email: string,
  name?: string | null,
  image?: string | null
): Promise<User> {
  const result = await sql`
    INSERT INTO users (id, email, name, image)
    VALUES (${id}, ${email}, ${name || null}, ${image || null})
    RETURNING *
  `;
  
  return result[0] as User;
}

export async function updateUser(
  id: string,
  updates: { name?: string | null; image?: string | null }
): Promise<User | null> {
  const result = await sql`
    UPDATE users 
    SET 
      name = COALESCE(${updates.name}, name),
      image = COALESCE(${updates.image}, image)
    WHERE id = ${id}
    RETURNING *
  `;
  
  return result.length > 0 ? (result[0] as User) : null;
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM users WHERE id = ${id}
    RETURNING id
  `;
  
  return result.length > 0;
}

export async function getAllUsers(limit = 100): Promise<User[]> {
  const result = await sql`
    SELECT * FROM users LIMIT ${limit}
  `;
  
  return result as User[];
}
