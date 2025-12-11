import React from "react";

interface AlertBannerProps {
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  actionLink?: {
    text: string;
    href: string;
  };
  onDismiss?: () => void;
}

export default function AlertBanner({
  type,
  title,
  message,
  actionLink,
  onDismiss,
}: AlertBannerProps) {
  const styles = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      icon: "info",
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-900 dark:text-blue-100",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      icon: "warning",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      textColor: "text-yellow-900 dark:text-yellow-100",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      icon: "error",
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-900 dark:text-red-100",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      icon: "check_circle",
      iconColor: "text-green-600 dark:text-green-400",
      textColor: "text-green-900 dark:text-green-100",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg p-4 mb-6 flex items-start gap-4`}
    >
      <span className={`material-symbols-outlined ${style.iconColor} text-2xl mt-0.5`}>
        {style.icon}
      </span>
      <div className="flex-grow">
        <h4 className={`font-bold ${style.textColor} mb-1`}>{title}</h4>
        <p className={`text-sm ${style.textColor} opacity-90`}>{message}</p>
        {actionLink && (
          <a
            href={actionLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-sm font-medium ${style.iconColor} hover:underline mt-2`}
          >
            {actionLink.text}
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`${style.iconColor} hover:opacity-70 transition-opacity`}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
}
