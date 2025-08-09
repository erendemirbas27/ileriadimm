import MentorView from '../views/mentorView.js';

export default class MentorController {
    constructor(dataModel, userModel) {
        this.dataModel = dataModel;
        this.userModel = userModel;
        this.mentorView = new MentorView();
        
        // View'e controller referansını ver
        this.mentorView.controller = this;
    }

    showMentorPage() {
        const mentors = this.dataModel.getMentors();
        this.mentorView.renderMentorPage(mentors);
        
        // Mentorluk isteği butonları için olay dinleyiciler
        document.querySelectorAll('.mentor-request-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mentorId = parseInt(btn.dataset.mentorId);
                this.mentorView.showMentorRequestForm(mentorId);
            });
        });
        
        // Profil görüntüleme butonları için olay dinleyiciler
        document.querySelectorAll('.mentor-profile-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mentorId = parseInt(btn.dataset.mentorId);
                this.showMentorProfile(mentorId);
            });
        });
    }

    hideMentorPage() {
        this.mentorView.hideMentorPage();
    }

    submitMentorRequest(mentorId, requestData) {
        const mentor = this.dataModel.getMentors().find(m => m.id === mentorId);
        
        if (!mentor) {
            console.error('Mentor bulunamadı');
            return;
        }
        
        // Mentorluk isteğini kaydet
        const application = this.userModel.applyForMentorship(mentorId, requestData.message);
        
        // Gerçek uygulamada API'ye istek gönderilecek
        console.log('Mentorluk isteği gönderildi:', {
            mentor: mentor.name,
            student: this.userModel.getCurrentUser().name,
            subject: requestData.subject,
            message: requestData.message,
            frequency: requestData.frequency
        });
        
        // Kullanıcıya bildirim göster
        this.showNotification('Mentorluk isteğiniz başarıyla gönderildi!');
    }

    showMentorProfile(mentorId) {
        const mentor = this.dataModel.getMentors().find(m => m.id === mentorId);
        
        if (!mentor) {
            console.error('Mentor bulunamadı');
            return;
        }
        
        // Profil sayfasını göster
        console.log('Mentor profili gösteriliyor:', mentor.name);
        
        // Gerçek uygulamada profil detay sayfası render edilecek
        alert(`${mentor.name} profil sayfası gösterilecek`);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
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