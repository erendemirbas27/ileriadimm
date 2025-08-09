export default class HomeView {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.featuresGrid = document.querySelector('.features-grid');
        this.contentSections = document.querySelector('.content-sections');
        this.upcomingEvents = document.querySelector('.upcoming-events');
        this.projectShowcase = document.querySelector('.project-showcase');
    }

    renderHomePage(data) {
        this.renderHero();
        this.renderFeatures();
        this.renderContentSections(data.content);
        this.renderUpcomingEvents(data.events);
        this.renderProjectShowcase(data.projects);
    }

    renderHero() {
        // Hero bölümü zaten HTML'de mevcut, dinamik olarak güncellenebilir
    }

    renderFeatures() {
        // Özellikler zaten HTML'de mevcut, dinamik olarak güncellenebilir
    }

    renderContentSections(content) {
        // Gün sözü
        const quoteCard = document.querySelector('.quote-card p');
        const quoteAuthor = document.querySelector('.quote-card span');
        
        if (content.quotes && content.quotes.length > 0) {
            const randomQuote = content.quotes[Math.floor(Math.random() * content.quotes.length)];
            quoteCard.textContent = `"${randomQuote.text}"`;
            quoteAuthor.textContent = `- ${randomQuote.author}`;
        }
        
        // Makaleler
        const articlesGrid = document.querySelector('#articles .content-grid');
        if (content.articles && content.articles.length > 0) {
            articlesGrid.innerHTML = '';
            content.articles.slice(0, 4).forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'content-card';
                articleCard.innerHTML = `
                    <div class="content-image">
                        <img src="${article.image || 'https://picsum.photos/seed/article/300/200.jpg'}" alt="Makale">
                    </div>
                    <div class="content-info">
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <a href="#" class="read-more">Devamını Oku</a>
                    </div>
                `;
                articlesGrid.appendChild(articleCard);
            });
        }
        
        // Kitap önerileri
        const bookList = document.querySelector('#books .book-list');
        if (content.books && content.books.length > 0) {
            bookList.innerHTML = '';
            content.books.slice(0, 3).forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.className = 'book-item';
                bookItem.innerHTML = `
                    <div class="book-cover">
                        <img src="${book.cover || 'https://picsum.photos/seed/book/100/150.jpg'}" alt="Kitap">
                    </div>
                    <div class="book-info">
                        <h4>${book.title}</h4>
                        <p>${book.author}</p>
                        <div class="rating">
                            ${this.renderRating(book.rating)}
                        </div>
                    </div>
                `;
                bookList.appendChild(bookItem);
            });
        }
        
        // Haberler
        const newsList = document.querySelector('#news .news-list');
        if (content.news && content.news.length > 0) {
            newsList.innerHTML = '';
            content.news.slice(0, 3).forEach(newsItem => {
                const newsElement = document.createElement('div');
                newsElement.className = 'news-item';
                newsElement.innerHTML = `
                    <div class="news-date">${this.formatDate(newsItem.date)}</div>
                    <h4>${newsItem.title}</h4>
                    <p>${newsItem.summary}</p>
                    <a href="#" class="read-more">Detaylar</a>
                `;
                newsList.appendChild(newsElement);
            });
        }
    }

    renderUpcomingEvents(events) {
        const eventsGrid = document.querySelector('.events-grid');
        if (events && events.length > 0) {
            eventsGrid.innerHTML = '';
            events.slice(0, 4).forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                
                const eventDate = new Date(event.date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleDateString('tr-TR', { month: 'short' });
                
                eventCard.innerHTML = `
                    <div class="event-date">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                    <div class="event-info">
                        <h4>${event.title}</h4>
                        <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                        <p><i class="fas fa-clock"></i> ${event.time}</p>
                    </div>
                `;
                eventsGrid.appendChild(eventCard);
            });
        }
    }

    renderProjectShowcase(projects) {
        const projectGrid = document.querySelector('.project-grid');
        if (projects && projects.length > 0) {
            projectGrid.innerHTML = '';
            projects.slice(0, 4).forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <div class="project-image">
                        <img src="${project.image || 'https://picsum.photos/seed/project/400/300.jpg'}" alt="Proje">
                        <div class="project-category">${project.category}</div>
                    </div>
                    <div class="project-info">
                        <h4>${project.title}</h4>
                        <p>${project.description}</p>
                        <div class="project-author">
                            <img src="${project.authorAvatar || 'https://picsum.photos/seed/author/30/30.jpg'}" alt="Yazar">
                            <span>${project.authorName}</span>
                        </div>
                    </div>
                `;
                projectGrid.appendChild(projectCard);
            });
        }
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
}