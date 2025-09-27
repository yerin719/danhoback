import { uploadToR2, deleteFromR2, getPublicUrl, listR2Objects } from './client';

const PRODUCTS_BUCKET = process.env.R2_BUCKET_NAME || 'danhobak';

export async function uploadProductImage(
  slug: string,
  file: File,
  imageType: string = 'primary'
): Promise<string> {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${imageType}-${timestamp}.${fileExt}`;
  const filePath = `products/${slug}/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await uploadToR2(PRODUCTS_BUCKET, filePath, buffer, file.type);

  return getPublicUrl(PRODUCTS_BUCKET, filePath);
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  try {
    const publicDomain = process.env.NEXT_PUBLIC_CDN_URL;
    if (!publicDomain) return;

    const filePath = imageUrl.replace(`${publicDomain}/`, '');

    await deleteFromR2(PRODUCTS_BUCKET, [filePath]);
  } catch (error) {
    console.warn('상품 이미지 삭제 실패:', error);
  }
}

export async function deleteAllProductImages(slug: string): Promise<void> {
  try {
    const files = await listR2Objects(PRODUCTS_BUCKET, `products/${slug}/`);

    if (files.length === 0) return;

    await deleteFromR2(PRODUCTS_BUCKET, files);
  } catch (error) {
    console.warn('상품 이미지 삭제 실패:', error);
  }
}