import ContentView from '../views/contentView.js';
import ContentModel from '../models/contentModel.js';

export default class ContentController {
    constructor(dataModel) {
        this.dataModel = dataModel;
        this.contentModel = new ContentModel();
        this.contentView = new ContentView();
    }

    showContentPage() {
        const content = this.dataModel.getContent();
        this.contentView.renderContentPage(content);
        
        // İçerik detay butonları için olay dinleyiciler
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const contentId = parseInt(btn.dataset.id);
                this.showContentDetails(contentId);
            });
        });
        
        // Listeme ekle butonları için olay dinleyiciler
        document.querySelectorAll('.add-to-list-btn, .add-to-watchlist-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const contentId = parseInt(btn.dataset.id);
                this.addToList(contentId);
            });
        });
        
        // Podcast dinleme butonları için olay dinleyiciler
        document.querySelectorAll('.play-podcast-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const podcastId = parseInt(btn.dataset.id);
                this.playPodcast(podcastId);
            });
        });
        
        // Favori butonları için olay dinleyiciler
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const quoteId = parseInt(btn.dataset.id);
                this.toggleFavorite(quoteId);
            });
        });
    }

    hideContentPage() {
        this.contentView.hideContentPage();
    }

    showContentDetails(contentId) {
        // İçerik detaylarını göster
        console.log(`İçerik detayları gösteriliyor: ID ${contentId}`);
        
        // Gerçek uygulamada içerik detay sayfası render edilecek
        alert(`İçerik detayları gösterilecek: ID ${contentId}`);
    }

    addToList(contentId) {
        // Listeme ekle
        console.log(`Listeye eklendi: ID ${contentId}`);
        
        // Gerçek uygulamada kullanıcı listesine eklenecek
        this.showNotification('Listenize eklendi!');
    }

    playPodcast(podcastId) {
        // Podcast'i oynat
        console.log(`Podcast oynatılıyor: ID ${podcastId}`);
        
        // Gerçek uygulamada podcast oynatıcı açılacak
        this.showNotification('Podcast oynatılıyor...');
    }

    toggleFavorite(quoteId) {
        // Favori durumunu değiştir
        console.log(`Favori durumu değiştirildi: ID ${quoteId}`);
        
        // Gerçek uygulamada favori durumu güncellenecek
        const btn = document.querySelector(`.favorite-btn[data-id="${quoteId}"]`);
        const icon = btn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.showNotification('Favorilere eklendi!');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.showNotification('Favorilerden kaldırıldı!');
        }
    }

    searchContent(query) {
        // İçerik ara
        console.log(`Aranan: ${query}`);
        
        // Tüm içerik türlerinde ara
        const content = this.dataModel.getContent();
        let results = [];
        
        Object.keys(content).forEach(type => {
            if (Array.isArray(content[type])) {
                const typeResults = this.contentModel.searchContent(query, content[type]);
                results = [...results, ...typeResults.map(item => ({ ...item, type }))];
            }
        });
        
        console.log('Arama sonuçları:', results);
        
        // Gerçek uygulamada arama sonuçları gösterilecek
        return results;
    }

    filterContent(category) {
        // İçerikleri kategoriye göre filtrele
        console.log(`Filtreleniyor: ${category}`);
        
        // Gerçek uygulamada filtrelenmiş içerikler gösterilecek
        return category;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 3 saniye sonra bildirimi kaldır
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}