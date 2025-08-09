export default class MentorView {
    constructor() {
        this.mentorContainer = document.createElement('div');
        this.mentorContainer.className = 'mentor-container';
        this.mentorContainer.style.display = 'none';
        document.querySelector('.main-content .container').appendChild(this.mentorContainer);
        const container = document.querySelector('.main-content .container');
        if (container) {
            container.appendChild(this.mentorContainer);
        } else {
            console.warn('Container element not found, appending to body');
            document.body.appendChild(this.mentorContainer);
        }
    }
    

    renderMentorPage(mentors) {
        this.mentorContainer.innerHTML = `
            <div class="section-header">
                <h2>Akran Mentorluğu</h2>
                <p>Daha büyük sınıflardaki öğrencilerden destek alın</p>
            </div>
            
            <div class="mentor-filters">
                <div class="filter-group">
                    <label for="school-filter">Okul:</label>
                    <select id="school-filter">
                        <option value="">Tümü</option>
                        <option value="boğaziçi">Boğaziçi Üniversitesi</option>
                        <option value="odtü">ODTÜ</option>
                        <option value="sabancı">Sabancı Üniversitesi</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="department-filter">Bölüm:</label>
                    <select id="department-filter">
                        <option value="">Tümü</option>
                        <option value="bilgisayar">Bilgisayar Mühendisliği</option>
                        <option value="elektronik">Elektronik Mühendisliği</option>
                        <option value="işletme">İşletme</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="subject-filter">Konu:</label>
                    <select id="subject-filter">
                        <option value="">Tümü</option>
                        <option value="matematik">Matematik</option>
                        <option value="fizik">Fizik</option>
                        <option value="programlama">Programlama</option>
                    </select>
                </div>
                
                <button class="btn btn-primary">Filtrele</button>
            </div>
            
            <div class="mentors-grid">
                ${this.renderMentors(mentors)}
            </div>
        `;
        
        this.mentorContainer.style.display = 'block';
    }

    renderMentors(mentors) {
        return mentors.map(mentor => `
            <div class="mentor-card">
                <div class="mentor-avatar">
                    <img src="${mentor.avatar || 'https://picsum.photos/seed/mentor/100/100.jpg'}" alt="${mentor.name}">
                </div>
                <div class="mentor-info">
                    <h3>${mentor.name}</h3>
                    <p>${mentor.school} - ${mentor.department}</p>
                    <div class="mentor-subjects">
                        ${mentor.subjects.map(subject => `<span class="subject-tag">${subject}</span>`).join('')}
                    </div>
                    <p class="mentor-bio">${mentor.bio}</p>
                    <div class="mentor-rating">
                        ${this.renderRating(mentor.rating)} (${mentor.reviews} değerlendirme)
                    </div>
                </div>
                <div class="mentor-actions">
                    <button class="btn btn-primary mentor-request-btn" data-mentor-id="${mentor.id}">Mentorluk İste</button>
                    <button class="btn btn-secondary mentor-profile-btn" data-mentor-id="${mentor.id}">Profili Gör</button>
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

    showMentorRequestForm(mentorId) {
        const mentor = this.mentors.find(m => m.id === mentorId);
        
        const formHtml = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Mentorluk İsteği Gönder</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="mentor-summary">
                            <img src="${mentor.avatar || 'https://picsum.photos/seed/mentor/50/50.jpg'}" alt="${mentor.name}">
                            <div>
                                <h4>${mentor.name}</h4>
                                <p>${mentor.school} - ${mentor.department}</p>
                            </div>
                        </div>
                        
                        <form id="mentor-request-form">
                            <div class="form-group">
                                <label for="request-subject">Konu:</label>
                                <select id="request-subject" required>
                                    <option value="">Seçiniz</option>
                                    ${mentor.subjects.map(subject => `<option value="${subject}">${subject}</option>`).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="request-message">Mesajınız:</label>
                                <textarea id="request-message" rows="5" placeholder="Mentora göndermek istediğiniz mesajı yazın..." required></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label for="request-frequency">Sıklık:</label>
                                <select id="request-frequency" required>
                                    <option value="">Seçiniz</option>
                                    <option value="weekly">Haftalık</option>
                                    <option value="biweekly">İki Haftada Bir</option>
                                    <option value="monthly">Aylık</option>
                                </select>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Gönder</button>
                                <button type="button" class="btn btn-secondary modal-close">İptal</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
        
        // Modal kapatma olayları
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.modal-overlay').remove();
            });
        });
        
        // Form gönderme
        document.getElementById('mentor-request-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const subject = document.getElementById('request-subject').value;
            const message = document.getElementById('request-message').value;
            const frequency = document.getElementById('request-frequency').value;
            
            // Form verilerini controller'a gönder
            this.controller.submitMentorRequest(mentorId, { subject, message, frequency });
            
            // Modal'ı kapat
            document.querySelector('.modal-overlay').remove();
        });
    }

    hideMentorPage() {
        this.mentorContainer.style.display = 'none';
    }
}