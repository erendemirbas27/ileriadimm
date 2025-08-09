export default class DataModel {
    constructor() {
        this.mentors = [];
        this.content = {
            articles: [],
            quotes: [],
            books: [],
            movies: [],
            podcasts: []
        };
        this.quizzes = [];
        this.events = [];
        this.projects = [];
        this.clubs = [];
        this.news = [];
    }

    async loadData() {
        try {
            // API'den veri çek
            const [mentorsRes, contentRes, quizzesRes, eventsRes] = await Promise.all([
                fetch('../php/api/mentors.php'),
                fetch('../php/api/content.php?type=articles'),
                fetch('../php/api/quizzes.php'),
                fetch('../php/api/events.php')
            ]);

            this.mentors = await mentorsRes.json();
            this.content.articles = await contentRes.json();
            this.quizzes = await quizzesRes.json();
            this.events = await eventsRes.json();

            // Diğer içerik türlerini çek
            const booksRes = await fetch('../php/api/content.php?type=books');
            this.content.books = await booksRes.json();

            const moviesRes = await fetch('../php/api/content.php?type=movies');
            this.content.movies = await moviesRes.json();

            const podcastsRes = await fetch('../php/api/content.php?type=podcasts');
            this.content.podcasts = await podcastsRes.json();

            const quotesRes = await fetch('../php/api/content.php?type=quotes');
            this.content.quotes = [await quotesRes.json()]; // Tek bir söz geliyor

            const newsRes = await fetch('../php/api/content.php?type=news');
            this.content.news = await newsRes.json();

            return {
                mentors: this.mentors,
                content: this.content,
                quizzes: this.quizzes,
                events: this.events
            };
        } catch (error) {
            console.error('Veri yükleme hatası:', error);
            return null;
        }
    }

    async getMentors() {
        try {
            const response = await fetch('../php/api/mentors.php');
            return await response.json();
        } catch (error) {
            console.error('Mentorlar yüklenemedi:', error);
            return [];
        }
    }

    async getContent(type) {
        try {
            const response = await fetch(`../php/api/content.php?type=${type}`);
            return await response.json();
        } catch (error) {
            console.error(`${type} yüklenemedi:`, error);
            return [];
        }
    }

    async getQuizzes() {
        try {
            const response = await fetch('../php/api/quizzes.php');
            return await response.json();
        } catch (error) {
            console.error('Testler yüklenemedi:', error);
            return [];
        }
    }

    async getEvents() {
        try {
            const response = await fetch('../php/api/events.php');
            return await response.json();
        } catch (error) {
            console.error('Etkinlikler yüklenemedi:', error);
            return [];
        }
    }

    async submitMentorRequest(requestData) {
        try {
            const response = await fetch('../php/api/mentors.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            return await response.json();
        } catch (error) {
            console.error('Mentorluk isteği gönderilemedi:', error);
            return { success: false, error: 'İstek gönderilemedi' };
        }
    }

    async submitQuizResult(resultData) {
        try {
            const response = await fetch('../php/api/quizzes.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resultData)
            });
            return await response.json();
        } catch (error) {
            console.error('Test sonucu gönderilemedi:', error);
            return { success: false, error: 'Sonuç gönderilemedi' };
        }
    }

    async addEvent(eventData) {
        try {
            const response = await fetch('../php/api/events.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
            return await response.json();
        } catch (error) {
            console.error('Etkinlik eklenemedi:', error);
            return { success: false, error: 'Etkinlik eklenemedi' };
        }
    }

    async updateEvent(eventId, eventData) {
        try {
            const response = await fetch(`../php/api/events.php?id=${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(eventData)
            });
            return await response.json();
        } catch (error) {
            console.error('Etkinlik güncellenemedi:', error);
            return { success: false, error: 'Etkinlik güncellenemedi' };
        }
    }

    async deleteEvent(eventId) {
        try {
            const response = await fetch(`../php/api/events.php?id=${eventId}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Etkinlik silinemedi:', error);
            return { success: false, error: 'Etkinlik silinemedi' };
        }
    }
}