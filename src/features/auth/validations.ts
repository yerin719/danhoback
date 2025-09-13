import { z } from "zod";

// 로그인 폼 유효성 검사 스키마
export const loginSchema = z.object({
  email: z
    .string({ message: "이메일을 입력해주세요." })
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string({ message: "비밀번호를 입력해주세요." })
    .min(1, "비밀번호를 입력해주세요.")
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

// 회원가입 폼 유효성 검사 스키마
export const signupSchema = z.object({
  email: z
    .string({ message: "이메일을 입력해주세요." })
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string({ message: "비밀번호를 입력해주세요." })
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, "비밀번호는 영문과 숫자를 포함해야 합니다."),
});

// 타입 추출
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
