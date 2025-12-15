export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(price);
};

export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const getProductName = (product: any, lang: string): string => {
    return lang === 'tr' ? product.nameTr : product.nameEn;
};

export const getProductDescription = (product: any, lang: string): string => {
    return lang === 'tr' ? product.descriptionTr : product.descriptionEn;
};

export const getCategoryName = (category: any, lang: string): string => {
    return lang === 'tr' ? category.nameTr : category.nameEn;
};
