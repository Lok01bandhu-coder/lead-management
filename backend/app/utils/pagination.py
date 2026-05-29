def build_pagination_response(items, total: int, page: int, limit: int):
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
    }

