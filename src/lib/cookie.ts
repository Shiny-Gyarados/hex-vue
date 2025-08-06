// Cookie 工具函數

/**
 * 設置 cookie
 * @param name - cookie 名稱
 * @param value - cookie 值
 * @param expInSeconds - 過期時間(秒)，如果不提供則為 session cookie
 */
export function setCookie(name: string, value: string, expInSeconds?: number): void {
    let cookieString = `${name}=${encodeURIComponent(value)}; path=/`;

    if (expInSeconds) {
        // 將秒轉換為毫秒，然後創建過期日期
        const expDate = new Date(Date.now() + expInSeconds * 1000);
        cookieString += `; expires=${expDate.toUTCString()}`;
    }

    document.cookie = cookieString;
}

/**
 * 獲取 cookie 值
 * @param name - cookie 名稱
 * @returns cookie 值或 null
 */
export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(";").shift();
        return cookieValue ? decodeURIComponent(cookieValue) : null;
    }

    return null;
}

/**
 * 刪除 cookie
 * @param name - cookie 名稱
 */
export function deleteCookie(name: string): void {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}

/**
 * 檢查 cookie 是否存在
 * @param name - cookie 名稱
 * @returns boolean
 */
export function hasCookie(name: string): boolean {
    return getCookie(name) !== null;
}

/**
 * 設置認證相關的 cookies
 * @param token - JWT token
 * @param expInSeconds - 過期時間(秒)
 */
export function setAuthCookies(token: string, expInSeconds: number): void {
    setCookie("authToken", token, expInSeconds);
}

/**
 * 清除認證相關的 cookies
 */
export function clearAuthCookies(): void {
    deleteCookie("authToken");
}

/**
 * 獲取認證 token
 * @returns token 或 null
 */
export function getAuthToken(): string | null {
    return getCookie("authToken");
}
