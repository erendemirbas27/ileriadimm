import QuizView from '../views/quizView.js';

export default class QuizController {
    constructor(dataModel) {
        this.dataModel = dataModel;
        this.quizView = new QuizView();
        
        // View'e controller referansını ver
        this.quizView.controller = this;
    }

    showQuizPage() {
        const quizzes = this.dataModel.getQuizzes();
        this.quizView.renderQuizPage(quizzes);
        
        // Quiz başlatma butonları için olay dinleyiciler
        document.querySelectorAll('.start-quiz-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const quizId = parseInt(btn.dataset.quizId);
                this.startQuiz(quizId);
            });
        });
        
        // Quiz detay butonları için olay dinleyiciler
        document.querySelectorAll('.quiz-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const quizId = parseInt(btn.dataset.quizId);
                this.showQuizDetails(quizId);
            });
        });
    }

    hideQuizPage() {
        this.quizView.hideQuizPage();
    }

    startQuiz(quizId) {
        const quiz = this.dataModel.getQuizzes().find(q => q.id === quizId);
        
        if (!quiz) {
            console.error('Quiz bulunamadı');
            return;
        }
        
        // Quiz'i başlat
        this.quizView.startQuiz(quizId);
        
        // Quiz verilerini view'e aktar
        this.quizView.quizzes = this.dataModel.getQuizzes();
    }

    showQuizDetails(quizId) {
        const quiz = this.dataModel.getQuizzes().find(q => q.id === quizId);
        
        if (!quiz) {
            console.error('Quiz bulunamadı');
            return;
        }
        
        // Quiz detaylarını göster
        console.log('Quiz detayları:', quiz.title);
        
        // Gerçek uygulamada quiz detay sayfası render edilecek
        alert(`${quiz.title} detayları gösterilecek`);
    }

    submitQuizResults(quizId, answers) {
        const quiz = this.dataModel.getQuizzes().find(q => q.id === quizId);
        
        if (!quiz) {
            console.error('Quiz bulunamadı');
            return;
        }
        
        // Skoru hesapla
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer == quiz.questions[index].correctAnswer) {
                score++;
            }
        });
        
        const percentage = Math.round((score / quiz.questions.length) * 100);
        
        // Gerçek uygulamada API'ye sonuç gönderilecek
        console.log('Quiz sonuçları:', {
            quiz: quiz.title,
            score: `${score}/${quiz.questions.length}`,
            percentage: `${percentage}%`
        });
        
        return { score, percentage };
    }
}