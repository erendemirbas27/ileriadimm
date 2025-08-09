export default class ContentModel {
    constructor() {
        this.categories = [
            { id: 'time-management', name: 'Zaman Yönetimi' },
            { id: 'study-techniques', name: 'Verimli Ders Çalışma Teknikleri' },
            { id: 'career-paths', name: 'Kariyer Yolları' },
            { id: 'university-guide', name: 'Üniversite ve Bölüm Tanıtımları' }
        ];
    }

    getCategories() {
        return this.categories;
    }

    getCategoryById(id) {
        return this.categories.find(cat => cat.id === id);
    }

    getContentByCategory(categoryId, contentList) {
        return contentList.filter(item => item.category === categoryId);
    }

    searchContent(query, contentList) {
        const lowerQuery = query.toLowerCase();
        return contentList.filter(item => 
            item.title.toLowerCase().includes(lowerQuery) || 
            item.description.toLowerCase().includes(lowerQuery)
        );
    }
}