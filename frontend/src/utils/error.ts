/**
 * Helper trích xuất thông báo lỗi an toàn từ response của FastAPI (kể cả lỗi 422 validation array)
 */
export function getErrorMessage(error: any, defaultMessage: string = 'Đã có lỗi xảy ra. Vui lòng thử lại!'): string {
    if (!error) return defaultMessage;

    const detail = error.response?.data?.detail;

    // 1. Nếu detail là chuỗi đơn giản
    if (typeof detail === 'string') {
        return detail;
    }

    // 2. Nếu detail là mảng lỗi validation của FastAPI (HTTP 422)
    if (Array.isArray(detail)) {
        return detail
            .map((item: any) => {
                if (typeof item === 'string') return item;
                if (item?.msg) {
                    const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : '';
                    return field ? `${field}: ${item.msg}` : item.msg;
                }
                return JSON.stringify(item);
            })
            .join('; ');
    }

    // 3. Nếu detail là object khác
    if (detail && typeof detail === 'object') {
        return detail.message || JSON.stringify(detail);
    }

    // 4. Lỗi network hoặc thông báo từ error.message
    if (error.message) {
        return error.message;
    }

    return defaultMessage;
}
