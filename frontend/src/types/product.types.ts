export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    parent_id?: string | null;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    thumbnail_url?: string | null;
    composition?: string | null;        // Thành phần NPK, Vi lượng
    benefits?: string | null;           // Công dụng phân bón
    usage_instructions?: string | null; // Hướng dẫn sử dụng
    storage_warnings?: string | null;   // Cảnh báo bảo quản
    is_featured: boolean;
    is_active: boolean;
    created_by?: string | null;
    created_at: string;
    updated_at: string;
    categories?: Category[];
}

export interface ProductQueryParams {
    skip?: number;
    limit?: number;
    search?: string;
    is_active?: boolean;
}
