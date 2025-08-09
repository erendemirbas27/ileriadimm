export default class ContentView {
    constructor() {
        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'content-container';
        this.contentContainer.style.display = 'none';
        document.querySelector('.main-content .container').appendChild(this.contentContainer);
         const container = document.querySelector('.main-content .container');
        if (container) {
            container.appendChild(this.contentContainer);
        } else {
            console.warn('Container element not found, appending to body');
            document.body.appendChild(this.contentContainer);
        }
    }

    renderContentPage(content) {
        this.contentContainer.innerHTML = `
            <div class="section-header">
                <h2>İçerikler</h2>
                <p>Öğrenmeye devam edin</p>
            </div>
            
            <div class="content-tabs">
                <button class="content-tab-btn active" data-content="articles">Makaleler</button>
                <button class="content-tab-btn" data-content="books">Kitaplar</button>
                <button class="content-tab-btn" data-content="movies">Filmler</button>
                <button class="content-tab-btn" data-content="podcasts">Podcast'ler</button>
                <button class="content-tab-btn" data-content="quotes">Sözler</button>
            </div>
            
            <div class="content-search">
                <div class="search-bar">
                    <input type="text" placeholder="İçerik ara..." id="content-search-input">
                    <button class="search-btn"><i class="fas fa-search"></i></button>
                </div>
                <div class="filter-dropdown">
                    <button class="filter-btn">Kategoriler <i class="fas fa-chevron-down"></i></button>
                    <div class="filter-options">
                        <div class="filter-option" data-filter="time-management">Zaman Yönetimi</div>
                        <div class="filter-option" data-filter="study-techniques">Verimli Ders Çalışma Teknikleri</div>
                        <div class="filter-option" data-filter="career-paths">Kariyer Yolları</div>
                        <div class="filter-option" data-filter="university-guide">Üniversite ve Bölüm Tanıtımları</div>
                    </div>
                </div>
            </div>
            
            <div class="content-list-container">
                <div class="content-list active" id="articles-list">
                    ${this.renderArticles(content.articles)}
                </div>
                <div class="content-list" id="books-list">
                    ${this.renderBooks(content.books)}
                </div>
                <div class="content-list" id="movies-list">
                    ${this.renderMovies(content.movies)}
                </div>
                <div class="content-list" id="podcasts-list">
                    ${this.renderPodcasts(content.podcasts)}
                </div>
                <div class="content-list" id="quotes-list">
                    ${this.renderQuotes(content.quotes)}
                </div>
            </div>
        `;
        
        this.contentContainer.style.display = 'block';
        
        // Sekme butonları için olay dinleyiciler
        document.querySelectorAll('.content-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.content-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const contentType = btn.dataset.content;
                this.showContentList(contentType);
            });
        });
        
        // Arama çubuğu
        document.getElementById('content-search-input').addEventListener('input', (e) => {
            const query = e.target.value;
            this.searchContent(query);
        });
        
        // Filtre dropdown
        document.querySelector('.filter-btn').addEventListener('click', () => {
            document.querySelector('.filter-options').classList.toggle('show');
        });
        
        document.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', () => {
                const filter = option.dataset.filter;
                this.filterContent(filter);
                document.querySelector('.filter-options').classList.remove('show');
            });
        });
    }

    showContentList(contentType) {
        document.querySelectorAll('.content-list').forEach(list => {
            list.classList.remove('active');
        });
        document.getElementById(`${contentType}-list`).classList.add('active');
    }

    searchContent(query) {
        // Gerçek uygulamada controller'dan arama yapılacak
        console.log(`Aranan: ${query}`);
    }

    filterContent(filter) {
        // Gerçek uygulamada controller'dan filtreleme yapılacak
        console.log(`Filtre: ${filter}`);
    }

    renderArticles(articles) {
        if (!articles || articles.length === 0) {
            return '<p class="no-content">Makale bulunamadı.</p>';
        }
        
        return articles.map(article => `
            <div class="content-item article-item">
                <div class="content-image">
                    <img src="${article.image || 'https://picsum.photos/seed/article/300/200.jpg'}" alt="${article.title}">
                </div>
                <div class="content-details">
                    <div class="content-category">${article.category}</div>
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <div class="content-meta">
                        <span><i class="fas fa-user"></i> ${article.author}</span>
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(article.date)}</span>
                        <span><i class="fas fa-eye"></i> ${article.views || 0} görüntülenme</span>
                    </div>
                    <a href="#" class="read-more-btn" data-id="${article.id}">Devamını Oku</a>
                </div>
            </div>
        `).join('');
    }

    renderBooks(books) {
        if (!books || books.length === 0) {
            return '<p class="no-content">Kitap bulunamadı.</p>';
        }
        
        return books.map(book => `
            <div class="content-item book-item">
                <div class="book-cover">
                    <img src="${book.cover || 'https://picsum.photos/seed/book/200/300.jpg'}" alt="${book.title}">
                </div>
                <div class="book-details">
                    <h3>${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <div class="book-rating">
                        ${this.renderRating(book.rating)}
                        <span>(${book.reviews || 0} değerlendirme)</span>
                    </div>
                    <p class="book-description">${book.description}</p>
                    <div class="book-meta">
                        <span><i class="fas fa-tag"></i> ${book.category}</span>
                        <span><i class="fas fa-calendar"></i> ${book.year || ''}</span>
                    </div>
                    <div class="book-actions">
                        <button class="btn btn-primary add-to-list-btn" data-id="${book.id}">Listeme Ekle</button>
                        <button class="btn btn-secondary view-details-btn" data-id="${book.id}">Detaylar</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderMovies(movies) {
        if (!movies || movies.length === 0) {
            return '<p class="no-content">Film bulunamadı.</p>';
        }
        
        return movies.map(movie => `
            <div class="content-item movie-item">
                <div class="movie-poster">
                    <img src="${movie.poster || 'https://picsum.photos/seed/movie/300/450.jpg'}" alt="${movie.title}">
                </div>
                <div class="movie-details">
                    <h3>${movie.title} (${movie.year})</h3>
                    <div class="movie-rating">
                        ${this.renderRating(movie.rating)}
                        <span>(${movie.reviews || 0} değerlendirme)</span>
                    </div>
                    <p class="movie-description">${movie.description}</p>
                    <div class="movie-meta">
                        <span><i class="fas fa-tag"></i> ${movie.genre}</span>
                        <span><i class="fas fa-clock"></i> ${movie.duration}</span>
                    </div>
                    <div class="movie-actions">
                        <button class="btn btn-primary add-to-watchlist-btn" data-id="${movie.id}">İzleme Listem</button>
                        <button class="btn btn-secondary view-details-btn" data-id="${movie.id}">Detaylar</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderPodcasts(podcasts) {
        if (!podcasts || podcasts.length === 0) {
            return '<p class="no-content">Podcast bulunamadı.</p>';
        }
        
        return podcasts.map(podcast => `
            <div class="content-item podcast-item">
                <div class="podcast-cover">
                    <img src="${podcast.cover || 'https://picsum.photos/seed/podcast/300/300.jpg'}" alt="${podcast.title}">
                    <div class="play-btn"><i class="fas fa-play"></i></div>
                </div>
                <div class="podcast-details">
                    <h3>${podcast.title}</h3>
                    <p class="podcast-host">${podcast.host}</p>
                    <p class="podcast-description">${podcast.description}</p>
                    <div class="podcast-meta">
                        <span><i class="fas fa-tag"></i> ${podcast.category}</span>
                        <span><i class="fas fa-clock"></i> ${podcast.duration}</span>
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(podcast.date)}</span>
                    </div>
                    <div class="podcast-actions">
                        <button class="btn btn-primary play-podcast-btn" data-id="${podcast.id}">Dinle</button>
                        <button class="btn btn-secondary view-details-btn" data-id="${podcast.id}">Detaylar</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderQuotes(quotes) {
        if (!quotes || quotes.length === 0) {
            return '<p class="no-content">Söz bulunamadı.</p>';
        }
        
        return quotes.map(quote => `
            <div class="content-item quote-item">
                <div class="quote-content">
                    <i class="fas fa-quote-left"></i>
                    <p>${quote.text}</p>
                </div>
                <div class="quote-author">
                    <span>- ${quote.author}</span>
                </div>
                <div class="quote-actions">
                    <button class="btn-icon favorite-btn" data-id="${quote.id}">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="btn-icon share-btn" data-id="${quote.id}">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }

    hideContentPage() {
        this.contentContainer.style.display = 'none';
    }
}