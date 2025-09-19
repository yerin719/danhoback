import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// R2 클라이언트 초기화
let r2Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!r2Client) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    // 디버깅용 로그 (환경 변수 존재 여부만 확인)
    console.log("R2 환경 변수 체크:", {
      accountId: !!accountId,
      accessKeyId: !!accessKeyId,
      secretAccessKey: !!secretAccessKey,
    });

    if (!accountId || !accessKeyId || !secretAccessKey) {
      console.error("누락된 환경 변수:", {
        R2_ACCOUNT_ID: !accountId ? "누락" : "존재",
        R2_ACCESS_KEY_ID: !accessKeyId ? "누락" : "존재",
        R2_SECRET_ACCESS_KEY: !secretAccessKey ? "누락" : "존재",
      });
      throw new Error("Cloudflare R2 환경 변수가 설정되지 않았습니다");
    }

    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return r2Client;
}

// 파일 업로드
export async function uploadToR2(
  bucketName: string,
  key: string,
  body: Buffer | Uint8Array | string,
  contentType?: string,
): Promise<void> {
  const client = getR2Client();

  console.log("R2 업로드 시도:", {
    bucketName,
    key,
    contentType,
    bodySize: body instanceof Buffer ? body.length : "unknown",
  });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=3600",
  });

  try {
    const result = await client.send(command);
    console.log("R2 업로드 성공:", { key, result });
  } catch (error) {
    const errorInfo: Record<string, unknown> = {
      bucketName,
      key,
      error: error instanceof Error ? error.message : error,
    };

    // AWS SDK 에러인 경우 추가 정보 추출
    if (error instanceof S3ServiceException) {
      errorInfo.errorCode = error.name;
      errorInfo.errorMessage = error.message;
      errorInfo.statusCode = error.$metadata?.httpStatusCode;
    }

    console.error("R2 업로드 실패:", errorInfo);
    throw error;
  }
}

// 파일 삭제
export async function deleteFromR2(bucketName: string, keys: string[]): Promise<void> {
  const client = getR2Client();

  // 여러 파일을 삭제하는 경우 각각 처리
  const deletePromises = keys.map((key) => {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    return client.send(command);
  });

  await Promise.all(deletePromises);
}

// 폴더 내 파일 목록 조회
export async function listR2Objects(bucketName: string, prefix: string): Promise<string[]> {
  const client = getR2Client();

  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  });

  const response = await client.send(command);

  if (!response.Contents) {
    return [];
  }

  return response.Contents.filter((obj) => obj.Key).map((obj) => obj.Key as string);
}

// Public URL 생성 (Public 버킷 사용 시)
export function getPublicUrl(bucketName: string, key: string): string {
  const publicDomain = process.env.NEXT_PUBLIC_CDN_URL;

  if (!publicDomain) {
    throw new Error("NEXT_PUBLIC_CDN_URL 환경 변수가 설정되지 않았습니다");
  }

  return `${publicDomain}/${key}`;
}

// 서명된 URL 생성 (Private 버킷 사용 시)
export async function getSignedR2Url(
  bucketName: string,
  key: string,
  expiresIn: number = 3600,
): Promise<string> {
  const client = getR2Client();

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn });
}
