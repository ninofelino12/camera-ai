import { sql } from '@/lib/db';

export interface CameraData {
  id: number;
  user_id: string;
  captured_date: Date;
  latitude: number;
  longitude: number;
  email: string | null;
  photo_url: string | null;
  photo_data: Buffer | null;
  created_at: Date;
}

export interface CreateCameraDataInput {
  user_id: string;
  captured_date: Date;
  latitude: number;
  longitude: number;
  email?: string | null;
  photo_url?: string | null;
  photo_data?: Buffer | null;
}

export async function createCameraData(input: CreateCameraDataInput): Promise<CameraData> {
  const result = await sql`
    INSERT INTO camera_data (
      user_id, captured_date, latitude, longitude, email, photo_url, photo_data
    )
    VALUES (
      ${input.user_id},
      ${input.captured_date},
      ${input.latitude},
      ${input.longitude},
      ${input.email || null},
      ${input.photo_url || null},
      ${input.photo_data || null}
    )
    RETURNING *
  `;
  
  return result[0] as CameraData;
}

export async function getCameraDataById(id: number): Promise<CameraData | null> {
  const result = await sql`
    SELECT * FROM camera_data WHERE id = ${id}
  `;
  
  return result.length > 0 ? (result[0] as CameraData) : null;
}

export async function getCameraDataByUserId(userId: string, limit = 100, offset = 0): Promise<CameraData[]> {
  const result = await sql`
    SELECT * FROM camera_data 
    WHERE user_id = ${userId}
    ORDER BY captured_date DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  
  return result as CameraData[];
}

export async function getAllCameraData(limit = 100, offset = 0): Promise<CameraData[]> {
  const result = await sql`
    SELECT * FROM camera_data 
    ORDER BY captured_date DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  
  return result as CameraData[];
}

export async function updateCameraData(
  id: number,
  updates: Partial<CreateCameraDataInput>
): Promise<CameraData | null> {
  // Build dynamic update query based on provided fields
  let query;
  
  if (updates.captured_date !== undefined && updates.latitude !== undefined && updates.longitude !== undefined) {
    if (updates.email !== undefined && updates.photo_url !== undefined) {
      query = await sql`
        UPDATE camera_data 
        SET captured_date = ${updates.captured_date},
            latitude = ${updates.latitude},
            longitude = ${updates.longitude},
            email = ${updates.email},
            photo_url = ${updates.photo_url}
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (updates.email !== undefined) {
      query = await sql`
        UPDATE camera_data 
        SET captured_date = ${updates.captured_date},
            latitude = ${updates.latitude},
            longitude = ${updates.longitude},
            email = ${updates.email}
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (updates.photo_url !== undefined) {
      query = await sql`
        UPDATE camera_data 
        SET captured_date = ${updates.captured_date},
            latitude = ${updates.latitude},
            longitude = ${updates.longitude},
            photo_url = ${updates.photo_url}
        WHERE id = ${id}
        RETURNING *
      `;
    } else {
      query = await sql`
        UPDATE camera_data 
        SET captured_date = ${updates.captured_date},
            latitude = ${updates.latitude},
            longitude = ${updates.longitude}
        WHERE id = ${id}
        RETURNING *
      `;
    }
  } else {
    // Handle other combinations as needed
    return getCameraDataById(id);
  }

  return query.length > 0 ? (query[0] as CameraData) : null;
}

export async function deleteCameraData(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM camera_data WHERE id = ${id}
    RETURNING id
  `;
  
  return result.length > 0;
}

export async function searchCameraDataByDate(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<CameraData[]> {
  const result = await sql`
    SELECT * FROM camera_data 
    WHERE user_id = ${userId}
    AND captured_date BETWEEN ${startDate} AND ${endDate}
    ORDER BY captured_date DESC
  `;
  
  return result as CameraData[];
}

export async function getCameraDataCount(userId?: string): Promise<number> {
  let result;
  if (userId) {
    result = await sql`
      SELECT COUNT(*) FROM camera_data WHERE user_id = ${userId}
    `;
  } else {
    result = await sql`
      SELECT COUNT(*) FROM camera_data
    `;
  }
  
  return parseInt(result[0].count, 10);
}
