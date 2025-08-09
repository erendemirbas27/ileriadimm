import CalendarView from '../views/calendarView.js';

export default class CalendarController {
    constructor(dataModel) {
        this.dataModel = dataModel;
        this.calendarView = new CalendarView();
        
        // View'e controller referansını ver
        this.calendarView.controller = this;
    }

    showCalendarPage() {
        const events = this.dataModel.getEvents();
        this.calendarView.renderCalendarPage(events);
    }

    hideCalendarPage() {
        this.calendarView.hideCalendarPage();
    }

    addEvent(eventData) {
        // Yeni etkinlik ekle
        const newEvent = {
            id: Date.now(),
            ...eventData
        };
        
        // Gerçek uygulamada API'ye istek gönderilecek
        console.log('Yeni etkinlik eklendi:', newEvent);
        
        // Etkinlikleri güncelle
        const events = this.dataModel.getEvents();
        events.push(newEvent);
        
        // Takvimi yeniden render et
        this.calendarView.renderCalendarPage(events);
        
        // Bildirim göster
        this.showNotification('Etkinlik başarıyla eklendi!');
    }

    editEvent(eventId) {
        // Etkinliği düzenle
        console.log(`Etkinlik düzenleniyor: ID ${eventId}`);
        
        // Gerçek uygulamada düzenleme formu gösterilecek
        this.showNotification('Etkinlik düzenleme formu gösterilecek');
    }

    deleteEvent(eventId) {
        // Etkinliği sil
        console.log(`Etkinlik siliniyor: ID ${eventId}`);
        
        // Gerçek uygulamada API'ye istek gönderilecek
        const events = this.dataModel.getEvents();
        const eventIndex = events.findIndex(e => e.id === eventId);
        
        if (eventIndex !== -1) {
            events.splice(eventIndex, 1);
            
            // Takvimi yeniden render et
            this.calendarView.renderCalendarPage(events);
            
            // Bildirim göster
            this.showNotification('Etkinlik silindi');
        }
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