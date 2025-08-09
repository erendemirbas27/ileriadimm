export default class UserModel {
    constructor() {
        this.currentUser = null;
        this.mentorshipApplications = [];
    }

    login(userData) {
        // Gerçek uygulamada API ile doğrulama yapılacak
        this.currentUser = {
            id: userData.id || 1,
            name: userData.name || 'Öğrenci',
            email: userData.email || 'ogrenci@example.com',
            school: userData.school || 'Örnek Üniversite',
            grade: userData.grade || '3. Sınıf',
            avatar: userData.avatar || 'https://picsum.photos/seed/user/40/40.jpg'
        };
        
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    applyForMentorship(mentorId, message) {
        const application = {
            id: Date.now(),
            mentorId,
            studentId: this.currentUser.id,
            message,
            status: 'pending',
            date: new Date().toISOString()
        };
        
        this.mentorshipApplications.push(application);
        return application;
    }

    getMentorshipApplications() {
        return this.mentorshipApplications;
    }
}