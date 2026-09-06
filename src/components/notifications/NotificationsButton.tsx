import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react';
import { useLanguage } from '@/core/i18n';

type NotificationRole = 'admin' | 'boutique';

type NotificationItem = {
  id: string;
  titleKey: string;
  messageKey: string;
  timeKey: string;
  read: boolean;
};

const STORAGE_PREFIX = 'kukuza-notifications-';

const defaultNotifications: Record<NotificationRole, NotificationItem[]> = {
  admin: [
    {
      id: 'admin-product-review',
      titleKey: 'notifications.admin.productTitle',
      messageKey: 'notifications.admin.productMessage',
      timeKey: 'notifications.justNow',
      read: false,
    },
    {
      id: 'admin-shop-registration',
      titleKey: 'notifications.admin.shopTitle',
      messageKey: 'notifications.admin.shopMessage',
      timeKey: 'notifications.oneHourAgo',
      read: false,
    },
    {
      id: 'admin-report',
      titleKey: 'notifications.admin.reportTitle',
      messageKey: 'notifications.admin.reportMessage',
      timeKey: 'notifications.today',
      read: true,
    },
  ],
  boutique: [
    {
      id: 'shop-product-published',
      titleKey: 'notifications.shop.productTitle',
      messageKey: 'notifications.shop.productMessage',
      timeKey: 'notifications.justNow',
      read: false,
    },
    {
      id: 'shop-stock-alert',
      titleKey: 'notifications.shop.stockTitle',
      messageKey: 'notifications.shop.stockMessage',
      timeKey: 'notifications.oneHourAgo',
      read: false,
    },
    {
      id: 'shop-order',
      titleKey: 'notifications.shop.orderTitle',
      messageKey: 'notifications.shop.orderMessage',
      timeKey: 'notifications.today',
      read: true,
    },
  ],
};

const readNotifications = (role: NotificationRole): NotificationItem[] => {
  if (typeof window === 'undefined') return defaultNotifications[role];

  try {
    const stored = window.localStorage.getItem(`${STORAGE_PREFIX}${role}`);
    if (!stored) return defaultNotifications[role];

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as NotificationItem[]) : defaultNotifications[role];
  } catch {
    return defaultNotifications[role];
  }
};

const saveNotifications = (role: NotificationRole, notifications: NotificationItem[]) => {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${role}`, JSON.stringify(notifications));
  } catch {
    // Notifications remain available for the current session if storage is unavailable.
  }
};

interface NotificationsButtonProps {
  role: NotificationRole;
}

export default function NotificationsButton({ role }: NotificationsButtonProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => readNotifications(role));
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);

  useEffect(() => {
    saveNotifications(role, notifications);
  }, [notifications, role]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((current) => current.map((notification) => (
      notification.id === id ? { ...notification, read: true } : notification
    )));
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  };

  const openNotification = (notification: NotificationItem) => {
    markAsRead(notification.id);
    setSelectedNotification({ ...notification, read: true });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        title={t('notifications.title')}
        aria-label={t('notifications.buttonLabel', { value: unreadCount })}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((open) => !open)}
      >
        <Bell size={20} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          role="dialog"
          aria-label={selectedNotification ? t('notifications.detail') : t('notifications.title')}
        >
          {selectedNotification ? (
            <>
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                <button
                  type="button"
                  className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label={t('notifications.back')}
                  onClick={() => setSelectedNotification(null)}
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <h2 className="text-sm font-bold text-slate-900">{t('notifications.detail')}</h2>
              </div>
              <div className="px-5 py-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                  <Bell size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">
                  {t(selectedNotification.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {t(selectedNotification.messageKey)}
                </p>
                <p className="mt-5 text-xs font-medium text-slate-400">
                  {t(selectedNotification.timeKey)}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{t('notifications.title')}</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t('notifications.unreadCount', { value: unreadCount })}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck size={14} aria-hidden="true" />
                    {t('notifications.markAllRead')}
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-500">{t('notifications.empty')}</p>
              ) : (
                <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <button
                        type="button"
                        className={`w-full px-4 py-3 text-left transition hover:bg-slate-50 ${notification.read ? 'bg-white' : 'bg-teal-50/50'}`}
                        onClick={() => openNotification(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.read ? 'bg-slate-200' : 'bg-teal-600'}`} aria-hidden="true" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-slate-900">{t(notification.titleKey)}</span>
                            <span className="mt-1 block text-xs leading-5 text-slate-600">{t(notification.messageKey)}</span>
                            <span className="mt-1 block text-[11px] text-slate-400">{t(notification.timeKey)}</span>
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
