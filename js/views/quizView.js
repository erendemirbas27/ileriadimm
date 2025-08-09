export default class QuizView {
    constructor() {
        this.quizContainer = document.createElement('div');
        this.quizContainer.className = 'quiz-container';
        this.quizContainer.style.display = 'none';
        document.querySelector('.main-content .container').appendChild(this.quizContainer);
          const container = document.querySelector('.main-content .container');
        if (container) {
            container.appendChild(this.quizContainer);
        } else {
            console.warn('Container element not found, appending to body');
            document.body.appendChild(this.quizContainer);
        }
    
    }

    renderQuizPage(quizzes) {
        this.quizContainer.innerHTML = `
            <div class="section-header">
                <h2>Testler ve Sınavlar</h2>
                <p>Bilginizi ölçün ve geliştirin</p>
            </div>
            
            <div class="quiz-categories">
                <button class="category-btn active" data-category="all">Tümü</button>
                <button class="category-btn" data-category="math">Matematik</button>
                <button class="category-btn" data-category="science">Fen Bilimleri</button>
                <button class="category-btn" data-category="language">Dil</button>
                <button class="category-btn" data-category="general">Genel Kültür</button>
            </div>
            
            <div class="quizzes-grid">
                ${this.renderQuizzes(quizzes)}
            </div>
        `;
        
        this.quizContainer.style.display = 'block';
        
        // Kategori butonları için olay dinleyicileri
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                this.filterQuizzes(category);
            });
        });
    }

    renderQuizzes(quizzes) {
        return quizzes.map(quiz => `
            <div class="quiz-card" data-quiz-id="${quiz.id}">
                <div class="quiz-header">
                    <div class="quiz-category">${quiz.category}</div>
                    <div class="quiz-difficulty ${quiz.difficulty.toLowerCase()}">${quiz.difficulty}</div>
                </div>
                <div class="quiz-content">
                    <h3>${quiz.title}</h3>
                    <p>${quiz.description}</p>
                    <div class="quiz-meta">
                        <span><i class="fas fa-question-circle"></i> ${quiz.questionCount} Soru</span>
                        <span><i class="fas fa-clock"></i> ${quiz.duration} Dakika</span>
                        <span><i class="fas fa-star"></i> ${quiz.rating}</span>
                    </div>
                </div>
                <div class="quiz-footer">
                    <button class="btn btn-primary start-quiz-btn" data-quiz-id="${quiz.id}">Başla</button>
                    <button class="btn btn-secondary quiz-details-btn" data-quiz-id="${quiz.id}">Detaylar</button>
                </div>
            </div>
        `).join('');
    }

    filterQuizzes(category) {
        const allQuizzes = document.querySelectorAll('.quiz-card');
        
        if (category === 'all') {
            allQuizzes.forEach(quiz => quiz.style.display = 'block');
        } else {
            allQuizzes.forEach(quiz => {
                if (quiz.querySelector('.quiz-category').textContent.toLowerCase() === category) {
                    quiz.style.display = 'block';
                } else {
                    quiz.style.display = 'none';
                }
            });
        }
    }

    startQuiz(quizId) {
        const quiz = this.quizzes.find(q => q.id === quizId);
        
        const quizHtml = `
            <div class="quiz-overlay">
                <div class="quiz-modal">
                    <div class="quiz-header">
                        <h3>${quiz.title}</h3>
                        <div class="quiz-timer">
                            <i class="fas fa-clock"></i>
                            <span id="timer">${quiz.duration}:00</span>
                        </div>
                    </div>
                    
                    <div class="quiz-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">
                            Soru <span id="current-question">1</span> / ${quiz.questionCount}
                        </div>
                    </div>
                    
                    <div class="quiz-body">
                        <div class="question-container">
                            <div class="question-text">
                                ${quiz.questions[0].text}
                            </div>
                            <div class="question-options">
                                ${quiz.questions[0].options.map((option, index) => `
                                    <div class="option">
                                        <input type="radio" id="option-${index}" name="answer" value="${index}">
                                        <label for="option-${index}">${option}</label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="quiz-footer">
                        <button class="btn btn-secondary prev-question-btn" disabled>Önceki</button>
                        <button class="btn btn-primary next-question-btn">Sonraki</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', quizHtml);
        
        // Quiz olaylarını ayarla
        this.setupQuizEvents(quiz);
    }

    setupQuizEvents(quiz) {
        const nextBtn = document.querySelector('.next-question-btn');
        const prevBtn = document.querySelector('.prev-question-btn');
        const options = document.querySelectorAll('input[name="answer"]');
        let currentQuestion = 0;
        const answers = [];
        
        // Seçenek değişimi
        options.forEach(option => {
            option.addEventListener('change', () => {
                answers[currentQuestion] = option.value;
                nextBtn.disabled = false;
            });
        });
        
        // Sonraki soru
        nextBtn.addEventListener('click', () => {
            if (currentQuestion < quiz.questions.length - 1) {
                currentQuestion++;
                this.updateQuestion(quiz, currentQuestion, answers);
                
                prevBtn.disabled = false;
                if (currentQuestion === quiz.questions.length - 1) {
                    nextBtn.textContent = 'Bitir';
                }
            } else {
                // Quiz'i bitir
                this.finishQuiz(quiz, answers);
            }
        });
        
        // Önceki soru
        prevBtn.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                this.updateQuestion(quiz, currentQuestion, answers);
                
                nextBtn.textContent = currentQuestion === quiz.questions.length - 1 ? 'Bitir' : 'Sonraki';
                if (currentQuestion === 0) {
                    prevBtn.disabled = true;
                }
            }
        });
    }

    updateQuestion(quiz, questionIndex, answers) {
        const question = quiz.questions[questionIndex];
        
        document.querySelector('.question-text').textContent = question.text;
        document.getElementById('current-question').textContent = questionIndex + 1;
        
        // İlerleme çubuğunu güncelle
        const progress = ((questionIndex + 1) / quiz.questions.length) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        
        // Seçenekleri güncelle
        const optionsContainer = document.querySelector('.question-options');
        optionsContainer.innerHTML = question.options.map((option, index) => `
            <div class="option">
                <input type="radio" id="option-${index}" name="answer" value="${index}" ${answers[questionIndex] == index ? 'checked' : ''}>
                <label for="option-${index}">${option}</label>
            </div>
        `).join('');
        
        // Seçenek olaylarını yeniden bağla
        document.querySelectorAll('input[name="answer"]').forEach(option => {
            option.addEventListener('change', () => {
                answers[questionIndex] = option.value;
                document.querySelector('.next-question-btn').disabled = false;
            });
        });
        
        // Önceki cevap varsa butonu aktif et
        document.querySelector('.next-question-btn').disabled = answers[questionIndex] === undefined;
    }

    finishQuiz(quiz, answers) {
        // Skoru hesapla
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer == quiz.questions[index].correctAnswer) {
                score++;
            }
        });
        
        const percentage = Math.round((score / quiz.questions.length) * 100);
        
        // Sonuç ekranını göster
        const resultHtml = `
            <div class="quiz-result">
                <div class="result-header">
                    <h3>Test Tamamlandı!</h3>
                    <div class="result-score">${score}/${quiz.questions.length} (${percentage}%)</div>
                </div>
                
                <div class="result-message">
                    ${percentage >= 80 ? 
                        '<i class="fas fa-trophy"></i> <p>Tebrikler! Harika bir sonuç aldınız.</p>' : 
                        percentage >= 60 ? 
                        '<i class="fas fa-thumbs-up"></i> <p>İyi bir sonuç! Daha iyisi için çalışmaya devam edin.</p>' : 
                        '<i class="fas fa-redo"></i> <p>Biraz daha çalışmanız gerekebilir. Pes etmeyin!</p>'
                    }
                </div>
                
                <div class="result-actions">
                    <button class="btn btn-primary review-answers-btn">Cevapları İncele</button>
                    <button class="btn btn-secondary retry-quiz-btn">Yeniden Dene</button>
                    <button class="btn btn-secondary close-quiz-btn">Kapat</button>
                </div>
            </div>
        `;
        
        document.querySelector('.quiz-modal').innerHTML = resultHtml;
        
        // Buton olayları
        document.querySelector('.close-quiz-btn').addEventListener('click', () => {
            document.querySelector('.quiz-overlay').remove();
        });
        
        document.querySelector('.retry-quiz-btn').addEventListener('click', () => {
            document.querySelector('.quiz-overlay').remove();
            this.startQuiz(quiz.id);
        });
        
        document.querySelector('.review-answers-btn').addEventListener('click', () => {
            this.showQuizReview(quiz, answers);
        });
    }

    showQuizReview(quiz, answers) {
        let reviewHtml = '<div class="quiz-review"><h3>Cevapları İncele</h3><div class="review-questions">';
        
        quiz.questions.forEach((question, index) => {
            const isCorrect = answers[index] == question.correctAnswer;
            
            reviewHtml += `
                <div class="review-question ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="question-number">Soru ${index + 1}</div>
                    <div class="question-text">${question.text}</div>
                    <div class="question-options">
                        ${question.options.map((option, optIndex) => `
                            <div class="option ${optIndex == question.correctAnswer ? 'correct-answer' : ''} ${optIndex == answers[index] && !isCorrect ? 'wrong-answer' : ''}">
                                ${option}
                                ${optIndex == question.correctAnswer ? '<i class="fas fa-check"></i>' : ''}
                                ${optIndex == answers[index] && !isCorrect ? '<i class="fas fa-times"></i>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        reviewHtml += '</div><button class="btn btn-secondary close-review-btn">Kapat</button></div>';
        
        document.querySelector('.quiz-modal').innerHTML = reviewHtml;
        
        document.querySelector('.close-review-btn').addEventListener('click', () => {
            document.querySelector('.quiz-overlay').remove();
        });
    }

    hideQuizPage() {
        this.quizContainer.style.display = 'none';
    }
}