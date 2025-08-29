export interface Notification {
  id: string;
  type: 'comment' | 'like' | 'follow' | 'system' | 'promotion';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'comment',
    title: '새로운 댓글',
    message: '누군가가 당신의 글에 댓글을 달았습니다.',
    createdAt: '2024-01-15T14:30:00Z',
    isRead: false,
  },
  {
    id: '2',
    type: 'promotion',
    title: '찜한 제품 할인',
    message: '찜한 제품이 20% 할인 중입니다.',
    createdAt: '2024-01-15T13:00:00Z',
    isRead: false,
  },
  {
    id: '3',
    type: 'like',
    title: '좋아요 알림',
    message: '누군가가 당신의 글을 좋아합니다.',
    createdAt: '2024-01-15T12:15:00Z',
    isRead: false,
  },
  {
    id: '4',
    type: 'system',
    title: '시스템 공지',
    message: '새로운 기능이 추가되었습니다.',
    createdAt: '2024-01-15T10:00:00Z',
    isRead: true,
  },
  {
    id: '5',
    type: 'comment',
    title: '새로운 답글',
    message: '누군가가 당신의 댓글에 답글을 달았습니다.',
    createdAt: '2024-01-15T09:30:00Z',
    isRead: true,
  },
];

// 읽지 않은 알림 개수
export const getUnreadNotificationCount = (): number => {
  return notifications.filter(notification => !notification.isRead).length;
};

// 상대 시간 표시 함수
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return '방금 전';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else {
    return `${diffInDays}일 전`;
  }
};

// 알림 타입별 아이콘
export const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'comment':
      return 'MessageCircle';
    case 'like':
      return 'Heart';
    case 'follow':
      return 'UserPlus';
    case 'system':
      return 'Bell';
    case 'promotion':
      return 'Tag';
    default:
      return 'Bell';
  }
};