"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload } from "lucide-react";
import { useState } from "react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const [nickname, setNickname] = useState("홍길동");
  const [profileImage, setProfileImage] = useState("");

  const handleSave = () => {
    // 여기에 프로필 업데이트 로직 추가
    console.log("프로필 업데이트:", { nickname, profileImage });
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>프로필 설정</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileImage} alt="프로필 이미지" />
                <AvatarFallback className="text-xl">{nickname[0]}</AvatarFallback>
              </Avatar>
              <Label htmlFor="image-upload" className="absolute -bottom-1 -right-1 cursor-pointer">
                <div className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90">
                  <Camera className="h-4 w-4" />
                </div>
              </Label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <Button variant="outline" size="sm" asChild>
              <Label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2">
                <Upload className="h-4 w-4" />
                이미지 업로드
              </Label>
            </Button>
          </div>

          {/* 닉네임 */}
          <div className="grid gap-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
