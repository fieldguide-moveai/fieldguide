import React, { useState } from 'react';
import { Settings, ShoppingBag, MapPin, AlertTriangle, Star, Tag, Megaphone, MessageCircle, Bell } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../mocks/mockNotifications';
import { AppNotification, NotificationCategory, NotificationIconType } from '../types';

const TABS: { id: 'all' | NotificationCategory; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'order', label: '오더' },
  { id: 'operation', label: '운행 정보' },
  { id: 'report', label: '현장 제보' },
  { id: 'benefit', label: '혜택' },
];

const ICONS: Record<NotificationIconType, { icon: React.ElementType; iconBg: string; iconColor: string }> = {
  order: { icon: ShoppingBag, iconBg: 'bg-[#2563EB]', iconColor: 'text-white' },
  operation: { icon: MapPin, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  safety: { icon: AlertTriangle, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
  points: { icon: Star, iconBg: 'bg-violet-50', iconColor: 'text-violet-500' },
  coupon: { icon: Tag, iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
  update: { icon: Megaphone, iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
  reply: { icon: MessageCircle, iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
};

const renderLine2 = (notification: AppNotification) => {
  if (!notification.highlight || !notification.line2.includes(notification.highlight)) {
    return notification.line2;
  }
  const [before, after] = notification.line2.split(notification.highlight);
  return (
    <>
      {before}
      <span className="text-[#2563EB] font-bold">{notification.highlight}</span>
      {after}
    </>
  );
};

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | NotificationCategory>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const visibleNotifications =
    activeTab === 'all' ? notifications : notifications.filter((n) => n.category === activeTab);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-white pb-24 w-full max-w-md mx-auto shadow-lg">
      {/* Dark Header */}
      <header className="bg-[#102a56] pt-8 pb-6 px-5">
        <div className="flex justify-between items-center text-white/80 text-xs mb-4 font-semibold tracking-tight">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-white/90">
            <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[16px]">wifi</span>
            <span className="material-symbols-outlined text-[16px]">battery_full</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold tracking-tight">알림</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-sm font-bold text-blue-300 disabled:text-white/30 transition-colors"
            >
              모두 읽음
            </button>
            <button className="text-white/90 p-1" aria-label="알림 설정" title="알림 설정">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 flex px-5 gap-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 pt-4 pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'text-[#1A2B5C] border-[#2563EB]'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <main className="p-4 space-y-3">
        {visibleNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400">
            <Bell className="w-10 h-10 mb-3 text-gray-300" />
            <p className="text-sm font-medium">해당 카테고리의 알림이 없어요.</p>
          </div>
        )}

        {visibleNotifications.map((notification) => {
          const { icon: Icon, iconBg, iconColor } = ICONS[notification.iconType];
          return (
            <button
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`w-full text-left rounded-2xl p-4 flex gap-3 border transition-colors ${
                notification.read
                  ? 'bg-white border-gray-100'
                  : 'bg-[#EEF3FE] border-[#DCE6FB]'
              }`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-sm text-gray-900 leading-snug">{notification.title}</h3>
                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                      {notification.timestamp}
                    </span>
                    {!notification.read && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />}
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">{notification.line1}</p>
                <p className="text-xs text-gray-500 font-medium">{renderLine2(notification)}</p>
              </div>
            </button>
          );
        })}

        <div className="bg-[#F5F6F8] rounded-xl p-3.5 flex items-center justify-between text-xs mt-2">
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <Bell className="w-4 h-4 text-gray-400" />
            <span>중요한 알림은 푸시로도 받아보실 수 있어요.</span>
          </div>
          <span className="text-[#2563EB] font-bold whitespace-nowrap">알림 설정 ›</span>
        </div>
      </main>
    </div>
  );
};
