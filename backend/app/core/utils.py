import re
import unicodedata

def slugify(text: str) -> str:
    """Chuyển chuỗi tiếng Việt có dấu thành slug thân thiện với URL.
    Ví dụ: 'Phân Bón NPK Đầu Trâu 20-20-15' -> 'phan-bon-npk-dau-trau-20-20-15'
    """
    # 1. Chuẩn hóa ký tự Unicode và bỏ dấu tiếng Việt
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    # 2. Đưa về chữ thường
    text = text.lower().strip()
    # 3. Thay các ký tự không phải chữ/số thành dấu gạch ngang
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')
