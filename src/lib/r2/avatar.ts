import { uploadToR2, deleteFromR2, getPublicUrl, listR2Objects } from './client';

const AVATARS_BUCKET = process.env.R2_BUCKET_NAME || 'danhobak';

/**
 * 아바타 파일 업로드
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  // 파일명 생성
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}-avatar.${fileExt}`;
  const filePath = `avatars/${userId}/${fileName}`;

  // File을 Buffer로 변환
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // R2에 업로드
  await uploadToR2(AVATARS_BUCKET, filePath, buffer, file.type);

  // Public URL 반환
  return getPublicUrl(AVATARS_BUCKET, filePath);
}

/**
 * 아바타 파일 삭제
 */
export async function deleteAvatarFromStorage(avatarUrl: string): Promise<void> {
  if (!avatarUrl) return;

  try {
    // Public domain을 제거하고 파일 경로만 추출
    const publicDomain = process.env.NEXT_PUBLIC_CDN_URL;
    if (!publicDomain) return;

    const filePath = avatarUrl.replace(`${publicDomain}/`, '');

    // R2에서 삭제
    await deleteFromR2(AVATARS_BUCKET, [filePath]);
  } catch (error) {
    console.warn('아바타 파일 삭제 실패:', error);
  }
}

/**
 * 사용자 폴더의 모든 아바타 파일 삭제
 */
export async function deleteAllUserAvatars(userId: string): Promise<void> {
  try {
    // 사용자 폴더 내 모든 파일 조회
    const files = await listR2Objects(AVATARS_BUCKET, `avatars/${userId}/`);

    if (files.length === 0) return;

    // 모든 파일 삭제
    await deleteFromR2(AVATARS_BUCKET, files);
  } catch (error) {
    console.warn('사용자 아바타 파일 삭제 실패:', error);
  }
}