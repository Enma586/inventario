

export const getPagination = (page, limit) => {
    const safeLimit = parseInt(limit, 10) || 10;
    const safePage = parseInt(page, 10) || 1;

    const skip = safePage > 1 ? (safePage - 1) * safeLimit : 0;

    return { skip, limit: safeLimit };
}

export const getPagingData = (total, page, limit) => {
    const safeLimit = parseInt(limit, 10) || 10;
    const safePage = parseInt(page, 10) || 1;

    const totalPages = Math.ceil(total / safeLimit);
   
    return {
        total,
        totalPages,
        currentPage: safePage,
        perPage: safeLimit,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1   
    }
}