// frontend/lib/notifications.ts

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  onClick?: () => void;
}

class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = "default";

  private constructor() {
    if (typeof window !== "undefined" && "Notification" in window) {
      this.permission = Notification.permission;
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async requestPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.log("Browser does not support notifications");
      return false;
    }

    if (this.permission === "granted") {
      return true;
    }

    if (this.permission === "denied") {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  public async show(options: NotificationOptions): Promise<void> {
    console.log("show() called with:", options.title);

    // Always show fallback notification for in-app display
    this.showFallbackNotification(options);

    // Also try to show browser notification if permission granted
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      this.permission === "granted"
    ) {
      try {
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon || "/favicon.ico",
          badge: "/favicon.ico",
          tag: "auramatch-notification",
          requireInteraction: false,
        });

        if (options.onClick) {
          notification.onclick = () => {
            window.focus();
            options.onClick?.();
            notification.close();
          };
        }

        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000);
      } catch (error) {
        console.error("Error showing browser notification:", error);
      }
    }
  }

  private showFallbackNotification(options: NotificationOptions): void {
    console.log("showFallbackNotification() called");

    // Create in-app notification as fallback
    const notificationEl = document.createElement("div");
    notificationEl.className = "auramatch-notification";
    notificationEl.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(147, 51, 234, 0.3);
        z-index: 10000;
        max-width: 350px;
        animation: slideInRight 0.3s ease-out;
        cursor: pointer;
      ">
        <div style="font-weight: bold; margin-bottom: 4px;">${this.escapeHtml(
          options.title
        )}</div>
        <div style="font-size: 14px; opacity: 0.95;">${this.escapeHtml(
          options.body
        )}</div>
      </div>
    `;

    // Add animation styles if not already present
    if (!document.getElementById("notification-styles")) {
      const style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notificationEl);
    console.log("Notification element appended to body");

    if (options.onClick) {
      notificationEl.onclick = () => {
        options.onClick?.();
        this.removeFallbackNotification(notificationEl);
      };
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeFallbackNotification(notificationEl);
    }, 5000);
  }

  private removeFallbackNotification(element: HTMLElement): void {
    const innerDiv = element.querySelector("div") as HTMLElement;
    if (innerDiv) {
      innerDiv.style.animation = "slideOutRight 0.3s ease-out";
    }
    setTimeout(() => {
      element.remove();
    }, 300);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  public showMatchNotification(userName: string, userImage: string): void {
    console.log("showMatchNotification() called for:", userName);
    this.show({
      title: "🎉 It's a Match!",
      body: `You and ${userName} liked each other!`,
      icon: userImage,
      onClick: () => {
        // Navigate to matches page
        window.location.hash = "#matches";
      },
    });
  }

  public showMessageNotification(
    userName: string,
    message: string,
    userImage: string
  ): void {
    console.log("showMessageNotification() called for:", userName);
    const truncatedMessage =
      message.length > 50 ? message.substring(0, 50) + "..." : message;

    this.show({
      title: `💬 ${userName}`,
      body: truncatedMessage,
      icon: userImage,
      onClick: () => {
        // Navigate to messages page
        window.location.hash = "#messages";
      },
    });
  }
}

export const notificationService = NotificationService.getInstance();
