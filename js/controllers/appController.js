import DataModel from '../models/dataModel.js';
import UserModel from '../models/userModel.js';
import AppView from '../views/appView.js';
import HomeView from '../views/homeView.js';
import MentorController from './mentorController.js';
import QuizController from './quizController.js';
import ContentController from './contentController.js';
import CalendarController from './calendarController.js';

export default class AppController {
    constructor() {
        this.dataModel = new DataModel();
        this.userModel = new UserModel();
        this.appView = new AppView();
        this.homeView = new HomeView();
        
        // Alt controller'lar
        this.mentorController = new MentorController(this.dataModel, this.userModel);
        this.quizController = new QuizController(this.dataModel);
        this.contentController = new ContentController(this.dataModel);
        this.calendarController = new CalendarController(this.dataModel);
        
        this.currentPage = 'home';
    }

    async init() {
        // Verileri yükle
        const data = await this.dataModel.loadData();
        
        // Kullanıcıyı oturum açtır (örnek)
        this.userModel.login({ name: 'Öğrenci', email: 'ogrenci@example.com' });
        
        // Ana sayfayı render et
        this.homeView.renderHomePage(data);
        
        // View'leri başlat
        this.appView.init();
        
        // Sayfa değiştirme olaylarını ayarla
        this.setupPageNavigation();
        
        console.log('İleri Adım uygulaması başlatıldı');
    }

    setupPageNavigation() {
        // Ana menüden sayfa değiştirme
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.changePage(page);
            });
        });
        
        // Özellik kartlarından sayfa değiştirme
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', () => {
                const feature = card.dataset.feature;
                this.navigateToFeature(feature);
            });
        });
    }

    changePage(page) {
        // Tüm sayfaları gizle
        this.hideAllPages();
        
        // İlgili sayfayı göster
        switch (page) {
            case 'home':
                this.showHomePage();
                break;
            case 'mentor':
                this.mentorController.showMentorPage();
                break;
            case 'content':
                this.contentController.showContentPage();
                break;
            case 'quiz':
                this.quizController.showQuizPage();
                break;
            case 'events':
                this.calendarController.showCalendarPage();
                break;
            default:
                this.showHomePage();
        }
        
        this.currentPage = page;
    }

    navigateToFeature(feature) {
        // Özelliklere göre sayfa yönlendirmesi
        switch (feature) {
            case 'mentor':
                this.changePage('mentor');
                break;
            case 'content':
                this.changePage('content');
                break;
            case 'quiz':
                this.changePage('quiz');
                break;
            case 'events':
                this.changePage('events');
                break;
            case 'project':
                this.changePage('content');
                // Proje sekmesini aktif et
                setTimeout(() => {
                    document.querySelector('.content-tab-btn[data-content="projects"]').click();
                }, 100);
                break;
            case 'clubs':
                this.changePage('content');
                // Kulüpler sekmesini aktif et
                setTimeout(() => {
                    document.querySelector('.content-tab-btn[data-content="clubs"]').click();
                }, 100);
                break;
            default:
                this.showHomePage();
        }
    }

    showHomePage() {
        // Ana sayfa içeriğini göster
        document.querySelector('.hero').style.display = 'grid';
        document.querySelector('.features').style.display = 'block';
        document.querySelector('.content-sections').style.display = 'block';
        document.querySelector('.upcoming-events').style.display = 'block';
        document.querySelector('.project-showcase').style.display = 'block';
    }

    hideAllPages() {
        // Ana sayfa bölümlerini gizle
        document.querySelector('.hero').style.display = 'none';
        document.querySelector('.features').style.display = 'none';
        document.querySelector('.content-sections').style.display = 'none';
        document.querySelector('.upcoming-events').style.display = 'none';
        document.querySelector('.project-showcase').style.display = 'none';
        
        // Diğer sayfaları gizle
        this.mentorController.hideMentorPage();
        this.quizController.hideQuizPage();
        this.contentController.hideContentPage();
        this.calendarController.hideCalendarPage();
    }
}