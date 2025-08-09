export default class AppView {
    constructor() {
        this.appContainer = document.querySelector('.app-container');
        this.mainNav = document.querySelector('.main-nav');
        this.featureCards = document.querySelectorAll('.feature-card');
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.recTabs = document.querySelectorAll('.rec-tab');
        this.recContents = document.querySelectorAll('.rec-content');
    }

    init() {
        this.setupNavigation();
        this.setupFeatureCards();
        this.setupTabs();
        this.setupRecommendationTabs();
    }

    setupNavigation() {
        this.mainNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                
                // Aktif sınıfını güncelle
                document.querySelectorAll('.main-nav a').forEach(link => {
                    link.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Sayfa değiştirme işlemi
                const page = e.target.dataset.page;
                this.changePage(page);
            }
        });
    }

    setupFeatureCards() {
        this.featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const feature = card.dataset.feature;
                this.navigateToFeature(feature);
            });
        });
    }

    setupTabs() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Aktif butonu güncelle
                this.tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Aktif içeriği güncelle
                this.tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    setupRecommendationTabs() {
        this.recTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const recId = tab.dataset.rec;
                
                // Aktif sekmeyi güncelle
                this.recTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Aktif içeriği güncelle
                this.recContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === recId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    changePage(page) {
        console.log(`Sayfa değiştiriliyor: ${page}`);
        // Gerçek uygulamada burada sayfa içeriği dinamik olarak değiştirilecek
    }

    navigateToFeature(feature) {
        console.log(`Özelliğe yönlendiriliyor: ${feature}`);
        // Gerçek uygulamada ilgili özelliğin sayfasına yönlendirme yapılacak
    }
}